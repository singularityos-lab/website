---
title: Installing Sinty OS
description: Putting Sinty OS on a machine.
---

Sinty OS is installed from a bootable image onto a machine that meets the
[requirements](/docs/os/requirements/). The installer lays down the full system:
the signed boot loader, the verified system slots, and an encrypted data area.

:::danger[The target disk is erased]
Installing Sinty OS writes a fresh partition layout to the target disk. Everything
on that disk is lost. Back up anything you care about, and prefer a spare machine
or a virtual machine while Sinty OS is pre-release.
:::

## What you need

- A machine that meets the [requirements](/docs/os/requirements/): UEFI with Secure
  Boot, an x86-64-v2 CPU, and a TPM 2.0.
- The Sinty OS installer image, written to a USB stick (or attached to a virtual
  machine).

## The install, step by step

1. **Boot the installer.** Start the machine from the Sinty OS installer media.
   You may need to pick it from the firmware boot menu.
2. **Choose the disk.** The installer shows the disks it can use and asks which one
   to install onto. This disk will be erased.
3. **Let it write the system.** The installer creates the GPT layout (EFI
   partition, the signed system slots, the encrypted data area), copies the signed
   image into the active slot, and installs the boot loader that verifies each boot.
4. **Reboot into Sinty OS.** When it finishes, remove the installer media and
   reboot. The first boot walks you through setup.

The very first boot is where you set your PIN and are shown your recovery code.
That is covered in [First boot and your PIN](/docs/os/first-boot/).

## After installation

- The system boots through a signed loader that checks the image before running
  it, so a tampered or corrupted system will not silently start.
- Updates arrive as whole signed images and roll back on failure. See
  [Updates and rollback](/docs/os/updates/).
- If the machine ever ends up unable to boot, [Recovery mode](/docs/os/recovery/)
  can repair or reinstall it over wifi.
