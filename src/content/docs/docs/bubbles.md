---
title: Bubble navigation
description: Why Singularity apps wear floating bubbles instead of a titlebar, and how it works.
---

Singularity apps do not wear a traditional titlebar. Instead, their controls are
bubbles: small translucent pills that sit at the top of the window, with a drag
grip and a close bubble at the ends and the app's buttons between them. This is
the bubble bar, and every first-party app is built on it.

## Why bubbles

The chrome around an app should not compete with the thing you opened the app
for. A full titlebar takes a strip of the window and a slice of your attention,
every window, all the time. Bubbles give that space back. The content is the
point; the controls float at its edge, small and quiet, and stay out of the way
until you reach for them. Those few pixels at the top of the window add up, and
the bubble bar spends them on your content instead of on a bar. This is grounded
in a small [attention study](/docs/ux-research/) we ran while designing the
desktop.

## Over the content, or its own space

Bubbles work in one of two ways, and each app picks the one that fits what it
shows.

- **Over the content.** For scenic, full-bleed content like a video or a photo,
  the content fills the entire window and the bubbles float on top of it. They
  fade out while you watch or look, and fade back in the moment you move the
  pointer toward them. Nothing is cropped to make room for a bar.
- **Its own space.** For dense content like a file list, a process table, or a
  log, the bubbles reserve a thin strip at the top and the content begins just
  below. Here the bubbles stay visible, because in a list of data you should
  never have something hidden under a pill.

So a photo viewer lets the bubbles float over your cat, while a file manager
gives them a strip of their own above the list. Same bubbles, different posture.

## Dragging and closing

Because there is no titlebar, the drag grip is how you move the window, and the
close bubble is how you close it. They sit at the ends of the bar so they are
always in the same place.

## For app authors

An app does not build this by hand. It builds on libsingularity's window, which
owns the bubble bar, and adds its controls through a small set of calls for icon
buttons, text and accent pills, labels, menus, and a search field. The app
chooses whether the bar floats over the content or reserves its space. See
[libsingularity primitives](/docs/libsingularity/).

## When decorations are server-side

Bubbles are a client-side idea: the app draws its own controls and asks the
compositor not to add a titlebar. If you turn on server-side decorations, that
changes: the bubbles fold back into an ordinary toolbar and the compositor draws
the titlebar around the window instead. See
[Server-side decorations](/docs/server-side-decorations/) for how that mode works
and how different apps react to it.

The app that leans on the bubble bar most is [Edit](/docs/apps/edit/), where it
hands the whole height of the window to your code.
