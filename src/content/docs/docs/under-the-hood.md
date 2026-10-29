---
title: Under the Hood
description: Wayland, labwc, and the technical foundations of Singularity, for the curious.
---

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

The compositor is Singularity's own fork of labwc. Besides the standard
protocols, it implements a few of its own, whose XML files live in the
`protocols` directory of the labwc fork:

| Protocol | Used for |
|---|---|
| `wlr-foreign-toplevel-management`, `ext-foreign-toplevel-list` | the dock, the overview and the window switcher |
| `ext-workspace-v1` | workspaces in the panel and overview |
| `ext-image-copy-capture-v1`, `wlr-screencopy` | screenshots and screen sharing |
| `ext-session-lock-v1` | the lock screen |
| `ext-idle-notify-v1` | dimming and locking when idle |
| `wlr-output-management`, `wlr-output-power-management`, `wlr-gamma-control` | displays, display power and night light |
| `ext-data-control-v1` | clipboard history |
| `input-method-v2`, `virtual-keyboard-v1` | the on-screen keyboard and input methods |
| `ext-background-effect-v1`, `singularity-blur-v1` | blur and window materials behind surfaces |
| `singularity-preview-v1` | live window previews in the dock and overview |
| `singularity-tiling-v1`, `singularity-snap-v1` | tiling and the snap layout picker |
| `singularity-stage-v1` | window groups shown one at a time |
| `singularity-gesture-v1` | touchpad gesture progress for the shell |
| `singularity-motion-v1` | motion hints for window animations |
| `singularity-key-hold-v1` | a modifier key pressed and released alone |
| `singularity-process-v1` | the process that owns a window |

The `singularity-*` protocols are unstable and change with the desktop. Apps do
not need them: they are for the shell and system components.

## Want more?

The rest of the documentation covers [building an app](/docs/build-an-app/),
[plugins](/docs/plugins/), [widgets](/docs/widgets/), [theming](/docs/theming/),
and the [contracts](/docs/contracts/).

*Five pieces, so far. Some say there is a sixth.*
