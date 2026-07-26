---
title: sdb, the debug bridge
description: The Sinty Debug Bridge connects a development host to a device over the network, with paired-key authentication instead of a cable.
---

`sdb` is the Sinty Debug Bridge. A development host connects to a Sinty OS device
over the network and runs a shell, transfers files, forwards ports and streams
logs, with paired-key authentication instead of a cable.

It is two binaries built from one source tree:

| binary | runs on | purpose |
|---|---|---|
| `sdbd` | the device | daemon that accepts paired hosts and serves the on-device control API |
| `sdb` | the development host | client that pairs with a device and drives it over that pairing |

Unlike a USB debug bridge, `sdbd` works over TCP, so it fits a laptop with no
device-mode USB controller. The first connection to a device is authorized by a
one-time code shown on the device's own screen; every later connection uses the
stored key alone.

:::caution[Off by default]
The bridge never runs on its own. `sdbd` starts only when both switches are on:
developer options in Settings (marker `/etc/atom/dev.enabled`) and the bridge
itself (marker `/var/lib/sinty-sdb/enabled`). Turn either off and the daemon
stops, so a device carries no network listener until its owner asks for one.
:::

## Pairing

The first time a host talks to a device, it pairs. The device shows a short,
single-use code and the host key fingerprint; you read the code into the host and
check the fingerprint by eye. The code proves you are physically at the device,
the fingerprint proves no one interposed a key. Both are required, and pairing is
rate limited with progressive backoff.

```sh
sdb pair <address>       pair with a device using the code on its screen
sdb devices              list the devices this host is paired with
sdb revoke <label>       remove a paired host from a device's keyring
```

After pairing, a connection authenticates by the stored key alone. An unknown key
is refused, with no first-connection grace.

## Working with a device

Each command runs over one multiplexed session with a paired device:

```sh
sdb shell [--root] [cmd...]     run a command or an interactive shell
sdb push <local> <remote>       copy a file to the device
sdb pull <remote> <local>       copy a file from the device
sdb logs [unit]                 stream a unit's captured logs
sdb forward <local> <device>    tunnel a local address to a device address
sdb forward -R <bind> <target>  reverse tunnel: the device binds and reaches back
sdb assist                      run a read-only diagnostic session in memory
```

## Shell tiers

A shell runs at one of three tiers:

- **The logged-in user**, by default. A paired host is the owner's own machine on
  the owner's own device, so an ordinary shell is just the owner's session.
- **An isolated bridge account**, when no one is logged in. It carries no
  privileged groups and cannot read the owner's encrypted home or reach the
  display seat.
- **Root**, with `--root`, only on a device the owner has deliberately
  [unlocked](/docs/os/rooting/) and only after a per-action confirmation on the
  device itself. It fails closed to a non-root shell otherwise.

Ordinary commands from a paired host do not prompt again. Privileged actions do: a
root shell, a write outside the transfer sandbox, or binding a low port each goes
through the broker for a confirmation on the device, and the daemon grants nothing
on its own.

## Remote assistance

`sdb assist` is a bounded, non-root session for remote support that needs no
rooting. Its diagnostic tool is embedded in the signed daemon, run from an
anonymous in-memory file for that session only and executed as the isolated bridge
account, so it reads diagnostics without the owner's data, without root, and
without leaving a privileged binary on disk.

## Security model

- Transport is TLS 1.3 with ed25519 device and host keys, pinned on both sides. An
  identity is the SHA-256 of the key, not a certificate chain.
- The daemon drops privilege for every shell. Root is never the default and never
  reachable without the owner both unlocking the device and confirming the action.
- Every privileged action is confirmed by the owner on the device before it runs;
  the daemon fails closed and grants nothing by itself.
- File transfers are confined to `/var/lib/sinty-sdb/files`, never follow a symlink
  out of that root, and are verified against a hash at the destination.
- An absent or damaged keystore trusts nobody.
