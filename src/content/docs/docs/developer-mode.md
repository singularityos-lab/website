---
title: Developer mode
description: The developer page and preview features, and what they expose.
---

Singularity keeps its developer and experimental tools out of the way by default.
Two switches in the system settings turn them on.

## Turning it on

In the system settings, under an Experimental section, there are two toggles:

- **Preview features** makes experimental, still-in-progress features visible.
- **Developer mode** adds a Developer page to the settings.

:::caution[In development]
These are development and diagnostic tools. The features they expose are works in
progress, and the live numbers they show may not be accurate yet.
:::

## The Developer page

With developer mode on, a Developer page appears, gathering a set of tools:

- **Debug.** Verbose logging, a floating HUD overlay of live stats, and switches
  to keep the sidebar, the overview, or the workspaces open, handy for taking
  screenshots.
- **GTK rendering.** Open the GTK inspector, toggle animations, and overlay
  accent-colored borders on every widget.
- **App system.** The current focused app, open windows, and running apps, with a
  button to force a refresh.
- **Wallpaper.** The current wallpaper path and a reload button.
- **Tiling.** Turn on auto-tiling and apply the layout now.
- **Hot corners.** Trigger any of the four corners by hand.
- **Desktop resources.** Live CPU and memory for the shell's own processes: the
  shell, the compositor, and the polkit agent.
- **Notifications.** Send a test notification that bypasses Do Not Disturb.
- **XDG portal.** Check the portal backend and trigger a screenshot or app-chooser
  request.
- **Window preview.** Capture a preview of the first window.
- **Diagnostics.** A live tail of the shell log, with clear, restart, and a
  restart-shell button.

## Experimental features and tiling

Tiling is one of the experimental features. You can turn it on from the window
management settings, or as auto-tiling from the Developer page, and re-tile with
Super and R, but it is still in development and may not behave consistently yet.
Other features behind the preview-features switch are at a similar stage: useful
to try, not yet finished.
