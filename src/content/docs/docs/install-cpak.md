---
title: Install with cpak
description: Install the Singularity package and add it to the login screen.
---

cpak provides an official experimental package for running Singularity as a
complete Wayland session on another Linux distribution. The package contains the
project build and a focused runtime, while the host continues to provide its
kernel, graphics drivers and display manager.

:::caution[Public alpha]
Both Singularity and cpak session support are still under active testing. Start
on a spare machine or virtual machine and keep another working login session
available.
:::

## Install cpak

Follow the official [cpak installation guide](https://cpak.it/docs/install),
then check whether the host provides the kernel and session features required by
the runtime:

```sh
cpak doctor
```

Resolve any failed checks before continuing. Optional hardening warnings do not
prevent the package from starting, while a failed required capability does.

## Install Singularity

Install the package from its GitHub origin:

```sh
cpak install github.com/singularityos-lab/singularity-desktop
```

The installation pulls the Singularity Runtime dependency and the current
desktop image, then prepares their shared OCI layers in the local cpak store.
Personal state remains in a separate writable profile and is not replaced by an
image update.

Check the session exported by the installed package:

```sh
cpak session list github.com/singularityos-lab/singularity-desktop
```

## Add the login session

Install the cpak system authority once, then register Singularity:

```sh
cpak system setup
cpak system status
cpak session enable github.com/singularityos-lab/singularity-desktop dev.sinty.singularity
```

cpak shows the session permissions before asking Polkit to authorize the
root-owned login entry. Log out when registration finishes, choose Singularity
from the session menu in the display manager and log back in.

GDM reads the local session directory directly. The system setup configures SDDM
and LightDM when required, while greetd depends on the selected greeter. The
[cpak session documentation](https://cpak.it/docs/desktop-sessions) covers each
display manager and the shared kiosk-session mechanism.

## Update

Update the package and its runtime dependency with:

```sh
cpak update github.com/singularityos-lab/singularity-desktop
```

The new image becomes active only after its manifest, layers and permissions
have been prepared. The writable profile remains in place. Log out of the active
Singularity session before applying an update that changes the compositor or
shell.

## Disable or remove

Remove the login entry without uninstalling the package:

```sh
cpak session disable dev.sinty.singularity
```

Remove the package and its registered session with:

```sh
cpak remove github.com/singularityos-lab/singularity-desktop
```

Run `cpak gc` to preview unreferenced data and `cpak gc --apply` when you also
want to reclaim the unused layers.
