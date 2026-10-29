---
title: Sinty OS
description: What Sinty OS is, and how this manual is organized.
---

Sinty OS is an immutable, verifiable operating system that runs the Singularity
desktop. The base system is shipped as a whole, signed image rather than a set of
packages that drift as you use it: what you boot is exactly what was built and
signed, and an update lands as a clean new state with automatic rollback if it
fails. Your files live in an encrypted space that is separate from the system, so
an update never touches them.

:::danger[Pre-release]
Sinty OS is in active development and not yet a general release. The first public
release is planned for this month, July 2026. This manual describes how the system
is designed to work and how it behaves today. Details may change before that
release, and some pieces noted below are not finished yet.
:::

## What makes it different

- **Immutable and verified.** The system root is read-only and checked by
  dm-verity; it cannot silently change underneath you.
- **Atomic updates.** Updates are one transaction with automatic rollback, powered
  by [Atom Loops](/docs/atom-loops/).
- **Encrypted by default.** Your home and data are encrypted with a single PIN,
  backed by your machine's hardware security where available.
- **Locked down.** No always-on root, no traditional login password, minimal
  surface. Privileged actions are mediated, not handed out.

## This manual

- [Requirements](/docs/os/requirements/) - what hardware you need.
- [Installing Sinty OS](/docs/os/install/) - putting it on a machine.
- [First boot and your PIN](/docs/os/first-boot/) - setup, and the recovery code
  you must save.
- [Your PIN, password, and encryption](/docs/os/pin-and-encryption/) - the
  credential model and why there is no password.
- [The recovery code](/docs/os/recovery-code/) - what it is and what it is for.
- [Recovery mode](/docs/os/recovery/) - repairing or reinstalling over wifi.
- [Updates and rollback](/docs/os/updates/) - how the system stays fresh.
- [Hardware security and the TPM](/docs/os/hardware-security/) - what the TPM does.
