---
title: atom, the init system
description: What atom is, why Sinty OS uses it instead of systemd or OpenRC, and how it fits an immutable, verifiable operating system.
---

`atom` is the init system and service manager for Sinty OS. It is the first
process the kernel starts (PID 1), and from there it brings the rest of the system
up, keeps services running, and takes the system down cleanly. It is a small,
dependency-aware init written in Go that speaks a practical subset of the systemd
unit-file format, so most of what you already know carries over.

Two names to keep straight:

- **`sinit`** is the binary that runs as PID 1.
- **`atomctl`** is the command you use to look at and control services.

Both come from the same program, so a single binary is the whole init and its
control tool.

:::note[Not the update system]
`atom` runs the system; it does not manage OS updates. Atomic updates, boot
confirmation, and rollback are handled by [Atom Loops](/docs/atom-loops/). The two
cooperate: `atom` can confirm a boot as good so Atom Loops keeps the new image.
:::

## Why atom, and not systemd

Sinty OS is immutable and verifiable: the system ships as a whole, signed image,
and the base does not change while you use it. `atom` is built for that world
rather than for a general-purpose distribution.

- **Small and auditable.** It is a focused init, not a large suite of daemons. It
  implements the parts of the unit model an appliance-style OS actually needs, and
  little else.
- **Familiar on purpose.** It parses a practical subset of ordinary unit files, so
  packages and admins do not have to learn a new configuration language. A
  `.service` file looks the way you expect.
- **Tamper-evident logging.** Its log core is append-only and tamper-evident, and
  it provides a `/dev/log` syslog replacement that also tees to the kernel log.
  That fits a system whose whole point is that you can trust what it is running.
- **Boot confirmation built in.** It integrates with Atom Loops so a boot is only
  promoted to "good" once the system actually comes up, which is what makes
  automatic rollback safe.

It is deliberately a subset. If you rely on the full breadth of systemd (its user
session manager, its large unit ecosystem, every directive), some of that is not
here. What is here is the common core: services, targets, dependencies,
supervision, socket activation.

## Why atom, and not OpenRC

OpenRC configures the system with shell init scripts and runlevels. `atom` instead
uses declarative unit files and targets, resolved into a dependency graph that it
starts in parallel.

- Instead of writing an init script, you write a small `.service` file that
  declares what to run and what it needs.
- Instead of ordering by runlevel, you declare relationships (`After`, `Wants`,
  `Requires`) and `atom` works out a correct order and starts independent services
  at the same time.
- Grouping is done with **targets** (the equivalent of runlevels), such as
  `multi-user.target` and `graphical.target`.

If you are coming from OpenRC, the mental shift is from "scripts run in an order I
choose" to "units declare their needs and the init computes the order".

## Where to go next

- [Units and services](/docs/atom-init/units/) covers the unit files themselves:
  the types, the service kinds, and the directives `atom` understands.
- [Targets and the boot sequence](/docs/atom-init/targets/) explains how the
  system is grouped into targets and how it boots to the desktop.
- [Managing services with atomctl](/docs/atom-init/atomctl/) is the command
  reference for day-to-day use.
