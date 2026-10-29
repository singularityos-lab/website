---
title: App settings and permissions
description: Configure each app's settings and its Flatpak permissions in one place.
---

Singularity gathers the configuration for your apps in one place: the Apps page in
settings. It lists the apps on your machine, and opening one shows what it is, what
it is allowed to do, and its own settings, all on a single page.

## Permissions

For apps installed as Flatpaks, this is where you see and change what an app can
reach, without touching the command line. The page reads the app's current
permissions and lets you toggle them:

- **Network** access.
- **The display and input stack**: Wayland, X11, audio, and similar sockets.
- **Devices** like the GPU and input devices.
- **Folders**: access to your home, Documents, Downloads, and the other standard
  places, each shown as read-only or read-write.

Changes are applied as your own user-level overrides, so you are tuning what the
app may do without modifying the app itself. It is a single place to manage
permissions across all your Flatpak apps.

## Settings

Apps can also surface their own settings here. When an app exposes its settings to
Singularity, the same toggles, dropdowns, and fields you would find inside the app
appear on this page, so you can configure it without opening it. The file manager's
view mode or the terminal's font, for example, can be set right from the Apps page.

The permissions section shows for Flatpak apps, and the settings section shows for
apps that ship the description Singularity needs. Developers can add that to their
own app: see [Exposing app settings](/docs/exposing-settings/).
