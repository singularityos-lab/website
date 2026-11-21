---
title: Sinty Flash
description: The host tool that installs Sinty OS on phones and boards without erasing their firmware.
---

Phones and boards such as the Arduino UNO Q keep their boot chain, modem and
calibration data on the same storage as the operating system. Writing a whole
disk image over that storage erases the firmware and can leave the device unable
to start. `sinty-flash` reads the device's [profile](/docs/os/devices/#device-profiles)
and writes only the partitions the profile allows. Every other partition stays as
the device shipped it.

PCs and ARM boards that boot through UEFI do not need it: write the image to a
USB stick and follow [Installing Sinty OS](/docs/os/install/).

## Getting it

Download the archive for your computer from the
[releases](https://github.com/singularityos-lab/sinty-flash/releases)
(`x86_64` or `aarch64`), or build it:

```sh
git clone https://github.com/singularityos-lab/sinty-flash
cd sinty-flash
go build ./cmd/sinty-flash
```

The tool runs on Linux. It talks to devices over USB directly, so it does not
need `fastboot` or `adb` installed, and it writes USB sticks through UDisks,
so it does not need root.

## Commands

| Command | What it does |
|---|---|
| `sinty-flash devices` | lists the devices the catalog knows |
| `sinty-flash show <id>` | prints what a profile does to a device |
| `sinty-flash detect` | finds connected devices the catalog knows, in any of their USB modes |
| `sinty-flash stick [-y] <id> <image> <disk>` | writes the installer stick for a device |
| `sinty-flash flash [-y] <id> <image or release>` | flashes a device in fastboot mode |
| `sinty-flash data-image <id> <release> <out>` | builds the data image of a phone ahead of time |
| `sinty-flash edl-package <id> <release> <firmware> <out>` | builds the EDL flash package of a Qualcomm board |
| `sinty-flash version` | prints the version |

`<id>` is the profile id, such as `google/pixel-7-pro` or `arduino/uno-q`.
Images can be raw or compressed with `xz`. Without `-y` every command that
writes asks for confirmation first.

### Installer sticks

`stick` writes the image to a removable drive. It refuses any drive that is not
removable, and reads the drive back afterwards to check every byte.

### Fastboot devices

`flash` writes each partition the profile lists from the matching part of the
Sinty image, splitting large partitions into pieces that fit the device's
download limit.

For phones, the argument is a **release directory**: the signed release with its
manifest, root, hash tree and unified kernel image `kernelcache.efi`. The tool
then:

1. checks that the bootloader is unlocked, and offers to unlock it if the
   profile allows it (unlocking erases the phone and must be confirmed on its
   screen);
2. builds the Android boot images from the kernel, initramfs and device tree of
   the signed release, with the footers the bootloader expects;
3. builds the data image, unless the directory already has a `userdata.img`;
4. writes the boot images to the slot the profile names, writes the data image,
   makes that slot active and restarts the phone into Sinty OS.

### EDL packages

Qualcomm boards such as the Arduino UNO Q are written over EDL, the recovery
mode in the chip's boot ROM. `edl-package` builds a package from a signed
release and the board's own flash package (the directory with its
`gpt_main0.bin` and `gpt_backup0.bin`):

- the partitions the profile replaces become one Sinty data partition;
- every other entry of the board's partition table, slot attributes included,
  stays exactly as the board package ships it;
- the EFI and data partitions are sparse, so only the data they hold is sent.

The package works with any EDL tool that reads `rawprogram0.xml` and
`patch0.xml`, such as `qdl`.

Building data images and EDL packages needs `mkfs.f2fs`, `sload.f2fs`,
`fsck.f2fs`, `dump.erofs` and `atom-install`, found on `PATH` or named by
`SINTY_ATOM_INSTALL`. EDL packages also need `mkfs.fat` and `mcopy`.

## Devices without a screen to pair on

The [Sinty Debug Bridge](/docs/sdb/) is normally paired with a code shown on the
device's screen. A board with no display attached has nowhere to show it. For
those, `data-image` and `edl-package` accept `-trust-host <cert>`: the bridge is
turned on from the first boot and trusts the computer whose certificate is given,
normally `~/.config/sinty-sdb/host.crt`. Possession of the device and of the
cable that flashes it stands in for the pairing code.

`-trust-host` is in the source tree and comes with the next release of the tool.

## The catalog

The tool downloads the device catalog from
[sinty-devices](https://github.com/singularityos-lab/sinty-devices) when it
runs, checks every profile against the digest in the catalog index, and keeps a
copy for offline use. A new device therefore works as soon as its profile is
merged.

Each profile names the oldest version of the tool that handles it. An older tool
lists the device but refuses to flash it and asks to be updated.

To test a profile before it is merged, point the tool at another catalog:

```sh
SINTY_FLASH_CATALOG=/path/to/sinty-devices sinty-flash show vendor/model
```

## Going back

Every profile links the vendor's way back to the original system: the factory
image for phones, the vendor's flasher for boards. Because Sinty Flash never
touches the boot chain, modem or calibration partitions, the original system can
be restored with the vendor's own tools.
