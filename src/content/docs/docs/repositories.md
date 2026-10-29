---
title: Repositories
description: How the project is split across repos, wired together by a meta repo.
---

Singularity is not one repository. It is split into focused repos, each with its
own history and issues, orchestrated by a lean meta repo.

## The meta repo

`singularity-desktop` is the meta repository. It does not hold much code of its
own; it holds build orchestration, system data, and submodule pointers to every
other piece. Cloning it with submodules gives you the whole system in one place,
buildable with a single command. See [Build from source](/docs/build-from-source/).

## The components

- **singularity-shell** is the desktop shell: panel, dock, overview, sidebar,
  notifications, lock screen, and the compositor integration.
- **libsingularity** is the shared application framework: the UI primitives, the
  style system, and the public [contracts](/docs/contracts/).
- **singularity-session** holds the session launchers and the `labwc`
  configuration.
- **singularity-greeter** is the login greeter.
- **labwc** is the Wayland compositor, on a `singularity` branch with a small set
  of patches.
- **singularity-themes**, **singularity-wallpapers**, **singularity-plugins**,
  and **singularity-widgets** ship the look, the backgrounds, and the
  extensions.
- The first-party [apps](/docs/apps/) each live in their own repository.
- **xdg-desktop-portal-singularity** and **singularity-polkit-agent** provide the
  portal backend and the authentication agent.

## Why split it

Each piece has its own history, issues, and release cadence. If you only care
about one part, you clone that repo and are productive in minutes, without
pulling the entire desktop. The meta repo keeps everything wired together so the
full system is still one build away.
