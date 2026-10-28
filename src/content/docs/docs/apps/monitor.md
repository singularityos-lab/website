---
title: Monitor
description: The Singularity system monitor.
---

Monitor shows you what your machine is doing right now, and lets you act on
processes that are misbehaving.

## Live resources

Down the side are four cards, each with a small live chart that fills in as time
passes:

- **CPU**, with the overall load and a row of bars for the individual cores.
- **Memory**, with how much is in use against the total.
- **Disk**, with read and write rates drawn together.
- **Network**, with the download and upload rates.

## Processes

The rest of the window is the process list. Processes are grouped by app so the
list stays readable, and you can expand a group to see its parts. Each row shows
the name, process id, CPU, memory, and the user it runs as, and you can sort and
search. Start typing to filter by name or id.

Right-click a process for the actions you need when something is stuck: end it,
force kill it, suspend or resume it, or copy its name or id. You can also open a
properties dialog, see its memory maps, and list the files it has open.

## Pausing an app

An app in the process list can be paused and resumed. A paused app stops using
the processor but keeps its windows and state. See
[Pausing apps](/docs/os/pausing-apps/).

## GPU and network per app

Next to processor and memory, the process list shows how busy each app keeps the
graphics card, how much video memory it uses, and its network traffic. GPU use
comes from the kernel's per-client counters, which most drivers provide: Intel,
AMD, Nouveau and several ARM GPUs. Network traffic covers TCP connections.

## On the dock

Monitor can push the current CPU and memory onto the dock as small rings, so you
can keep an eye on the machine without bringing the window forward.

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| Type a letter | Start searching the process list |
| `Ctrl+A` | Select all processes |
| `Ctrl+K` | Force kill the selected processes |
| `Escape` | Close the search |
