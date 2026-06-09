---
title: Theming third-party apps
description: How labwc, GTK3, GTK4 and (soon) Qt apps pick up the Singularity look.
---

First-party Singularity apps read their style directly from libsingularity, so
they always match the desktop. Third-party apps are themed through a few
separate channels, one per toolkit, that together make foreign windows look at
home and follow your accent.

## labwc window decorations

Apps that use server-side decorations get their titlebar drawn by the
compositor. Singularity tints that titlebar with your accent and keeps it in
sync, so the window frame matches the rest of the desktop. This applies live:
changing the accent re-tints the decorations immediately. See
[Server-side decorations](/docs/server-side-decorations/) for how decoration
mode is chosen.

## GTK3 and GTK4 apps

Singularity ships a complete GTK theme, also called `Singularity`, for
third-party GTK apps. It is built at compile time from the same visual tokens
libsingularity uses for the shell (accent-tinted window and titlebar surfaces,
our radii, our selection colors), on top of a widget base, so a foreign GTK app
ends up resembling a first-party one rather than plain Adwaita.

Enable it from [Appearance](/docs/appearance/) with **Use Singularity Theme for
GTK Apps**. While it is on, the manual GTK theme selectors are locked and the
desktop keeps the GTK theme and the light or dark preference in sync for you.

First-party apps are unaffected: they pin an empty seam theme and keep reading
their style from libsingularity, never from this theme.

The accent reaches GTK apps in two ways:

- libadwaita apps read the accent from the XDG settings portal and follow it
  live, snapping it to their nearest named accent.
- Plain GTK3 and GTK4 apps read it from the theme. The theme references the
  named `@accent_color` that the desktop writes to your per-user GTK config, so
  it matches your accent rather than a fixed default.

## Qt apps

Qt theming is planned. The goal is the same: generate a Kvantum theme from the
Singularity tokens so Qt and KDE apps follow the accent and the surfaces like
everything else. This is not wired up yet.

## Icons

Apps resolve icons through the `Singularity` icon theme, which inherits a chain
of full icon sets (Adwaita, then GNOME, Breeze and others) so that GTK, GNOME
and KDE apps all find complete icons. If an app shows blank or symbolic-only
icons, the most likely cause is that none of those icon sets is installed; see
[Troubleshooting](/docs/troubleshooting/).

## A note on live accent changes

Changing your accent updates first-party apps and labwc decorations instantly,
and libadwaita apps follow live through the portal. Plain GTK3 and GTK4 apps
(for example Firefox or Brave) only re-read their theme colors when they start,
so an already-open window keeps its old accent until you reopen it. This is a
GTK limitation, not specific to Singularity, and is covered in
[Troubleshooting](/docs/troubleshooting/).
