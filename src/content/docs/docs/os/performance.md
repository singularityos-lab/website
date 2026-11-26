---
title: Performance, games and hardware health
description: Game Mode, the GPU mode on laptops with two GPUs, background apps, disk priority, fans, and the health of the battery and disks.
---

**Settings, Performance** gathers what decides how fast the computer feels and
how long it lasts.

## Games

- **Game Mode** puts the computer in performance mode and lowers every hidden
  app while it is on. **Auto Game Mode** turns it on when a full screen game is
  detected; **Game Mode Active** turns it on by hand.
- **Allow Tearing** lowers input lag for full screen games that ask for it.
- **MangoHud** shows frame rate and load over games; **Auto MangoHud** adds it to
  games started from the shell.

The game overlay, the faster graphics card and Wine are described in
[Games](/docs/os/games/).
- **Variable Refresh Rate** is set per screen in **Settings, Displays**.

## Graphics

On laptops with an integrated and a dedicated GPU, **GPU Mode** chooses:

- **Hybrid**: the desktop runs on the integrated GPU and the dedicated one wakes
  for the apps that ask for it. Longer battery life.
- **Dedicated GPU Only**: the screen is connected to the dedicated GPU. Highest
  frame rates, shorter battery life.

The change takes effect after a restart. Apps that prefer the dedicated GPU run on
it in Hybrid mode as well. Installing the NVIDIA driver is covered in
**Settings, Firmware** on Sinty OS.

## Power profile

**Power Profile** chooses **Power Saver**, **Balanced** or **Performance**.
**Extreme Save** goes further than Power Saver and also turns off animations. On
battery the top bar refreshes less often, and Settings says why power is limited
when it is.

## Background apps

**Lighter Background Apps** gives an app less processor, disk and memory when all
its windows are minimized or covered, and its windows stop drawing. On battery,
an app left hidden and idle for ten minutes is paused until you open it again.
Apps playing audio or video, keeping a connection open or holding off sleep are
left alone. See [Pausing apps](/docs/os/pausing-apps/).

## Disk priority

**Sinty Scheduler** lets the app you are using reach the disk first. Background
work, such as builds, virtual machines and large copies, uses the whole disk when
nobody needs it and steps aside when you do. The page shows the disk response of
the app in use.

## Memory

Part of the memory works as compressed swap: pages that have not been used for a
while are compressed and kept in RAM instead of going to disk. It is as large as
the memory of the computer, up to 8 GiB, compressed with zstd where the kernel
offers it, and is always used before any swap on disk. When memory runs short the
computer slows down a little instead of freezing.

## Sinty Compute

Lets programs reuse results whose memory has not changed instead of computing
them again. See [Sinty Compute](/docs/os/sinty-compute/).

## Fans

**Speed and Temperature** shows each fan live. **Fan Behavior** follows the
firmware, a fixed speed, full speed, or a custom curve. **Restore Firmware**
gives control back to the computer.

## Hardware health

- **Battery**: how much of its original capacity is left, and an estimate of the
  charge cycles left.
- **Disk**: how much of its life is left, how much has been written, and roughly
  how much more it can take.

See also [Disk care](/docs/os/disk-care/).
