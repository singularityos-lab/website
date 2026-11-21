---
title: Supported devices
description: Which machines run Sinty OS, how well each class is protected, and how devices are described.
---

Sinty OS runs on PCs, on 64-bit ARM boards and laptops, and on a first set of
phones and single-board computers. Every device gets the same system: the signed
read-only root checked by dm-verity, updates with rollback, encrypted data and
recovery. What changes from one device to another is how much of the boot chain
Sinty OS controls, and so how strongly it can protect the system.

## Security levels

| Level | Name | Boot chain | Disk key | Devices |
|---|---|---|---|---|
| 1 | Sinty Device | Secure Boot and the signed Atom Loops loader | sealed to the TPM | modern PCs with a TPM 2.0 |
| 2 | Sinty Device without a hardware seal | the signed Atom Loops loader | derived from a passphrase with Argon2id | PCs without a TPM, ARM boards such as the Arduino UNO Q |
| 3 | Sinty Port | the vendor's own boot chain | derived from a passphrase | phones that keep the Android bootloader, such as the Pixel 7 Pro |

On every level the root filesystem is verified and the update manifest is
signed. Level 3 differs in how the system is started: the phone's bootloader
loads the kernel, so Sinty OS cannot verify that step or switch it atomically.
Settings shows the parts that make up the level, Secure Boot, the TPM and disk
encryption, on the **Device Security** page.

See [Hardware security and the TPM](/docs/os/hardware-security/) for what the
seal protects against.

## PCs

Any 64-bit x86 PC that boots through UEFI. A TPM 2.0 gives level 1; without one
the installer asks for a passphrase instead. See
[Requirements](/docs/os/requirements/).

## ARM boards and laptops

One shared ARM image boots these machines through UEFI:

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

Most boards have no TPM and run at level 2. How the kernel is chosen for each
board, the graphics drivers and the install steps are in
[Sinty OS on ARM](/docs/os/arm/).

## Phones and boards with their own firmware

Some devices keep their boot chain, modem and calibration data on the same
storage as the operating system. Writing a whole disk image over them would
erase that firmware. These devices are installed with
[Sinty Flash](/docs/os/sinty-flash/), which writes only the partitions the
device's profile allows.

| Device | Install method | Level | Page |
|---|---|---|---|
| Google Pixel 7 Pro | fastboot | 3 | [Pixel 7 Pro](/docs/os/devices/pixel-7-pro/) |
| Arduino UNO Q | EDL package or installer stick | 2 | [Arduino UNO Q](/docs/os/devices/arduino-uno-q/) |

:::caution[Early]
Phone and board support is new. Read the device page before installing: each
one lists what works, what does not yet, and how to get back to the original
system.
:::

## Device profiles

Each device model is described by a JSON profile in
[sinty-devices](https://github.com/singularityos-lab/sinty-devices). A profile
says:

- how to recognise the device: device tree `compatible` strings and the USB ids
  it shows in each mode;
- how Sinty OS is installed: from an installer stick, over fastboot, or as an
  EDL package;
- which partitions may be replaced, and that every other partition stays as
  shipped;
- for phones, how the boot images are built and which firmware is copied from
  the vendor partition already on the device;
- where the vendor's own image is, to go back.

The installer embeds the catalog it was built with. Sinty Flash downloads the
current catalog when it runs, so a newly merged device works without a new
version of the tool. To add a device, see
[Contributing](/docs/contributing/#adding-a-device).
