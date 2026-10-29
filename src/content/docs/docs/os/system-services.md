---
title: System services
description: The programs that run Sinty OS underneath the desktop, what each one replaces, and the interfaces apps reach them through.
---

Sinty OS does not use systemd. The first process is `sinit`, services are started
by [atom](/docs/atom-init/about/), and a set of system programs written for Sinty
OS do the jobs that a typical distribution spreads across many daemons.

Each one speaks the interface of the program it replaces, so apps and tools built
for those interfaces work unchanged. Write against the standard interface in the
last column and your app runs on Sinty OS and on other distributions alike.

| Service | What it does | In place of | Interface for apps |
|---|---|---|---|
| `sinit`, `atom` | start the system and its services | systemd | unit files, [`atomctl`](/docs/atom-init/atomctl/) |
| `sinty-devd` | handles devices as they appear, applies udev rules, creates `/dev` entries | udevd | libudev |
| `sinty-logind` | login screen, sessions, seat, power buttons | greetd, seatd, systemd-logind, accounts-daemon | `org.freedesktop.login1` |
| `sinty-nm` | Wi-Fi, wired networks and WireGuard VPN | NetworkManager | `org.freedesktop.NetworkManager`, `nmcli` ([details](/docs/os/networking/)) |
| `sinty-diskd` | disks, partitions, mounting, formatting | UDisks | `org.freedesktop.UDisks2` |
| `sinty-powerd` | batteries, power profiles, thermal limits | UPower, power-profiles-daemon | `org.freedesktop.UPower`, `org.freedesktop.UPower.PowerProfiles` |
| `sinty-hostnamed` | computer name | systemd-hostnamed | `org.freedesktop.hostname1` |
| `sinty-localed` | language and keyboard layout | systemd-localed | `org.freedesktop.locale1` |
| `sinty-timedated` | time, time zone, network time | systemd-timedated | `org.freedesktop.timedate1` |
| `sxid` | installs and updates SXI apps | none | `dev.sinty.SXI1` ([details](/docs/os/sxi-apps/)) |
| `updated` | system updates and their status | a package manager | the Settings update page |
| `sinty-computed` | reuse of computed results across apps | none | `dev.sinty.Compute` ([details](/docs/compute-api/)) |
| `torchio` | printing and scanning, per user | CUPS | the CUPS command line tools and IPP ([details](/docs/os/printing/)) |
| `sinty-mediad` | cameras shared between apps | direct device access | the GStreamer API ([details](/docs/os/media/)) |
| `sinty-sh` | the `/bin/sh` that runs system scripts | a C shell | POSIX `sh` |

## Checking a service

```bash
atomctl status sinty-nm.service    # state and recent detail
atomctl logs                       # the system log
```

`atomctl` controls system services and needs administrator rights; see
[atomctl](/docs/atom-init/atomctl/) for the full command list. The desktop's own
Logs app shows the same log without a terminal.

## Why

- **Fewer moving parts.** One program per job instead of chains of daemons that
  hand work to each other. Every hand-off was a place where the boot could stall.
- **Memory-safe code** for the parts that run with the most privileges.
- **No root where it is not needed.** Printing and media run inside your session.
