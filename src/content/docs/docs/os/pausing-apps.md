---
title: Pausing apps
description: Freeze an app in place to free the processor and memory, and pick it up again exactly where you left it.
---

Sinty OS can pause a running app. A paused app stops using the processor
completely, but nothing is closed: its windows, its open documents and its state
stay exactly as they were. When you resume it, it carries on from the same
instant.

Pausing lasts for the current session. If you log out or turn the computer off,
paused apps close like any other app.

## Pausing and resuming an app

- **From the dock.** Right click an app and choose **Pause**. Choose **Resume**
  from the same menu to bring it back.
- **From Monitor.** Pause or resume an app from the process list.

A paused window turns black and white and shows a play button in the middle.
Click the button to resume the app.

## Pausing a terminal in Leafs

Leafs can pause a single terminal instead of the whole app. Hover the terminal
and click the pause button, or right click it and choose **Pause Leaf**. The
terminal turns black and white and everything running in it stops. Click the
play button in the middle to resume it.

**Pause All Leafs** and **Resume All Leafs** in the same menu act on every
terminal at once.

## When the computer suggests it

When the computer stays under strain for a while, a notification offers to pause
the apps that weigh the most:

- **The Computer Is Working Hard** appears when the processor has been saturated,
  or the machine has been running hot, for about fifteen seconds.
- **Memory Is Running Low** appears when apps keep waiting for memory.

The notification names up to three apps that are using a large share of the
processor or more than 300 MB of memory. Choose **Pause Apps** to pause them, or
**Not Now** to dismiss it. After a suggestion, the computer waits ten minutes
before suggesting again.

Nothing is ever paused without you choosing it.

## Lighter background apps

Apps you are not looking at can also keep running with less. Turn on **Lighter
Background Apps** in Settings, under **Performance**. It is off until you turn it
on, and it appears only on Sinty OS.

When every window of an app has been minimized or covered for a few seconds, its
windows stop drawing. After ten seconds the app gets a smaller share of the
processor and the disk, and after a minute part of its memory is handed back to
the system. As soon as one of its windows is visible again, it gets everything
back. Apps that are playing audio or video are left alone.

Unlike a pause, the app keeps working: messages arrive, downloads continue and
timers fire, only more slowly.

## What to expect

- A paused app does not receive messages, play audio or finish downloads until
  you resume it. A call or a download in progress stops while it is paused.
- Its memory is kept. Because a paused app stops touching it, that memory turns
  cold, and [memory tiering](/docs/os/memory-tiering/) can move it out of RAM to
  give the rest of the system more room.

Apps can react to being paused, or offer a pause of their own. See
[App pause for developers](/docs/pause-api/).
