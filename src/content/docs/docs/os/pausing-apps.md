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

## What to expect

- A paused app does not receive messages, play audio or finish downloads until
  you resume it. A call or a download in progress stops while it is paused.
- Its memory is kept. Because a paused app stops touching it, that memory turns
  cold, and [memory tiering](/docs/os/memory-tiering/) can move it out of RAM to
  give the rest of the system more room.
