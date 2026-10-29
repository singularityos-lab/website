---
title: Scrolling tiling
description: Arrange windows in a horizontal strip, stack them, and move through them with the touchpad.
---

Scrolling tiling arranges windows in columns that continue past the sides of the
screen. The focused column stays readable instead of shrinking every window to
fit the current work area.

## Turn it on

Open **Settings**, go to **Desktop**, then find **Window Management**. Turn on
**Tiling** and set **Tiling Layout** to **Scrolling**. Choose the **Column Width**
and **Window Gap** you want from the same group.

Column width is a percentage of the available work area. Window gap controls
both the space around the layout and the space between columns. **Window Border
Width** sets the accent-colored border around scrolling-tiled windows; set it
to zero if you do not want one.

The tiling quick setting can turn the selected layout on or off without opening
the full page.

## Move through the strip

Swipe horizontally with three fingers. The strip follows the touchpad movement
one to one, then settles on the nearest column when you release. You do not need
to place the next window exactly in the center before letting go.

Press **Super + Left** or **Super + Right** to move the focused column by one
slot without using the touchpad.

A position pill appears in the panel while scrolling tiling is active. Its inner
marker shows the visible part of the strip. The pill is part of the default panel
layout, disappears outside scrolling mode, and can be moved with the panel and
dock customizer.

New windows open beside the focused column. Dialogs and other surfaces the
compositor marks as unsuitable for tiling remain floating.

## Move and stack windows

Drag a window sideways to change its position. The drop guide moves with the
window and shows the column it will occupy.

Move the pointer near the top or bottom edge of another window to place both in
the same column. The guide changes to the exact part of the column that will be
used. Drag a stacked window sideways to give it an independent column again.

When the floating target appears at the bottom, drop the window there to remove
it from the tiling strip. Resizing a tiled window changes the width of its
column, including every window stacked in that column.

The compositor work area keeps visible panels and docks outside the layout.

## Close the focused window

Swipe down with three fingers while scrolling tiling is active. The focused
window follows the gesture first. Continue past the resistance to reveal the
delete indicator and desaturate the window. The background gains a restrained
red tint when the close action is armed. Release there to close it, or release
early to return it to its column.

See [Touchpad gestures](/docs/touchpad-gestures/) for the complete gesture map.

## Grid tiling

Set **Tiling Layout** back to **Grid** for the fixed layout. **Super + R** asks
the desktop to arrange the tiled windows again in either mode.
