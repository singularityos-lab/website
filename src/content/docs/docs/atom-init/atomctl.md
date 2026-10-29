---
title: Managing services with atomctl
description: The atomctl command for inspecting and controlling atom services, viewing logs, enabling units, and powering the system down.
---

`atomctl` is how you talk to `atom`. It mirrors the verbs you already know from
`systemctl`, so most commands read the same way.

```bash
atomctl status greetd.service     # is it running, and why
atomctl logs                      # recent system log
```

## Inspecting the system

| Command | What it does |
| --- | --- |
| `atomctl status <unit>` | Show a unit's state, whether it is active, and recent detail. |
| `atomctl is-active <unit>` | Print just whether the unit is active (useful in scripts). |
| `atomctl is-enabled <unit>` | Whether the unit is enabled to start at boot. |
| `atomctl list-units` | The units `atom` currently knows about and their state. |
| `atomctl list-unit-files` | The installed unit files and whether each is enabled. |
| `atomctl logs` | The system log from `atom`'s log core. |

## Controlling services

| Command | What it does |
| --- | --- |
| `atomctl start <unit>` | Start a unit now. |
| `atomctl stop <unit>` | Stop a running unit. |
| `atomctl restart <unit>` | Stop and start it again. |
| `atomctl daemon-reload` | Re-read unit files after you change one on disk. |

After editing or adding a unit file, run `atomctl daemon-reload` so `atom` picks up
the change before you start it.

## Enabling and disabling

Enabling a unit links it into its `WantedBy` target so it starts at boot; disabling
removes that link. Masking blocks a unit from ever starting until it is unmasked.

| Command | What it does |
| --- | --- |
| `atomctl enable <unit>` | Start it at boot (creates the `.wants` link). |
| `atomctl disable <unit>` | Stop starting it at boot (removes the link). |
| `atomctl mask <unit>` | Block the unit entirely. |
| `atomctl unmask <unit>` | Undo a mask. |

Enabling does not start the unit right now; it takes effect at the next boot, or
you can `atomctl start` it as well.

## Powering the system

| Command | What it does |
| --- | --- |
| `atomctl reboot` | Restart the machine. |
| `atomctl poweroff` | Shut down and power off. |
| `atomctl halt` | Stop the system without powering off. |

:::note[Use atomctl, not systemctl]
`atom` is the init here, not systemd, so `atomctl` is the tool that actually talks
to PID 1. Reach for `atomctl` for reboots, service control, and status.
:::

## Confirming a boot

`atom` cooperates with [Atom Loops](/docs/atom-loops/) for safe updates. After an
update, the new image has to prove it can boot before it is kept, or the system
rolls back to the previous one.

```bash
atomctl boot-confirm
```

This marks the running system as good, which is the signal Atom Loops waits for
before it promotes the new image. On a healthy desktop boot this happens as part
of coming up; the command exists for when you want to confirm a boot yourself.
