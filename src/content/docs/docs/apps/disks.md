---
title: Disks
description: Manage drives, partitions, encryption and disk images, and check drive health.
---

Disks shows every drive connected to the computer and what is on it.

## Partitions and volumes

- **Format** a whole disk with a GPT or MBR partition table, or a single volume
  with Ext4, Btrfs, exFAT, FAT32, NTFS or encrypted Linux (LUKS and Ext4).
- **Create**, **delete**, **resize** and **rename** partitions, and change their
  type.
- **Mount** and unmount volumes, choose where and whether they mount at startup,
  and **check** or **repair** a filesystem.
- **Lock** and **unlock** encrypted volumes, and change their passphrase. If you
  lose the passphrase, the data cannot be recovered.

Erasing can be quick, or slow to overwrite every block.

## Disk images

**Attach Disk Image** opens an ISO or IMG file as a drive. **Create Disk Image**
copies a whole disk or a volume into an image file, and **Restore Disk Image**
writes an image back onto a drive, replacing everything on it.

## Health

**Drive Health** reads the SMART data of hard disks and the health log of NVMe
drives: temperature, power-on hours, bad sectors, life used and an overall
assessment that warns when a drive is likely to fail soon. Self-tests run from the
same place, from a short test to an extended one that may take hours.

**Benchmark** measures the read rate across the drive and its access time.

## Drive settings

For hard disks, choose when the drive spins down when idle, put it in standby
right away, and turn its write cache on or off.
