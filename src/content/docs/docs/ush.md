---
title: ush, the application runtime
description: How Sinty OS runs Linux applications in a locked-down runtime, without sudo or a traditional privilege elevator.
---

`ush` is how Sinty OS runs Linux applications. It is a locked-down runtime that
lets you install and run desktop software without `sudo`, `pkexec`, or any other
privilege elevator. Anything an app tries to do that crosses out of its sandbox
goes through a broker that asks you first.

You can think of it as a small user-space OS layered on top of the base system:
the system itself stays read-only, your changes live in separate layers, and no
program gets extra privilege unless you grant it.

:::note[Two profiles, one tool]
`ush` ships two profiles from the same program. `ush` is the secure, sandboxed
profile described here. `dsh` is the developer profile, which trades isolation
for power. See [dsh, the developer profile](/docs/dsh/).
:::

## How it isolates an app

When you open `ush`, it builds a guest environment around the app:

- The host filesystem is mounted read-only. Writes land in an overlay layer that
  belongs to you, not to the system.
- The app runs in its own user, mount, process, network, IPC, and hostname
  namespaces, so it cannot see or touch the rest of the system.
- Your home directory is write-isolated by default. An app sees your files only
  where you have said it may.

The result is that installing or running something never modifies the base
system, and a bad install is always reversible.

## Running it

```bash
ush                  # open an interactive shell in the guest
ush -c "command"     # run a single command and return
ush -v               # verbose, with info-level logs
```

## Installing software

Packages install into layers rather than into the system, so they are easy to
remove and never drift the base:

```bash
pkg install htop            # install into your persistent layer
pkg install --one-time htop # install into a layer that lasts only this session
pkg remove htop             # remove it from the layer
pkg burn htop               # destroy the package's layer files entirely
pkg diff                    # show what your layers changed versus the base
pkg inspect htop            # files, scripts, services, and risk for a package
pkg freeze                  # promote the session layer to the persistent one
pkg list                    # what is installed
```

## Sharing and safety

A few builtins control what an app can reach and let you check the system's
posture:

```bash
perm trust-dir <dir>   # grant a directory read-write access ("Share with Linux")
scan <path>            # scan a file or directory on demand
guard status           # show the Landlock and daemon security posture
quarantine list        # review and manage quarantined files
restart                # re-open the shell in place
```

`perm trust-dir` is the same idea as the "Share with Linux" action in the
desktop: by default an app cannot write across the boundary, and you open exactly
the folders you want it to reach.

## The permission broker

Every privileged request from inside the guest is handled by a broker that runs
on the host. When an app asks to do something that crosses the boundary, the
broker asks for your explicit approval and records the decision. Nothing crosses
silently.

The broker starts automatically with your session. It also keeps an audit log of
what was requested and what you allowed.

## Where your data lives

Everything `ush` keeps is under one directory in your home:

```
~/.local/share/ush/
  layers/persistent/   your permanent layer
  layers/ephemeral/    per-session layers
  sessions/            active session metadata
  audit/               the broker's audit log
  policy.json          the permission decisions you have saved
```

## Why it is safe

`ush` uses several independent defenses, so no single failure opens the box:

- **Landlock** enforces the read-only filesystem policy in the kernel.
- **seccomp** blocks dangerous system calls outright.
- An **exec supervisor** checks what is allowed to run and mediates network,
  device, and mount requests through the broker.
- **Namespaces** keep the app separated from the rest of the system.
- The **broker** requires your explicit approval for anything privileged.
