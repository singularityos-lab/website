---
title: Developing in Sinty OS
description: How to set up a development environment on an immutable OS, using Flatpak apps, Flatpak runtimes, and the dsh developer profile with podman and distrobox.
---

Sinty OS keeps its base system read-only, so you do not install compilers,
language runtimes, or editors into the system the way you would on a traditional
distribution. Instead you develop in two places that sit on top of the immutable
base: **Flatpak apps** for editors and graphical tools, and the **dsh developer
profile** for shells, containers, and toolchains. Both leave the base untouched,
so nothing you install can break the system.

## Editors and tools as Flatpaks

Graphical developer tools install as Flatpaks, the same packaging the rest of your
apps use. The easiest way is the [Store](/docs/apps/store/), which browses Flathub;
you can also use the command line:

```bash
flatpak install flathub com.visualstudio.code   # VS Code
flatpak run com.visualstudio.code               # run it
```

Flathub carries most editors and IDEs this way, so your graphical tooling lives in
its own sandbox and updates independently of the system.

## What to keep in mind with a Flatpak editor

A Flatpak editor such as VS Code runs **sandboxed**. That is good for isolation,
but it means the editor does not automatically see the compilers and tools you
would expect on a normal machine. A few things to keep in mind:

- The editor's built-in terminal runs *inside* the Flatpak sandbox, not on the
  host. To run a command on the host from inside, use `flatpak-spawn --host`.
- Filesystem access follows the Flatpak permission model. Grant the editor the
  folders it needs (through the app's permissions, or with an override) rather
  than expecting full access.
- For real language toolchains, do not try to cram them into the editor's sandbox.
  Point the editor at a container instead, which is where `dsh` comes in.

## Real toolchains with dsh

When you need compilers, package managers, `podman`, or `distrobox`, use the
[dsh developer profile](/docs/dsh/). It is the same shell as [ush](/docs/ush/) on
a profile that allows nested rootless containers and FUSE, so a full development
environment works inside it without touching the host:

```bash
dsh                                   # open the developer shell

# a throwaway or persistent dev box with distrobox
distrobox create --name dev --image fedora:latest
distrobox enter dev

# or containers directly with rootless podman
podman run --rm -it debian:stable bash
```

A common workflow is to keep your toolchain in a `distrobox` or a `podman`
container and edit the code from a Flatpak editor, connecting the editor to the
container (for example with a dev-containers workflow). The code stays in your
home directory; the toolchain stays in the container.

:::caution[dsh is not a security boundary]
`dsh` deliberately relaxes the isolation that makes `ush` safe, so treat it as a
developer convenience, not a sandbox. Do not run code you do not trust in it, and
keep anything security-sensitive in [ush](/docs/ush/) instead.
:::

## Flatpak runtimes and SDKs

Flatpak apps run against shared **runtimes** (the base libraries an app needs) and
build against matching **SDKs** (the same base plus a toolchain). When you install
an app, its runtime is pulled in automatically; you rarely manage these by hand.

If you are packaging your own app as a Flatpak, you build against an SDK such as
`org.freedesktop.Sdk` with `flatpak-builder`. Building and shipping a Singularity
app is covered in [Build an App](/docs/build-an-app/).

## Choosing where to work

- **Flatpak app** for a graphical editor or tool, sandboxed and self-updating.
- **dsh** for shells, compilers, and containers, when you need real toolchains.
- **ush** when you want the locked-down runtime with the broker in place.

Between them you get a full development setup without ever writing into the
system, so the base stays exactly as it shipped and every change is reversible.
