---
title: The compositor
description: How Singularity drives labwc, and the protocols it speaks.
---

Singularity does not ship its own compositor. It builds on **labwc**, a
lightweight, stacking Wayland compositor based on wlroots, and drives it from the
shell. labwc is tracked on a `singularity` branch with a small set of patches on
top of upstream.

## Built for labwc today, not married to it

Right now the shell targets labwc, because it is small and capable and let the
desktop come together quickly. That is a convenience, not a commitment. The stated
goal, and a promise the project has made in the open, is for the shell to be
compositor-agnostic: able to run on top of whichever Wayland compositor you bring.
Work toward that is already underway, separating the labwc-specific pieces, the
config files and the protocols below, behind a clean boundary so the shell does
not assume any one compositor. So treat what follows as how it works on labwc
today, not as a permanent dependency.

## Configuration

The shell writes labwc's configuration rather than asking you to edit it by
hand. The files live under `~/.config/labwc`:

- `rc.xml` holds keybindings, workspaces, and window rules. Keyboard shortcuts
  set in the desktop are translated into labwc's key syntax and written here.
- `themerc` holds the window decoration colors. The shell tints these with your
  accent so the borders match the rest of the desktop.
- `environment.xml` holds the keyboard layout.

After writing a change, the shell tells labwc to reload with a reconfigure, so
updates take effect without restarting your session.

## Talking to the compositor

The shell talks to labwc over Wayland protocols: foreign-toplevel management for
the window list and activation, output management for displays, workspaces,
gamma control for night light, screencopy for screenshots, and session lock for
the lock screen.

A few protocols are specific to Singularity, carried by the branch patches:
previews for the app switcher, tiling hints, and the blur used for frosted
surfaces.

## Shortcuts across the boundary

Because some bindings are handled by the shell and some by labwc, custom
[keyboard shortcuts](/docs/keyboard-shortcuts/) are pushed into `rc.xml` as well.
A binding you set behaves the same regardless of which side acts on it.
