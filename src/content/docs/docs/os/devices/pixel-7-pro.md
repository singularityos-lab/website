---
title: Google Pixel 7 Pro
description: Installing Sinty OS on the Pixel 7 Pro, what works, and what to know before and after.
---

| | |
|---|---|
| Codename | cheetah (Google Tensor G2, gs201) |
| Profile | `google/pixel-7-pro` |
| Install method | fastboot, with [Sinty Flash](/docs/os/sinty-flash/) |
| Security level | 3, Sinty Port (see [Supported devices](/docs/os/devices/#security-levels)) |
| Way back | the [factory image for cheetah](https://developers.google.com/android/images#cheetah) |

:::caution[Early]
The Pixel 7 Pro is the first phone Sinty OS runs on. Install it on a phone you
can spare: the install erases the phone, and some hardware is not supported yet.
:::

## What works

- Display at 1440 x 3120 and 120 Hz, with the GPU (Mali-G710, Panthor driver).
- Touch, the screen keyboard and the phone layout of the shell
  (see [Sinty OS on phones](/docs/os/mobile/)).
- Wi-Fi, and the speakers with the factory speaker protection.
- Battery and charging.
- Updates over the air, with the boot partitions kept in step with each release.
- The [debug bridge](/docs/sdb/) over Wi-Fi and over the USB cable.

## Not yet

- Calls, SMS and mobile data: the modem service is in development.
- Cameras: the camera stack runs, image orientation and quality are being worked on.
- The fingerprint reader.
- Bluetooth, rotation and vibration are in place and still being verified on
  the phone.
- Relocking the bootloader (see below).

## What is replaced

Sinty OS replaces the slot A boot images (`boot`, `init_boot`, `vendor_boot`,
`vendor_kernel_boot`, `dtbo`) and `userdata`. The bootloader, the modem, the
`persist` and EFS partitions and Android's `super` partition stay as shipped, so
the phone keeps its IMEI and its calibration data.

Firmware for Wi-Fi, Bluetooth, audio and haptics is not shipped with Sinty OS.
On its first boot the phone copies it from the Android vendor partition already
on it. Install Sinty OS on a phone that has a working Android, not one with an
erased `super` partition.

## Before you start

1. Update Android to the latest version once. The firmware Sinty OS copies comes
   from it.
2. In Android, open **Settings, About phone** and tap **Build number** seven
   times to enable the developer options. In **Developer options**, turn on
   **OEM unlocking**.
3. Turn the phone off. Hold **Volume Down** and press **Power** to start the
   bootloader (fastboot mode), and connect it to the computer with a USB cable.

## Installing

1. Get [Sinty Flash](/docs/os/sinty-flash/) and check it sees the phone:

   ```sh
   sinty-flash detect
   ```

2. Put the signed ARM release in one directory: the manifest with its signature
   and certificate, the root image, the hash tree and `kernelcache.efi`.

3. Flash:

   ```sh
   sinty-flash flash google/pixel-7-pro ./release
   ```

   If the bootloader is still locked, the tool offers to unlock it. The phone
   asks for confirmation on its screen; use the volume keys and **Power**.
   Unlocking erases the phone.

4. The tool builds the boot images and the data image, writes them, makes slot A
   active and restarts the phone. The first boot copies the firmware and then
   shows the setup.

From then on the phone updates itself like any Sinty OS device.

## Things worth knowing

- **Android stays on slot B.** If Sinty OS on slot A fails to start several times
  in a row, the bootloader falls back to Android on slot B. Android then formats
  and encrypts `userdata` for itself, and Sinty OS's data is gone: flash again
  from step 3.
- **Charging is slow on purpose.** Until USB-C power negotiation is supported, the
  charger is limited to a safe current. A phone left in the bootloader screen also
  charges.
- **The cable is a network link.** With the debug bridge on, the phone is
  `172.16.42.1` on the cable. Two Sinty devices plugged into the same computer
  use the same address; connect one at a time.
- **Do not relock the bootloader.** On Android the **OEM unlocking** switch lives
  in Android itself. Without Android there is no way to turn it on again, and a
  relocked phone that cannot start might not be recoverable. Sinty Flash never
  relocks.
- **Fastboot from Sinty OS.** Restart the phone holding **Volume Down** to land in
  the bootloader again.

## Going back to Android

Start the bootloader and flash the
[factory image for cheetah](https://developers.google.com/android/images#cheetah)
with Google's instructions or the Android Flash Tool. Because the bootloader,
modem and calibration partitions were never touched, the phone is exactly as it
came.
