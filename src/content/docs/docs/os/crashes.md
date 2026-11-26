---
title: When something crashes
description: How Sinty OS brings back a crashed or frozen desktop and service, and where crash reports are kept.
---

## The desktop comes back

The compositor draws every window, and the shell draws the panel, the dock and
the rest of the desktop. Both are watched while you work.

- **The compositor crashes**: it is started again within seconds. Your session
  stays open and your apps keep running.
- **The compositor freezes**: it has to report that it is alive at least every
  30 seconds. When it stops, it is ended and started again, and the session stays
  open.
- **The shell crashes**: it is started again within seconds.
- **The shell freezes**: when it stops answering three checks in a row, it is
  ended and started again.
- **The desktop keeps crashing**: after repeated failures it comes back in safe
  mode, with your settings set aside, so you can reach Settings and undo what
  broke it.

## Services come back

System services, such as networking, power, logins and disks, are supervised by
the init. A service that crashes is started again, usually within a second or
two. A service that declares a watchdog and stops reporting is ended together
with every process it started, and started again.

## Crash reports

When a program crashes, the system keeps a copy of its memory, a core dump, for
whoever debugs it. Core dumps are written to `/var/lib/sinty/coredump`, readable
by root only, compressed, one file per crash, named after the time, the program
and its process number. A line about each crash goes to the kernel log, which
the [Logs](/docs/apps/logs/) app shows.

To keep crashes from filling the disk:

- a single core dump is cut at 1 GiB;
- at most 20 core dumps and 2 GiB are kept, and the oldest go first;
- a program that crashes more than three times in ten minutes gets only a short
  record of each further crash, without its memory;
- nothing is written while the disk has less than 10% free space.

Core dumps are written at idle disk priority, so a crash does not slow down the
rest of the system.

## Logs of earlier starts

The kernel and compositor logs of the last starts are kept on disk, so a crash
that took the whole computer down can still be read at the next start. Open
**Logs** and pick an earlier session.
