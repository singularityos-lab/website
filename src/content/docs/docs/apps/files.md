---
title: Files
description: The Singularity file manager.
---

Files is the file manager of the Singularity desktop. It lets you navigate,
organize, and act on everything on your machine, and reach files that live
elsewhere on your network too.

## Three ways to look at a folder

Files gives you three views, and you switch between them from the toolbar or by
cycling with `Ctrl+Shift+V`:

- **List** shows a detailed table with name, size, type, and modified date. You
  can right-click the column headers to choose which columns appear.
- **Grid** shows icons and thumbnails, with an icon size you can grow and shrink
  with `Ctrl+` and `Ctrl-`.
- **Column** is the Finder-style view: each folder you open adds a column to the
  right, so you can see the path you took and move along it quickly.

## Finding your way

The path bar at the top is a breadcrumb you can click to jump to any parent
folder. Press `/` to turn it into a text field with path completion, or `~` to
start from your home folder. Start typing anywhere in a folder and Files filters
it live; press `Escape` to clear the search.

## The sidebar

The sidebar is your map. It holds your common places (Home, Documents,
Downloads, Pictures, Music, Videos), along with Recent and Trash. Below that are
your bookmarks: drag a folder onto the sidebar to pin it, and right-click to
remove it. The Disks entry opens a page showing every mounted drive with a usage
bar, and the Network entry is where you reach shared and remote locations.

## Working with files

The everyday operations are all here, with keyboard shortcuts for the ones you
reach for most: copy, cut, and paste, rename in place with `F2`, move to Trash
with `Delete`, and make a new folder with `Ctrl+Shift+N`. Long operations show a
progress banner you can cancel, and you can drag files between windows. The
Properties dialog shows type, size, location, modified date, and permissions.

Files also handles archives: open one as a folder to browse inside it, extract
it here or to a folder you pick, or select files and compress them to a `.tar.gz`
or `.zip`.

## Connecting to a server

From the Network section you can connect to a remote server by address, such as
`sftp://user@host` or `ftp://host`.

:::caution[Still in development]
Connecting to a server is early and still being tested. It does not yet prompt
for passwords or let you pick an SSH key, and it does not save connections, so
it works best with simple shares that do not need interactive sign-in.
:::

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl+Shift+V` | Cycle list, grid, and column views |
| `/` | Type a path |
| `~` | Type a path from home |
| `Ctrl+H` | Show or hide hidden files |
| `F2` | Rename |
| `Delete` | Move to Trash |
| `Ctrl+Shift+N` | New folder |
| `Ctrl+C` / `Ctrl+X` / `Ctrl+V` | Copy, cut, paste |
| `Ctrl+A` | Select all |
| `Space` | Quick preview |
| `Ctrl+N` | New window |

Files also backs the system file picker, so when another app asks you to open or
save something, the dialog you see is Files doing the work.
