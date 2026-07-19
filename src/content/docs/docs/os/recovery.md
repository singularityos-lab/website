---
title: Recovery mode
description: Repairing or reinstalling Sinty OS, over wifi, when the main system will not boot.
---

Recovery mode is a small, always-present, signed environment that survives a dead
main system, a broken boot, a bad update, or on-disk corruption. If the machine
ends up unable to start normally, recovery can **repair** it or **reinstall** a
fresh Sinty OS, and it can do so **over wifi**, with no second computer and no
network cable.

:::note[Status]
The recovery agent and its interface exist and are developed in the open. A fully
independent, always-bootable recovery image is still being proven for the first
release. Treat this page as how recovery is designed to work.
:::

## When it starts

- **On demand.** You can choose recovery from the boot menu (for example by holding
  a key as the machine starts).
- **Automatically.** If a new system fails to boot enough times, the machine falls
  back on its own rather than leaving you stuck. See
  [Updates and rollback](/docs/os/updates/).

## What it can do

- **Repair.** Roll the system back to the last version that worked, without needing
  the network.
- **Reinstall over wifi.** Connect to a wireless network from a small built-in
  screen, download a fresh, signed Sinty OS image, verify it end to end, and write
  it back. Because trust is in the signature and not the network, the image is
  authenticated no matter which server or link delivered it.

## Your data and the recovery code

Recovery is careful with your data:

- A destructive action (a wipe, or a reinstall that replaces the system) asks you
  to confirm you are the owner, using your [PIN](/docs/os/pin-and-encryption/) or
  your [recovery code](/docs/os/recovery-code/). A stolen machine cannot simply be
  wiped and reused, and a stray choice cannot erase you.
- Reinstalling the system does not, by itself, target your encrypted data area. But
  recovery is also where a deliberate wipe lives, so read the confirmation before
  you accept it.

## No desktop, no ethernet needed

Recovery is intentionally minimal: it brings up wifi on its own, without the full
desktop and without requiring a wired connection, so it works on a laptop with no
network port. It is the Sinty OS equivalent of a phone or Mac recovery screen.
