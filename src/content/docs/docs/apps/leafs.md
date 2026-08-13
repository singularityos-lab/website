---
title: Leafs
description: The Singularity terminal.
---

Leafs is the terminal. It is built on VTE, and it arranges your shells into panes
you can split, move, and detach.

## Leaves and flowers

Each shell is a leaf, and leaves stack in a window with thin separators between
them. Add a leaf with `Ctrl+Shift+N`, drag a leaf to reorder it, or detach it
into its own window, which Leafs calls a flower. Inside a leaf you can also open a
bug: a smaller secondary terminal that shares the pane, handy for a quick command
without losing your place. A bug appears in the leaf's chip bar; drag that chip
outside Leafs to turn the running terminal into a flower of its own. The process
keeps running during the move.

## Copy, paste, and history

Copy and paste are `Ctrl+Shift+C` and `Ctrl+Shift+V`. Paste is smart: paste an
image and Leafs writes it to a file and pastes the path instead. Each leaf keeps
its own history, seeded the first time from your shell's existing history, so the
commands you already know are there waiting.

## Saved SSH sessions

Leafs keeps a list of SSH connections, each with a host, port, user, and either a
password or a key. Pick one and it opens the connection in a new leaf. Your
layout is saved when you quit and restored next time, panes and working
directories included.

## Settings and running commands

Font, size, scrollback, and color scheme are configurable, and the color scheme
can follow the desktop's dark mode and accent automatically. You can launch Leafs
with a command to run with the `-e` option.

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl+Shift+N` | New leaf |
| `Ctrl+Shift+C` | Copy |
| `Ctrl+Shift+V` | Paste |
| `Ctrl+Q` | Save the session and quit |
