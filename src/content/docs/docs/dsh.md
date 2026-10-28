---
title: dsh, the developer profile
description: The developer profile of ush, which trades sandbox isolation for the power to run nested containers and developer tooling.
---

`dsh` is the developer profile of [ush](/docs/ush/). It is the same shell and the
same layer-based package system, but on a profile that trades isolation for
power, so the tools developers need actually work inside it.

Where `ush` locks an app down, `dsh` opens things up: nested rootless `podman`
and `distrobox`, `/dev/fuse`, and a subordinate id range are all available. That
is what lets you build and test container-based software from inside the runtime.

:::caution[Not a security boundary]
`dsh` is a convenience for development, not a sandbox. It deliberately relaxes the
isolation that makes `ush` safe, so do not use it to run software you do not
trust. When you want the locked-down behavior, use [ush](/docs/ush/).
:::

## Running it

```bash
dsh                  # open a developer shell
```

You get the same interactive shell, job control, and `pkg` commands as `ush`, so
everything you install into a layer is available here too.

## What it enables

- **Nested containers.** Rootless `podman` and `distrobox` run inside the shell,
  so you can pull, build, and run container images without touching the host.
- **FUSE.** `/dev/fuse` is available, which many build and container tools expect.
- **A subordinate id range.** The id mapping needed for rootless container
  engines is set up for you.

## Your files

Your personal folders, **Documents**, **Downloads**, **Music**, **Pictures** and
**Videos**, are the real folders of your home, not copies. A file that a tool or
an agent saves there from `dsh` shows up straight away in Files and in every other
app. Files saved there lose their executable bit, so a downloaded script cannot be
run from Files by accident.

Your other home folders stay isolated: changes made from `dsh` stay inside the
developer shell.

## Working on a project folder

A project you build and run from `dsh` usually needs full access to its own
folder, for example to run `git` or a build system that writes there. Mark it as a
trusted development folder:

```bash
perm trust-dir ~/Projects/my-app     # full access to this folder
perm untrust-dir ~/Projects/my-app   # back to the isolated view
```

The change applies to the running shell. If it does not, run `restart`.

## Reaching your local network

By default the shell has its own isolated network: it reaches the internet, but
not the devices on your local network. To work with a local server, a printer or
another machine, share this computer's network with it:

```bash
perm lan on       # share the local network
perm lan off      # back to the isolated network
perm lan status
```

Run `restart` to apply the change to the shell you are in.

## Development environments

Some toolchains are large and only needed now and then. `pkg env` installs them
on demand, into your persistent layer, and sets their variables for every later
shell:

```bash
pkg env list              # what is available and what is installed
pkg env add android       # Android SDK tools and JDK 17
pkg env add ios           # tools to pair with an iPhone or iPad over USB
pkg env remove android
```

- **android** installs the Android command line tools, platform tools, build
  tools and a platform, verified against Google's own index, and sets
  `ANDROID_HOME` and `JAVA_HOME`. You are asked to review and accept the SDK
  licenses. More parts install with `sdkmanager`.
- **ios** installs the tools that talk to an iPhone or iPad: pairing, installing
  apps, file access and logs. Building iOS apps needs Apple's SDK from Xcode,
  which only Apple distributes.

Open a new shell, or run `restart`, to load the variables of an environment you
just added.

## A shell on the host

Some tasks need the real system instead of the developer shell. Hold **Shift**
and right click Leafs in the dock to open a **Host Shell**, a terminal running
directly on the computer, outside `dsh`.

## When to use which

- Reach for **`ush`** for everyday use: running applications with the sandbox and
  the broker in place.
- Reach for **`dsh`** when you are building or testing software that needs
  container tooling or FUSE, and you accept that the isolation is relaxed.

Both profiles share the same package layers and the same storage under
`~/.local/share/ush/`, so moving between them does not mean setting things up
twice.
