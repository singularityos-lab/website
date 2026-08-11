---
title: Spotlight
description: Launch apps and run commands from one box.
---

Spotlight is the box that opens in the center of the screen for searching and
acting on the desktop. Press Super and Tab to open it, or Shift, Alt and F2.

## Apps or commands

The box starts in search mode, with a lens icon. It matches apps by name,
command, and id, and it also searches files through the system index. It shows
the closest matches first; pick one with the arrow keys and Enter, or click it.
When a file has a preview, the selected result opens that preview on the right
without leaving the palette.

Type something that is not an app or file and it becomes a command. Press Enter
and Spotlight runs it in your terminal, leaving the terminal open afterward so
you can see the output. Basic mathematical expressions are evaluated directly;
for example, typing `19/2` gives `9.5` as a selectable result.

## Desktop actions

Type `!` to switch to action mode. The icon changes with the mode and the list
shows desktop actions instead of keeping their shortcuts visible during a
normal search. The available actions include:

- Customize Panel and Dock
- Open Settings
- Lock Screen
- Workspace Overview
- Application Launcher
- Open Terminal
- Emoji Picker
- Take Screenshot
- Enable Tiling

Select an action with the arrow keys and Enter, or click it. The right-aligned
shortcut hint is shown only in this mode, so the normal palette stays focused
on the thing you are looking for.

## History

Spotlight remembers the commands you run, up to the last fifty, in your data
folder. Walk back through them with the Up and Down arrows so the things you do
often are quick to repeat. Press Escape to close the box.

The overview also has its own search surface for richer workflows and custom
providers. See [Search providers](/docs/search-providers/) for the provider API.
