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

## The command line

The shell keeps a history of your commands across sessions, stored in
`~/.local/share/ush/shell_history`, and completes commands, paths and the
`pkg` and `perm` subcommands with Tab. Editing follows the usual shortcuts:

| Keys | Action |
|---|---|
| Up, Down, Ctrl+P, Ctrl+N | previous and next command |
| Ctrl+R, Ctrl+S | search the history backwards and forwards |
| Alt+< and Alt+> | first and last command in the history |
| Ctrl+A, Ctrl+E, Home, End | start and end of the line |
| Ctrl+B, Ctrl+F, Alt+B, Alt+F, Ctrl+Left, Ctrl+Right | move by character or by word |
| Ctrl+K, Ctrl+U, Ctrl+W, Alt+D, Alt+Backspace | cut to the end, to the start, or a word |
| Ctrl+Y | paste back what you cut |
| Ctrl+T | swap two characters |
| Alt+. | insert the last argument of the previous command |
| Ctrl+L | clear the screen |
| Ctrl+C, Ctrl+D | interrupt, or end the input |

## Jobs

Commands can run in the background like in any shell. End a command with `&` to
start it in the background, press Ctrl+Z to suspend the one in front, and manage
them with `jobs`, `fg` and `bg`.

## Running an app in its own sandbox

`run` starts an app in a sandbox of its own, inside the shell's sandbox. It sees
the system read-only, gets a private home and `/tmp`, and nothing else of your
files unless its profile grants it:

```bash
run myapp --some-flag
```

The profile is a JSON file in `~/.config/ush/apps/<app>.json`. It lists the
folders the app may read (`ro`) and write (`rw`), and whether it may use the
network (`net`). An app without a profile sees none of your home. Its own data
lives in `~/.ush-apps/<app>`.

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
pkg fix                     # repair an interrupted install
pkg fix --broken            # repair broken dependencies
pkg compat htop             # check whether a package works inside ush
pkg compat                  # run the whole compatibility check
pkg env list                # development environments installed on demand
```

`apt`, `apt-get`, `dpkg` and the other Debian tools are not available directly:
`pkg` takes their place, so that every install goes into a layer.

Development environments such as the Android SDK are described in
[dsh](/docs/dsh/#development-environments).

## Sharing and safety

A few builtins control what an app can reach and let you check the system's
posture:

```bash
perm trust-dir <dir>   # grant a directory read-write access ("Share with Linux")
perm untrust-dir <dir> # take that access back
perm list-dirs         # list the shared directories
perm sync-dirs         # share here the directories shared in the other shell
scan <path>            # scan a file or directory on demand
guard status           # show the Landlock and daemon security posture
quarantine list        # review and manage quarantined files
restart                # re-open the shell in place
```

Your Documents, Downloads, Music, Pictures and Videos folders are the real ones,
shared with the rest of the system. Other folders of your home are seen through
an overlay: what you change from inside the shell stays inside it.

## Asking for permissions

Apps ask the [broker](#the-permission-broker) when they need something outside
the sandbox. You can also ask ahead of time, or decide for an app as a whole:

```bash
perm network example.com "sync my notes"   # ask for a permission, with a reason
perm trust myapp       # allow everything for this app
perm untrust myapp     # go back to asking
perm lan on            # share this computer's local network (see dsh)
```

The categories are `network`, `filesystem`, `device` and `service`. App trust is
tied to the app's real executable, so another program cannot borrow it by using
the same name.

How often you are asked depends on the permission mode in the configuration:

- **simple**, the default, asks once per app and only for sensitive things such
  as the camera or the microphone. The network just works, because the host is
  protected by the sandbox itself.
- **fine** asks for every connection, device and mount, one by one. It is meant
  for auditing what an app does.

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

## Configuration

The configuration file is `~/.config/ush/config.json`. Every key is optional:

| Key | What it sets |
|---|---|
| `permission_mode` | `simple` or `fine`, see above |
| `storage_dir` | where layers and sessions are kept |
| `fallback_shell` | the shell used if ush cannot start, `/bin/bash` by default |
| `extra_bind_mounts` | extra host paths to make visible inside the shell |
| `network_backend` | how the isolated network is provided, `pasta` by default |
| `overlay_backend` | how layers are mounted, `kernel` by default |
| `enable_pid_namespace`, `enable_net_namespace` | turn the process and network separation on or off |
| `log_level` | how much ush prints about itself |

Run `restart` after changing it.

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
