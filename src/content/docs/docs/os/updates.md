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
- **It switches at the next boot**, all at once. Until then, the running system is
  untouched, so a download interrupted by a lost connection or a power cut is a
  non-event.

## Rollback: a bad update undoes itself

If a new version fails to boot, Sinty OS returns to the last version that worked on
its own. You do not have to recover anything or know that it happened. Only after
the new version has booted cleanly enough times is it kept as the confirmed
system, and the previous one held as the fallback.

If there is no good version left to fall back to, the machine drops into
[recovery](/docs/os/recovery/) rather than leaving you at a dead screen.

## Your files are never touched

Updates replace the system, not your data. Your encrypted home lives separately
from the system image (see
[Your PIN, password, and encryption](/docs/os/pin-and-encryption/)), so an update
never merges into your files or risks them.

## Under the hood

The transactional model, the signing chain, and the automatic rollback are
described from the engineering side in the [Atom Loops](/docs/atom-loops/)
documentation, and in full technical depth in the Atom Loops project docs.
