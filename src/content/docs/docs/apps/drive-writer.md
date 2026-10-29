---
title: Drive Writer
description: Write disk images to USB drives and memory cards.
---

Drive Writer writes disk images, such as a Sinty OS installer, to USB drives and
memory cards.

- Open an ISO or a disk image, also compressed with gzip, xz or Zstandard.
- Check the image against its checksum, typed in or read from a `SHA256SUMS`,
  `CHECKSUM` or `.sha256` file.
- Write several drives at the same time or one after the other.
- Check the drive after writing, so you know the copy is complete.
- **Erase and Restore** turns a drive that holds an image back into a normal
  drive.

Everything on the chosen drive is erased, and Drive Writer asks before it starts.
