---
title: Troubleshooting
description: Common questions and how to get unstuck.
---

This is early software. When something goes wrong, here are the first things to
check.

## The session does not start

Make sure Singularity is installed where your display manager looks for
sessions, and that you picked the Singularity session in the
[greeter](/docs/first-boot/). The greeter only lists sessions it can find in the
standard system locations, so a session installed somewhere unusual will not
appear.

## The compositor exits with "unable to create backend"

labwc fails this way when it cannot acquire a seat or open the GPU. Logging in
through a display manager (which creates a systemd-logind seat session) normally
handles this for you. If you start the session another way (from a TTY, over
SSH, or a non-logind setup), make sure:

- your user is in the `video`, `render`, and `input` groups (`sudo usermod -aG
  video,render,input "$USER"`, then log out and back in), so the compositor can
  open the DRM/render nodes and input devices;
- a seat provider is running: systemd-logind (the default) or, on systems
  without it, `seatd` (enable it and make sure your user can reach its socket,
  e.g. run it with `seatd -g <a-group-you-are-in>`);
- `polkit` is installed.

## Singularity is not listed on the login screen

Display managers (SDDM, GDM, and the rest) only show sessions whose `.desktop`
file sits in a `wayland-sessions` directory they scan, which in practice means
`/usr/share/wayland-sessions`. If you installed under a prefix like `/usr/local`
or `/opt/local`, the entry lands in that prefix's `share/wayland-sessions` and
the login screen does not list it.

On a normal system, place the session entry in the canonical location, leaving
`Exec` pointing at wherever the launcher actually lives:

```sh
sudo cp /opt/local/share/wayland-sessions/singularity.desktop \
  /usr/share/wayland-sessions/singularity.desktop
```

`make install-session` already covers GDM: it drops an `XDG_DATA_DIRS` override
into `gdm.service.d` so GDM also scans `/opt/local/share` and `/usr/local/share`.
Other display managers do not read that override, so use the copy above for them.
On immutable systems where `/usr/share` is read-only, point your display
manager's `XDG_DATA_DIRS` at the prefix you installed into instead.

## The shell, dock, and panels open as separate windows

If the desktop components appear as ordinary floating windows instead of being
anchored to the screen edges, Singularity was started outside its compositor.
The shell, dock, and panels are Wayland layer-shell surfaces that rely on labwc
to place them; launched on their own, or inside another compositor, they fall
back to regular toplevel windows. Start the desktop through the Singularity
session from the [greeter](/docs/first-boot/), or from a TTY run
`singularity-labwc-session`, which brings up labwc and the shell together.

## The desktop has no icons

Singularity currently draws its icons from the Adwaita icon theme. If buttons
and apps show up without any icons, that icon pack is missing. Install your
distribution's Adwaita icon theme (commonly packaged as `adwaita-icon-theme`)
and restart the session.

## X11 apps (Discord, Steam, ...) do not launch

X11 applications run through Xwayland. If they fail with `Missing X server or
$DISPLAY`, the compositor was built without Xwayland: when the Xwayland package
is missing at build time, wlroots and labwc quietly disable X11 support. Install
your distribution's Xwayland package (`xwayland` on Debian/Ubuntu, `xorg-xwayland`
on Arch, `xorg-x11-server-Xwayland-devel` on Fedora) and rebuild.

## Screenshots do not work

Screenshots only work inside the Singularity session. The built-in tool captures
through the `wlr-screencopy` Wayland protocol (with a `grim` fallback), and
third-party tools such as Flameshot go through `xdg-desktop-portal` and the
`xdg-desktop-portal-singularity` backend. Under GNOME, KDE or any non-wlroots
compositor none of that is available, so capture fails.

Check that you are running inside the Singularity session (log in through the
[greeter](/docs/first-boot/), or run `singularity-labwc-session` from a TTY), that
`xdg-desktop-portal` is running, and that `xdg-desktop-portal-singularity` and
`grim` are installed. `wl-clipboard` (`wl-copy`) is needed to copy the result to
the clipboard.

## The shell crashed or looks wrong

The session keeps the shell alive and restarts it if it stops, so a glitch
usually clears on its own. You can also restart the shell yourself from
[Spotlight](/docs/spotlight/): open it and run `r`.

## My accent color did not apply

The accent is applied across the desktop and the window borders together. If a
single app did not follow, it may not be reading the shared settings; the
first-party apps all do. Setting the accent again from
[Appearance](/docs/appearance/) reapplies it everywhere.

## A GTK app did not recolor when I changed the accent

First-party apps and the window decorations update instantly, and libadwaita
apps follow live through the portal. Plain GTK3 and GTK4 apps such as Firefox or
Brave only read their theme colors when they start, so a window that is already
open keeps the old accent until you close and reopen it. This is how GTK loads
its per-user style, not something specific to Singularity, so there is nothing
to fix beyond reopening the app. See
[Theming third-party apps](/docs/app-theming/) for how each toolkit is themed.

## A shortcut does not work

Some shortcuts are handled by the shell and some by the compositor. If a custom
shortcut does not fire, check it in the keyboard settings; custom shortcuts are
pushed to the compositor as well, and a conflicting binding can shadow them.

## Notifications are not showing

Check whether Do Not Disturb is on. It suppresses the popups while still keeping
everything in the [notification center](/docs/notifications/).

## Getting help

The project talks in the open. The [news](/news/) covers what is landing, and
the repositories are where to file what you find.
