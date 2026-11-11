---
title: Sinty OS on ARM
description: Running Sinty OS on 64-bit ARM boards and laptops.
---

Sinty OS is also built for 64-bit ARM (aarch64). It is the same system as on a
PC: the same signed erofs root checked by dm-verity, the same A/B updates with
rollback, the same encrypted data space, recovery and installer. One image
serves every supported board.

:::caution[Early]
The ARM image is built and tested in emulation. Real boards are being brought
up one family at a time, so expect rough edges and check the release notes of
each build.
:::

## Supported hardware

| Family | Boards | Firmware | Kernel |
|--------|--------|----------|--------|
| NVIDIA Jetson Orin | Orin Nano, Orin NX, AGX Orin | UEFI from NVIDIA (JetPack 6) | L4T r36 |
| NVIDIA Jetson | Nano, TX1, TX2 | U-Boot with UEFI, from the board firmware bundle | mainline |
| Rockchip RK3588 | Radxa Rock 5B, Rock 5B+ | EDK2 UEFI, from the board firmware bundle | mainline |
| Raspberry Pi | Pi 4, Pi 5 | Raspberry Pi UEFI, from the board firmware bundle | mainline |
| Snapdragon laptops | ThinkPad X13s | UEFI from the vendor | mainline |
| Virtual machines | QEMU `virt`, UTM | AAVMF / EDK2 | mainline |

The machine must boot through UEFI. Boards that do not ship UEFI firmware get it
from the **boards** download of each build.

## How the kernel is chosen

The image carries a signed mainline kernelcache and, for boards that need their
vendor kernel, a signed family kernelcache next to it. At boot the loader reads
the device tree the firmware hands over: a Jetson Orin (`nvidia,tegra234`) starts
the `l4t` kernelcache, every other board starts mainline. Both are verified the
same way, and updates replace both together.

## Graphics

- **Mali (RK3588)**: Mesa with the Panthor driver.
- **Raspberry Pi**: Mesa with the V3D driver.
- **Jetson Nano, TX1, TX2**: Mesa with the Nouveau driver.
- **Jetson Orin**: the NVIDIA r36 graphics stack (EGL, OpenGL ES, Vulkan, GBM)
  next to Mesa, chosen through libglvnd. Sinty Core encodes the
  picture it sends to screens with the Orin hardware encoder.

## Without a TPM

Most boards have no TPM. There Sinty OS asks for a passphrase at boot and derives
the disk key from it with Argon2id. With a TPM the key is sealed to the machine as
on a PC. See [Hardware security and the TPM](/docs/os/hardware-security/).

## Installing

1. If your board needs it, put its firmware from the **boards** download in
   place first: the archive has one folder per board.
2. Write the image to a USB stick or SD card:
   `sudo dd if=sinty-os-arm64-<build>.img of=/dev/sdX bs=4M conv=fsync`
3. Boot from it and follow the installer, as in
   [Installing Sinty OS](/docs/os/install/).

ARM builds are listed in their own release, `nightly-arm64`, with the same columns
as the PC builds plus the family kernels and the board firmware.

## Updates

ARM machines follow their own update feed. An update downloads only the files for
your architecture, and on a Jetson Orin also the `l4t` kernelcache.
