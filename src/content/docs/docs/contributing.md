---
title: Contributing
description: Where to start, and how the project takes contributions.
---

The project is split into focused repositories, so contributing does not mean
taking on the whole desktop at once. Pick the piece you care about.

## Where to start

- **Themes, wallpapers, plugins, and widgets** are the gentlest way in. You can
  change how the desktop looks or add a small feature without touching the
  shell. See [Theming](/docs/theming/), [Plugins](/docs/plugins/), and
  [Widgets](/docs/widgets/).
- **Apps** are the next step. Each app is its own repository, and the demo app
  is there as a template to copy. See [Build an App](/docs/build-an-app/).
- **The shell, libsingularity, and the compositor integration** are the deeper
  end, for shaping how the desktop behaves. See [Under the Hood](/docs/under-the-hood/).

## Build it first

Get the system building before you change it. The full build is one command from
the meta repo; a single component builds on its own against `libsingularity`. See
[Build from source](/docs/build-from-source/) and
[Repositories](/docs/repositories/).

## What you build against

Third-party work plugs in through the stable [contracts](/docs/contracts/): a
handful of D-Bus interfaces and extension points. Building against those keeps
your work from reaching into private internals that can change.

## Submitting

Contributions go through a CLA. Work on a focused repo, build it, and open a
pull request there.
