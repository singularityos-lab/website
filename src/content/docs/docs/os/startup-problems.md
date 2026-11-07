---
title: When Sinty OS cannot start
description: What happens when the system or its data partition is damaged, what Sinty OS repairs on its own, and what it leaves to you.
---

A computer running Sinty OS never stops on a frozen screen or restarts in a loop.
At every start it ends in one of two places: the system, or
[recovery](/docs/os/recovery/) with the reason it could not start.

## A normal start checks nothing extra

The data partition is checked only when it fails to mount. A healthy start runs
no check and shows the usual loading screen.

## Repairs made on their own

When the data partition does not mount, the system checks it without writing to
it first. The progress bar on the loading screen is replaced by one line per
step, for example *Checking the data partition* and *Repairing the data
partition*. The system then starts normally.

The automatic repair only rewrites the partition's bookkeeping: the table of
used space, the block and file counters, and the record of where writing stopped.
No file, folder or directory entry is changed. Damage of this kind is what a
power cut or a crash usually leaves behind.

If fixing the partition would remove files or folders, nothing is changed and
recovery opens. That decision is yours.

A failed repair is tried once per start. It never restarts the machine in a loop.

## Recovery tells you why

When recovery opens on its own, its first screen says why the system could not
start, for example:

- *the system kernel has an invalid signature*
- *the data partition holds no system image*
- *the system image matching the root hash fails verification*
- *the disk holding the system reported read errors*

If a newer system fails and an older one is still on the disk, the computer goes
back to the older one instead. See [Updates and rollback](/docs/os/updates/).

## Repairing the data partition from recovery

When the data partition is the problem, recovery opens on a screen of its own and
checks the partition again. It then offers:

- **Repair the data partition.** If the repair only touches bookkeeping, it runs
  straight away. If it could remove files, recovery asks for your
  [PIN](/docs/os/pin-and-encryption/) and for the word `REPAIR`, typed in full.
- **Check again.**
- **Save a report.** The check output, before and after any repair, is written to
  the boot partition under `EFI/atom/state/`.
- **Start Sinty OS.**
- **More recovery options**, such as reinstalling over wifi.

When the partition has no valid file system records left, recovery says it cannot
be repaired and changes nothing. Save a report first, then reinstall.

## Reports

Every failed start writes a report with the reason, the disks found, their health
and the last kernel messages. It goes to a `SINTYLOGS` USB stick if one is
plugged in, and to the boot partition as `EFI/atom/state/SINTYRESCUE.txt`. The
reason and every automatic repair are also kept in the computer's sealed log,
which cannot be edited afterwards.

## Disk health

On NVMe drives the report includes the drive's own health data: critical
warnings, media errors and unsafe shutdowns. When the drive itself reports a
failure, recovery says the disk is failing instead of blaming the system, so you
know to replace the drive rather than reinstall.

## Limits

- Files written in the last seconds before a power cut can be missing after the
  repair. The partition is brought back to its last consistent state; it cannot
  bring back data that never reached the disk.
- A failing drive cannot be repaired by software. Save what can still be read,
  then replace it.
- Damage that would cost files is never repaired without your PIN.
