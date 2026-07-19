---
title: Units and services
description: The unit-file types atom understands, the kinds of service it runs, and the directives it supports.
---

`atom` is configured with **unit files**, the same idea as systemd units. Each unit
describes one thing the system should manage, and units live in
`/usr/lib/systemd/system` (shipped by packages) and
`/etc/systemd/system` (local overrides and enablement).

## Kinds of unit

`atom` understands a practical subset of the unit types:

- **`.service`** runs and supervises a program. This is what you write most often.
- **`.target`** groups other units so they can be reached together, the way
  runlevels group services. See [Targets and the boot sequence](/docs/atom-init/targets/).
- **`.socket`** creates a listening socket and starts its service on the first
  connection (socket activation), handing the socket over through the standard
  `LISTEN_FDS` protocol.
- **`.timer`** starts a unit on a schedule rather than at boot.

## A service, top to bottom

A `.service` file has three sections. Here is a small one:

```ini
[Unit]
Description=Example background helper
After=network.target
Wants=network.target

[Service]
Type=simple
ExecStart=/usr/bin/example-helper --serve
Restart=on-failure
RestartSec=2

[Install]
WantedBy=multi-user.target
```

- **`[Unit]`** describes the unit and its relationships to others.
- **`[Service]`** says what to run and how to supervise it.
- **`[Install]`** says which target should pull it in when it is enabled.

## Service types

The `Type=` directive tells `atom` how to know the service is up:

- **`simple`** (the default): the process you start in `ExecStart` is the service.
  It is considered up as soon as it is launched.
- **`oneshot`**: a short task that runs and exits, useful for setup steps. Pair it
  with `RemainAfterExit=yes` when later units should treat the finished task as
  still "active".
- **`forking`**: the started process forks a background daemon and exits; `atom`
  follows the daemon it leaves behind.
- **`notify`**: the service tells `atom` when it is ready using the `sd_notify`
  protocol.
- **`idle`**: like `simple`, but its start is held back briefly so its output does
  not interleave with the rest of the boot.

## Directives atom supports

These are the directives `atom` reads. It is a subset of systemd, chosen for what
an appliance-style OS needs.

**`[Unit]`**

| Directive | Purpose |
| --- | --- |
| `Description` | Human-readable name shown in status and logs. |
| `Requires` | Hard dependency: pull in another unit, and fail with it. |
| `Wants` | Soft dependency: pull it in, but do not fail if it does. |
| `After` / `Before` | Ordering relative to other units. |
| `Conflicts` | Units that must not be active at the same time. |
| `DefaultDependencies` | Set to `no` to opt out of the implicit boot ordering. |

**`[Service]`**

| Directive | Purpose |
| --- | --- |
| `Type` | `simple`, `oneshot`, `forking`, `notify`, or `idle`. |
| `ExecStartPre` / `ExecStart` / `ExecStartPost` | Commands to run before, as, and after the main start. |
| `ExecStop` | Command to stop the service. |
| `Restart` / `RestartSec` | Whether and how soon to restart it if it exits. |
| `RemainAfterExit` | Keep a finished `oneshot` counted as active. |
| `WatchdogSec` | Expect a periodic `sd_notify` keepalive, restart if it stops. |
| `TimeoutStartSec` | How long to wait for the service to come up. |
| `User` / `Group` | Run the service as a specific user and group. |
| `WorkingDirectory` | The directory to start it in. |
| `Environment` | Environment variables for the service. |

**`[Install]`**

| Directive | Purpose |
| --- | --- |
| `WantedBy` | The target that should start this unit when it is enabled. |

`WantedBy` does not take effect on its own. Enabling the unit is what creates the
link that pulls it into its target; see [atomctl](/docs/atom-init/atomctl/).

:::caution[It is a subset]
If a unit uses a directive `atom` does not implement, that line is ignored rather
than honored. When you port a unit from a full systemd system, keep it to the
directives listed here, and check it with `atomctl status` after enabling it.
:::
