---
title: Targets and the boot sequence
description: How atom groups the system into targets, the order it brings them up, and how Sinty OS boots to the desktop.
---

A **target** is a unit that groups other units, the way a runlevel groups
services. Reaching a target means everything pulled into it is up. `atom` boots by
picking one target as the goal and starting everything it depends on, in
dependency order, in parallel where it can.

## The default target

The goal of a normal boot is set by `default.target`, which on Sinty OS points at
`graphical.target`:

```
/etc/systemd/system/default.target -> /usr/lib/systemd/system/graphical.target
```

So a normal boot brings the system all the way up to the graphical login.

## The target stack

The common targets, from earliest to latest:

| Target | What it means is ready |
| --- | --- |
| `local-fs.target` | Local filesystems are mounted. |
| `sysinit.target` | Early boot setup has run (devices, low-level services). |
| `sockets.target` / `timers.target` | Socket- and timer-activated units are armed. |
| `basic.target` | The basic system is up, the point most services order after. |
| `network.target` | Networking is considered up for ordering purposes. |
| `multi-user.target` | The full non-graphical system: system services and daemons. |
| `graphical.target` | The graphical layer on top of multi-user, the greeter and session. |
| `shutdown.target` | Reached on the way down; conflicting with it stops a unit at shutdown. |

Each layer orders after the one before it, so `sysinit` runs after `local-fs`,
`multi-user` after `basic`, and `graphical` after `multi-user`. Within a layer,
independent units start together.

## Booting to the desktop

Putting it together, a boot looks like this:

1. The kernel starts `sinit` as PID 1.
2. `sinit` reads `default.target` (`graphical.target`) and works out everything it
   depends on.
3. It brings up the stack in order: filesystems, early setup, the basic system,
   then the multi-user services.
4. `graphical.target` pulls in the greeter, and you reach the login screen.
5. After you log in, your desktop session starts on top.

## How a unit joins a target

A unit is pulled into a target by being **enabled**. Enabling a unit whose
`[Install]` section says `WantedBy=multi-user.target` creates a symlink under that
target's `.wants` directory:

```
/etc/systemd/system/multi-user.target.wants/example.service
    -> /usr/lib/systemd/system/example.service
```

That symlink is what makes the target pull the unit in at boot. You normally
create it with `atomctl enable` rather than by hand; see
[atomctl](/docs/atom-init/atomctl/).
