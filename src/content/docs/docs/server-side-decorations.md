---
title: Server-side decorations
description: Client-side bubbles by default, server-drawn titlebars on request, and how apps react.
---

By default, Singularity apps decorate themselves. They draw their own controls as
[bubbles](/docs/bubbles/) and ask the compositor not to add a titlebar. This is
client-side decoration, or CSD, and it is what gives the desktop its clean,
titlebar-free look.

You can change that. In the desktop settings, under window management, there is
an option to disable client-side decorations. Turn it on and the compositor draws
the titlebars instead, the server-side way.

## What the compositor draws

When server-side decorations are on, labwc draws the titlebar around each window.
The shell themes those titlebars to match the rest of the desktop, tinting them
lightly with your accent color, so a server-drawn bar still looks like
Singularity rather than a generic frame.

## How apps react

Not every app responds the same way, because they ask for decorations
differently.

- **Singularity apps** drop their floating bubbles and fold the same buttons into
  an ordinary toolbar strip, letting the compositor draw the titlebar above it.
  Their rounded corners go square, since the server titlebar reaches the window
  edge.
- **GTK apps** are told not to draw their own decorations, so they request a
  server titlebar, which labwc draws and themes.
- **Qt apps** are nudged the same way through their Wayland environment, so they
  stop drawing their own mismatched titlebars and fall in line with the rest.

The aim is consistency: GTK, Qt, and Singularity apps all show titlebars that
match the rest of the desktop.

:::note
This setting is read when an app starts, so apps need to be reopened for the
change to take hold. Some third-party apps only really understand client-side
decorations, and may not look perfect with server-side titlebars.
:::
