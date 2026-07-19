---
title: Your PIN, password, and encryption
description: One PIN, no password, and how your data is encrypted.
---

Sinty OS deliberately has **one credential**: a PIN. There is no separate login
password. This page explains where that leaves the "password", and how your data
is actually protected.

## There is no password, on purpose

On a traditional Linux system you have a Unix password used for login, `sudo`, and
more. Sinty OS does not: your account is created with no password at all, and the
PIN takes its place for logging in. So if you are looking for "where the password
is", the answer is that there isn't one. The PIN is the single thing you set, and
the single thing you enter.

This is a security choice, not a shortcut. One credential means one thing to
protect and one thing to lose, and it lets that credential do double duty as your
encryption key rather than sitting beside a separate disk-encryption passphrase.

## How your data is encrypted

Your files are encrypted with **file-based encryption** (the same family of
technology Android uses), not a single whole-disk passphrase:

- Your **home and your data** are encrypted. The read-only system root is not
  encrypted; it does not need to be, because it is verified instead (see
  [Hardware security and the TPM](/docs/os/hardware-security/)).
- The encryption key is wrapped by **two things at once**: your PIN, and the
  machine's hardware security. Both are needed to unlock, which is why the same
  data will not simply decrypt on another machine even with the right PIN.

## What the PIN unlocks

The one PIN is used, never duplicated, for three things:

1. **Unlocking your files at login.** Entering your PIN releases the key that
   decrypts your home.
2. **Confirming destructive actions.** A wipe or a reinstall from
   [recovery](/docs/os/recovery/) asks for the PIN, so a thief or a stray click
   cannot erase or take over the machine.
3. **Unlocking protected settings.** The machine's locked-down state is gated by
   the same PIN.

## If you forget the PIN

Because the PIN is your decryption key, no one can reset it for you without
destroying your data. The only way back in is your **recovery code**, the one-time
string shown at [first boot](/docs/os/first-boot/). Keep it safe. Without both the
PIN and the recovery code, encrypted data is gone for good, which is the point:
your data is genuinely yours.
