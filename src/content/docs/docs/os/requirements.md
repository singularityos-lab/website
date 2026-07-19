---
title: Requirements
description: The hardware Sinty OS needs to run.
---

Sinty OS is built for modern PCs. Because it verifies and encrypts the system by
design, some of these requirements are not optional: the machine has to be able to
boot a signed image and to hold a key in hardware.

## Firmware and CPU

- **UEFI firmware** with **Secure Boot**. Sinty OS boots a signed image through a
  UEFI loader; legacy BIOS boot is not supported.
- **64-bit x86 (x86_64) CPU**, at least the **x86-64-v2** baseline. In practice
  that means roughly a 2009-or-newer processor (SSE4.2). Older CPUs are not
  supported and will refuse to run parts of the system.

Other architectures (ARM, RISC-V) are a direction for the underlying deployment
engine, but Sinty OS itself targets x86_64 today.

## Security hardware (TPM)

- A **TPM 2.0** is currently required. It is what seals your encryption key to the
  machine so your data is bound to that specific device.
- The best experience is a **firmware TPM built into the CPU** (AMD Pluton on
  Ryzen 6000 and newer, recent Intel, or Qualcomm), which resists physical
  bus-sniffing attacks. A **discrete TPM 2.0** chip also works.

:::note
A machine with no TPM at all is meant, by design, to fall back to a PIN-only mode
(no hardware sealing). That graceful fallback is not wired up in the current
build, which requires a working TPM. See
[Hardware security and the TPM](/docs/os/hardware-security/).
:::

## Disk

- A disk Sinty OS can partition with a **GPT layout**: a small EFI System
  Partition, the signed system slots, and an encrypted data area.
- The installer writes the whole layout, so the target disk is erased. Back up
  anything you care about first.

## Storage and memory

Sinty OS is a lean system, but it runs a full Wayland desktop. A machine with a
few GB of RAM and a modern SSD is comfortable. Precise minimums will be published
with the first release.
