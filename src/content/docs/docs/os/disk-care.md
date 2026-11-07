---
title: Disk care and health
description: How Sinty OS keeps the disk responsive, trims and cleans the F2FS filesystem, and shows how much life the battery and the disk have left.
---

Sinty OS stores your files on F2FS, a filesystem made for flash storage. Flash
needs housekeeping: blocks freed by deleted files have to be reported to the disk,
and half-used areas have to be compacted before new data can go there. The
`sinty-schedd` service does this work in the background and sets the disk
priority switch in Settings.

## Disk priority

**Settings, Performance, Disk Priority** has the **Sinty Scheduler** switch. With
it on, the app you are using reaches the disk first. Builds, virtual machines and
large copies still get the whole disk when nothing else needs it, and step aside
when you do.

The switch applies at once and is off by default. It only appears when the kernel
module is installed. Turning it off restores the previous scheduler.

Every request falls in one of three classes:

| Class | Who |
|---|---|
| interactive | the app in focus, the session, and filesystem metadata |
| normal | the other open apps, and the delayed writes of the app in focus |
| background | dsh with the VMs and builds running there, hidden apps when **Lighter Background Apps** is on, delayed writes of normal apps, discards, and anything at idle I/O priority |

Programs mark their own background work with the standard idle I/O priority, so
it lands in the background class: file copies and archive extraction in Files,
update checks and app updates in the Store, cache writes of the browser, and the
background workers of every app built on [SIT](/docs/sit/). The same priority is
honoured by the stock Linux schedulers on other systems.

The scheduler watches response times, not bandwidth:

- A read slower than 5 ms or a synchronous write slower than 20 ms halves the
  number of requests the background class may keep in flight. The limit grows
  back every 50 ms without a slow request.
- Background requests wait while the app in use has requests in flight or a cache
  flush is pending, for at most 500 ms.
- Background work always keeps at least 10% of the dispatches, so it never stops.
- Requests are capped at 512 KB while the scheduler is on.

While the scheduler is on, **Disk response of the app in use** shows the time
within which 99% of the reads and synchronous writes finish. The counters behind it are in `/sys/block/<disk>/queue/iosched/`.

## TRIM

Once a day `sinty-schedd` tells the disk which blocks are free, so the disk can
erase them ahead of time and keep writes fast. It works in slices of 16 GiB with
a 5 second pause between them and skips free ranges smaller than 64 KiB, so it
never holds the disk for long. The time of the last complete pass is kept in
`/var/lib/sinty-scheduler/trim`; a pass that stops halfway starts again on the
next check.

## Cleaning F2FS

F2FS writes new data into free segments of 2 MiB. When few are left, it has to
move the live data out of partly used segments first, and a write that has to wait
for that is slow. `sinty-schedd` keeps a reserve of free segments by starting the
cleaning before the reserve runs out:

- Cleaning starts when free segments drop below the lower of 10% of the disk and
  40% of the space still available.
- It stops when they are back above the lower of 15% of the disk and 60% of the
  space still available.
- Between the two it keeps doing what it was doing, so it does not flip on and off.
- It pauses 100 ms between steps, or 500 ms while other programs are waiting for
  the disk, unless the reserve is almost gone.

The service checks every 30 seconds, starting one minute after boot. Each change
is written to the system log:

```bash
atomctl logs | grep "f2fs collection"
```

## Battery and disk health

**Settings, Performance, Hardware Health** shows one line per battery and per
NVMe disk:

- Battery: the capacity left compared to when it was new, the charge cycles, and
  about how many cycles remain before it drops to 80%.
- Disk: the life left as the drive reports it, the data written so far, and about
  how much more it can write at the same rate of wear.

The group is hidden on computers that report neither.

For the full detail of a drive, open **Disks**, select the drive and choose
**Drive Health**. It shows the drive's own assessment, the hours powered on, the
temperature, any critical warnings, and the complete SMART attributes or NVMe
health log. **Run Self-Test** asks the drive to check itself.

When a drive says it is likely to fail, copy your data to another drive and
replace it. See [Backups](/docs/apps/backups/) to keep a copy on another disk.
