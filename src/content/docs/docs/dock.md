---
title: The dock
description: What the dock holds, the live information it can show, and every way to shape it.
---

The dock sits along the bottom edge. It is where your apps live, and it takes the
most shaping of any part of the desktop, so it can sit exactly where and how you
want.

## What the dock holds

The dock carries a few kinds of things, side by side.

### Pinned and running apps

Apps you pin stay in the dock so they are always one click away. Running apps
show up too, with an indicator, and the dock highlights the one you are using.
Drag the items to reorder them.

### Files, folders, and links

The dock is not only for apps. Drop a file, a folder, or a web link onto it and
it stays there as its own item, the way a dock should let you keep a few things
close.

## Live information on your apps

Some dock items show more than an icon. A handful of plugins ship enabled by
default and add a strip of live detail next to the relevant app, or a small badge
on its icon:

- **Music and media.** Any player that speaks MPRIS, the standard media
  interface, has its dock icon replaced by the album art, with previous,
  play, pause, and next right beside it.
- **Messaging.** Messaging apps such as Telegram, Signal, Element, and Slack show
  their unread chats as round avatar bubbles next to the app's icon, with a
  count. This is driven by desktop notifications, so it needs no separate login.
- **Downloads.** Active browser downloads appear as bubbles next to the browser's
  icon, with the file size and progress.
- **Progress and counts.** Apps that use the standard launcher-entry interface,
  like file managers, mail clients, and Steam, get a progress ring and a count
  badge on their dock icon.

:::caution[In development]
This is an area we are actively expanding to more apps. Today it leans on common
signals: MPRIS, desktop notifications, and the launcher-entry interface. Apps can
also integrate directly through the dock item contract to control their own
presence in the dock. See [Contracts](/docs/contracts/).
:::

## Position and style

The dock can sit at the bottom, the left, or the right. It comes in two styles:
floating, a compact bar centered on its edge, or panel, a full-width strip. When
it is floating you can align it to the start, the center, or the end of its edge.
In panel style, an extended taskbar mode adds window titles next to the icons.

## Size and spacing

The icon size runs from small to big, with a slider for anything in between, and
a gap control sets how far the dock sits from the screen edge.

## Staying out of the way

The dock has a few ways of behaving so it is present without being in the way:

- **Always visible** keeps it on screen.
- **Autohide** slides it away and brings it back when you move toward its edge.
- **Hide if maximized** keeps it visible until a window is maximized on the same
  monitor, then steps aside.
- **Overview only** keeps it hidden until you open the overview.

It also hides for fullscreen windows.

## Fusing with the panel

The dock and the top panel can become one. Turn on panel fusion and the panel
merges into the dock as a single element. With fusion on, the dock stays always
visible, since it is now carrying the panel too.

## Multiple monitors

On a multi-monitor setup the dock can appear on every display, and the primary
dock can show apps from all monitors at once.
