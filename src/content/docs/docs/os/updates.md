---
title: Updates and rollback
description: How Sinty OS updates itself, and what happens if an update goes wrong.
---

Sinty OS updates itself as one safe transaction, not as a pile of package changes.
You should never have to babysit an update, and you should never be left with a
half-working system. This is handled by [Atom Loops](/docs/atom-loops/), the
deployment engine underneath.

## What an update does

- **It downloads a whole, signed image** of the new version, only fetching the
  parts that changed.
- **It verifies the image end to end** before trusting it. What you run is exactly
  what was built and published; a tampered image is rejected whatever server
  delivered it.
- **It switches all at once**, either at the next boot or, when the update allows
  it, while you keep working (see below). Until then, the running system is
  untouched, so a download interrupted by a lost connection or a power cut is a
  non-event.

![An update is three images: the kernel cache, the root, and the firmware for NVIDIA or AMD graphics](/firmware-is-an-image-too.png)

## Updates without a restart

Many updates do not need a restart at all. Every release says how far it reaches
into the system, and Sinty OS applies it in the gentlest way that is still safe:

- **On its own.** Updates to background services and built-in data apply
  silently. You do not see anything happen.
- **Apply Now.** Updates to the desktop itself, such as the dock, Settings, or
  the shared desktop library, ask first. Choose **Apply Now** from the update
  icon in the dock or from Settings, under **Updates**. Parts of the desktop
  restart for a moment; your open apps and your work stay where they are. If
  you would rather not, the update simply waits for the next restart.
- **Log out and back in.** Updates to the compositor, sound, screen sharing, or
  the toolkit apps are drawn with are downloaded and checked, but applied only
  when you log out. The login screen shows the loading screen while it happens,
  then lets you sign back in on the new version. Nothing is ever forced: the
  update can also wait for the next restart.
- **Restart.** Updates to the kernel, the startup loader, firmware, encryption,
  or the core of the system always wait for a restart.

Your session never restarts by itself. Switching to the new version is the same
verified, all-at-once step as at boot: if any service fails to come back after
the switch, Sinty OS returns to the version you were running and the update
waits for the next restart instead.

## Rollback: a bad update undoes itself

If a new version fails to boot, Sinty OS returns to the last version that worked on
its own. You do not have to recover anything or know that it happened. Only after
the new version has booted cleanly enough times is it kept as the confirmed
system, and the previous one held as the fallback.

If there is no good version left to fall back to, the machine drops into
[recovery](/docs/os/recovery/) rather than leaving you at a dead screen.

## The startup loader is updated too

The loader that starts Sinty OS before the system itself is updated the same way.
A new loader is first started on trial. If it does not get the system up, the
computer goes back to the previous loader on its own at the next start, so a bad
loader update cannot leave the machine unable to boot. Settings shows the loader
version in use.

## Your files are never touched

Updates replace the system, not your data. Your encrypted home lives separately
from the system image (see
[Your PIN, password, and encryption](/docs/os/pin-and-encryption/)), so an update
never merges into your files or risks them.

## Update history

Settings, under **Updates**, lists every update installed on this
computer under **Update History**: the version, the build, when it was installed,
and whether it succeeded. Firmware updates are listed in a group of their own.

## Under the hood

The transactional model, the signing chain, and the automatic rollback are
described from the engineering side in the [Atom Loops](/docs/atom-loops/)
documentation, and in full technical depth in the Atom Loops project docs.
