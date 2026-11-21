---
title: Arduino UNO Q
description: Installing Sinty OS on the Arduino UNO Q, its quirks, and how to recover it.
---

| | |
|---|---|
| Board | Arduino UNO Q (Qualcomm QRB2210, codename imola) |
| Profile | `arduino/uno-q` |
| Install method | EDL package, with [Sinty Flash](/docs/os/sinty-flash/) and `qdl` |
| Security level | 2, signed loader without a hardware seal (see [Supported devices](/docs/os/devices/#security-levels)) |
| Way back | [Arduino's image update](https://docs.arduino.cc/tutorials/uno-q/update-image/) |

:::caution[Early]
The UNO Q is a development board with one USB-C port for power, display and
data. Read the quirks below before installing: most problems come from the dock
and the boot firmware, not from Sinty OS.
:::

## What you need

- A USB-C dock with **its own power supply**, an HDMI output and USB ports, for
  the display, keyboard and mouse.
- A computer running Linux with [Sinty Flash](/docs/os/sinty-flash/) and
  [`qdl`](https://github.com/linux-msm/qdl).
- Arduino's flash package for the board (the `flash` folder of the Arduino
  Debian image), which carries the partition tables and the EDL programmer
  `prog_firehose_ddr.elf`.
- The signed ARM release of Sinty OS.

## What is replaced

The `rootfs` and `userdata` partitions become one Sinty data partition, and the
EFI partition is rewritten. Every Qualcomm firmware partition, the boot chain and
the partition attributes stay exactly as Arduino's package ships them.

## Installing

1. Build the package on the computer:

   ```sh
   sinty-flash edl-package arduino/uno-q ./release ./arduino-flash ./uno-q-sinty
   ```

   For a board that will run without a display, add
   `-trust-host ~/.config/sinty-sdb/host.crt` so the
   [debug bridge](/docs/sdb/) trusts this computer from the first boot.

2. Put the board in EDL mode (see below) and connect it directly to the computer.
   Check that it shows up:

   ```sh
   lsusb | grep 05c6:9008
   ```

3. Flash:

   ```sh
   cd uno-q-sinty
   qdl -s emmc prog_firehose_ddr.elf rawprogram0.xml patch0.xml
   ```

   The ESP and data images are sparse, so only the data they hold is written.
   `qdl` restarts the board when it finishes.

4. Move the board to the dock, with the display connected and switched on, and
   power the dock. The first boot grows the data partition to the whole eMMC and
   shows the setup. Without a TPM, the disk is unlocked with a passphrase.

## Entering EDL mode

EDL is the recovery mode in the chip's boot ROM; it cannot be erased.

- **With the jumper:** short the two `JCTL` pins and power the board.
- **From fastboot, without the jumper:** if the board is in its bootloader's
  fastboot mode (USB id `18d1:d00d`), erase both copies of the first-stage
  loader and restart it: `erase:xbl_a`, then `erase:xbl_b`, then `reboot`. The
  boot ROM finds no loader and enters EDL within seconds. Arduino's package
  writes `xbl_a` and `xbl_b` again, so flash in the same EDL session.

Check EDL only with `lsusb` (`05c6:9008`). The LED matrix animation is drawn by
the board's microcontroller and keeps running in every mode, EDL included.

## Quirks

- **The dock is a USB host only after a cold start.** Power the board through
  the dock with the display already on. If keyboard, mouse or display do not
  appear, remove power and start again; a warm restart is not enough.
- **No boot menu on the display.** The boot firmware never shows its menu on the
  dock's output. Sinty OS does not need it.
- **No battery-backed clock.** The board starts at 1970 until the network sets
  the time, which Sinty OS does at boot. Until then secure connections fail, so
  the Store and updates wait for the network.
- **Memory.** Sinty OS turns on compressed swap in memory (zram), which keeps the
  web engine and several apps usable on the 4 GB board.
- **Do not cut power during Arduino updates.** Before installing, if the board
  runs Arduino's Debian, let `arduino-app-cli` and App Lab updates finish. An
  interrupted update can leave the microcontroller firmware half written.

## The bootloader's fastboot mode

The board's bootloader (ABL) drops to fastboot when slot A has used all its
seven start attempts. Sinty OS does not yet mark the slot as working after a good
boot, so each start uses one attempt and the board lands in fastboot after seven
starts. Until that is fixed, restore the attempts with `set_active:a` as shown
below; no data is touched.

ABL's fastboot is unusual:

- Send **one command per USB connection**, terminated by a NUL byte. ABL does not
  clear its command buffer, so a short command after a long one is read with the
  end of the previous one attached.
- The standard `fastboot --set-active=a` refuses with "Device does not support
  slots". Sending the raw command `set_active:a` restores slot A's start attempts
  without touching any data; then send `reboot`.
- `reboot-edl` answers OKAY but restarts into fastboot again. Use the `xbl`
  erase above instead.
- `getvar` answers for `slot-count`, `current-slot`, `slot-retry-count:a`,
  `slot-unbootable:a`, `slot-successful:a` and `partition-size:<name>`, but not
  for `version`, `product` or `all`.

## Debug bridge over USB

Connected to a computer by cable, the board appears as **Sinty on Arduino UNO Q**
once Sinty OS has started, even without a display, and takes `172.16.42.1` on
the cable like a phone does. With a Pixel or another Sinty device plugged in at
the same time, both use the same address: connect one at a time.

## Going back to Arduino's Debian

Put the board in EDL mode and follow
[Arduino's image update](https://docs.arduino.cc/tutorials/uno-q/update-image/).
Its flasher rewrites every partition, including the ones Sinty OS replaced.
