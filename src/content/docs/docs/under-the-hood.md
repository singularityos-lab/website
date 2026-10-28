---
title: Under the Hood
description: Wayland, labwc, and the technical foundations of Singularity, for the curious.
---

This page is for the curious. The rest of the site sells the experience; here we
talk about what runs underneath.

## Wayland and labwc

Singularity is a Wayland desktop. Rather than writing a compositor from scratch,
it builds on **labwc**, a lightweight, stacking Wayland compositor based on
wlroots. Singularity drives labwc through a small set of protocols and a
generated session launcher, and tints its window decorations to follow your
accent.

Why Wayland: a modern input and output stack, per-surface scaling, smooth
compositing, and a cleaner security model than X11.

## The shell

The shell is the part you see and touch: the panel, dock, overview, sidebar,
notifications, lock screen, and the global menu. It talks to the system over
D-Bus and to the compositor over Wayland protocols, and it keeps the desktop
alive across restarts.

## libsingularity

Every first-party app, and the shell itself, builds on **libsingularity**: a
shared GTK4 framework with the UI primitives, the accent-aware style system, and
the public [contracts](/docs/contracts/) that third parties extend.

## Vetro

UI is authored in concise `.vetro` files, transpiled to GTK `.ui` at build time.
It keeps interface code short and readable without giving up native widgets.

## Wayland protocols in use

Singularity uses a focused set of protocols: foreign-toplevel management,
output management, workspaces, screencopy, gamma control, session lock, and a
couple of Singularity-specific ones for previews, tiling, and blur.

## Want more?

The rest of the documentation covers [building an app](/docs/build-an-app/),
[plugins](/docs/plugins/), [widgets](/docs/widgets/), [theming](/docs/theming/),
and the [contracts](/docs/contracts/).

*Five pieces, so far. Some say there is a sixth.*
