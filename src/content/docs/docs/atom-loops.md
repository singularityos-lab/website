---
title: Atom Loops
description: The atomic, reproducible update model behind Singularity OS.
---

Atom Loops is the update model planned for [Singularity OS](/docs/singularity-os/),
and a project in its own right: an open-source system for atomic and reproducible
deployment of the operating system on Linux devices, from small boards to desktops
and servers.

## The idea

An update should be one simple, logical transaction: download, verify, switch.
Atom Loops ships the system as whole, bootable images rather than as sets of
packages applied on top of each other. What you run is exactly what was built and
signed, not the end result of changes layered onto whatever was there before. The
system is immutable by design: the root carries no editable state and is replaced
whole on each update, while your data and local state live separately, so an
update never has to merge system files.

## The principles

Atom Loops is built on a few rules it will not bend:

- **Atomic.** An update is either fully applied or not at all. There are no
  half-updated, in-between states.
- **Verifiable.** Every image is signed and checked end to end before it is
  trusted.
- **Reversible.** If a new image fails to boot, the system rolls back to the last
  good one on its own.
- **Portable.** The same model runs from a Raspberry Pi to x86_64 machines and on
  to RISC-V, degrading gracefully where hardware is limited.

## How it compares

Atom Loops is deliberately narrow: it does atomic deployment of the OS, and not
much else. That sets it apart from the common approaches.

- It is not a package manager. It does not install or customize packages on the
  device; it ships the image as built, unlike systems where you layer packages on
  top of a base.
- It is not tied to a content-addressed store. Object-store systems like OSTree
  add a checkout step and a tight link to their distribution tooling; Atom Loops
  works on plain images instead.
- It does not depend on container images. It consumes a finished update image, not
  OCI layers, so it needs no Docker-style machinery.
- It barely touches your partitions. Where A/B schemes keep two full copies of the
  OS in fixed partitions, Atom Loops asks for very little beyond a small boot
  partition.

It is also indifferent to how the image was built: whoever produces the update can
use whatever tools they like, and Atom Loops only consumes the final, signed
artifact.

## Status

This describes where the [OS](/docs/singularity-os/) is going, not shipping
software you can run today. The OS is coming soon; Atom Loops is the foundation it
is being built on. Follow the [news](/news/) for what lands as it lands.
