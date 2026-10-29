---
title: The global menu
description: Why app menus live in the panel, and how the desktop fills it for almost any app.
---

In Singularity, an app's menus do not sit on top of the window. They live in the
center of the panel. This is the global menu.

## How it behaves

When you focus an app, its menus appear in the panel. Switch to another app and
the menus follow your focus. When the focused app has no menus, the area stays
empty rather than carrying clutter. The result is that every window stays clean:
the menu chrome lives in one predictable place instead of being repeated on each
window.

## It works for more than native apps

Singularity's own apps put their full menus in the panel because they are built
for it. But the desktop also works hard to show menus for apps that were not: it
understands the menus modern GTK apps export, the app menus older apps register,
and as a last resort it can even read an app's menu through the accessibility
layer. So most apps you run will have a menu in the panel, whether or not they
were made with Singularity in mind. The exact mechanisms are covered in
[How the global menu works](/docs/global-menu-internals/).

## When there is no menu

If an app exposes nothing at all, the panel still gives you something useful: the
app's own launcher actions and basic window controls. And when you are on the
desktop itself, with no app focused, the menu becomes a small system menu, with
about, settings, lock, log out, and shut down.
