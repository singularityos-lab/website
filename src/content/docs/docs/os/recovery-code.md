---
title: The recovery code
description: The one-time code you are given at setup, and what it is for.
---

At [first boot](/docs/os/first-boot/) Sinty OS shows you a **recovery code**: a
one-time string, unique to your installation. It is the single most important thing
to save from setup, and this page explains why.

## What it is

The recovery code is a backup key to your encrypted data. Your files are normally
unlocked by your [PIN](/docs/os/pin-and-encryption/), but the PIN is not the only
thing that can release the key: the recovery code can too. It exists so that
forgetting your PIN does not automatically mean losing everything.

It is generated on the device during setup, shown to you once, and not stored
anywhere you can retrieve it afterward. That is deliberate: if it were kept on the
machine, it would not be a safe backup.

## What it is for

- **You forgot your PIN.** With the recovery code you can get back into your data
  and set a new PIN.
- **You are recovering the machine.** [Recovery mode](/docs/os/recovery/) can use
  it to confirm you are the owner before doing anything destructive.

## How to keep it

:::danger[Treat it like the key it is]
- **Save it offline** at setup: on paper, or in a password manager on a different
  device. It is shown once.
- **Keep it private.** Anyone with the recovery code can unlock or take over the
  machine, exactly like the PIN.
- **Do not store it only on the machine it protects.** If that machine is the one
  that breaks, the code has to be somewhere else.
:::

## If you lose both

If you lose your PIN and your recovery code, encrypted data cannot be recovered by
anyone, including us. There is no master key and no back door. You can still
reinstall a fresh Sinty OS from [recovery](/docs/os/recovery/), but the old
encrypted data stays locked forever. This is the trade for data that is truly only
yours.
