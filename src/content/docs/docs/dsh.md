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

## When to use which

- Reach for **`ush`** for everyday use: running applications with the sandbox and
  the broker in place.
- Reach for **`dsh`** when you are building or testing software that needs
  container tooling or FUSE, and you accept that the isolation is relaxed.

Both profiles share the same package layers and the same storage under
`~/.local/share/ush/`, so moving between them does not mean setting things up
twice.
