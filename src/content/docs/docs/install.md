---
title: Install
description: The ways to run Singularity today.
---

There are three ways to get Singularity. The cpak package and source build are
available today, while the complete OS image is still being built.

:::danger[Pre-release: install at your own risk]
Singularity is in public alpha. Expect unfinished behavior and regressions, use
a spare machine or virtual machine for the first test, and back up anything you
care about before adding a login session.
:::

## The OS image

Singularity OS, the full operating system, is still being built. When it is
ready, an installable image will be the simplest way to run the whole thing.
For now, see [Singularity OS](/docs/singularity-os/) for what it is and where it
is going.

## Install with cpak

cpak installs the published Singularity image, keeps its writable profile
separate and registers it with the display manager after showing the requested
permissions. This is the shortest way to try the same build maintained by the
project on another Linux distribution.

Start with [Install with cpak](/docs/install-cpak/) for the host check, package
installation, login registration, updates and removal.

## Build from source

For a native installation, the meta repository wires every component together
as submodules and builds them with a single command:

```sh
git clone --recurse-submodules https://github.com/singularityos-lab/singularity-desktop.git singularity-desktop
cd singularity-desktop
make compile
make install
```

The source installation has been tested on Vanilla OS 2 Orchid, Vanilla OS 3
Reunion, Debian Sid, and Ubuntu 26.04 (Resolute Raccoon). Other systems may need
dependency or display-manager adjustments. On immutable systems, do not install
into the system prefix: `make install` deploys to `/opt/local`, the persistent
writable prefix.

`make install` does the full install to `/opt/local` (binaries, bundled
libraries, portal and systemd wiring, icon theme, and session entry), and
self-elevates when needed. `make deploy-host` is a deprecated alias kept for
compatibility; it now just runs `make install`.

Once installed, the session shows up in your display manager. Log in through the
[greeter](/docs/first-boot/) and pick the Singularity session.

The full build options, dependencies, and single-component builds are covered in
[Build from source](/docs/build-from-source/).
