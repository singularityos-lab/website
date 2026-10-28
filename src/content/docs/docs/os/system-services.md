---
title: System services
description: The programs that run Sinty OS underneath the desktop, and what each one replaces.
---

Sinty OS does not use systemd. The first process is `sinit`, services are started
by [atom](/docs/atom-init/about/), and a set of system programs written for Sinty
OS do the jobs that a typical distribution spreads across many daemons.

| Service | What it does | In place of |
|---|---|---|
| `sinit` and `atomctl` | start the system and its services | systemd |
| `sinty-devd` | handles devices as they appear, applies the udev rules, creates `/dev` entries | udevd |
| `sinty-logind` | login screen, sessions, seat, power buttons | greetd, seatd, systemd-logind, accounts-daemon |
| `sinty-nm` | Wi-Fi, wired networks and WireGuard VPN | NetworkManager |
| `torchio` | printing and scanning, per user | CUPS |
| `sinty-mediad` | cameras shared between apps | direct device access |
| `sinty-sh` | the `/bin/sh` that runs system scripts | a C shell |

Each one speaks the interface of the program it replaces, so the apps and tools
built for them keep working: libudev clients, greetd greeters, `nmcli`, the
CUPS command line tools and GStreamer apps all run unchanged.

## Why

- **Fewer moving parts.** One program per job instead of chains of daemons that
  hand work to each other. Every hand-off was a place where the boot could stall.
- **Memory-safe code** for the parts that run with the most privileges.
- **No root where it is not needed.** Printing and media run inside your session.
