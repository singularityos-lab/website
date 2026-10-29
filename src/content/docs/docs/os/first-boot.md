---
title: First boot and your PIN
description: The first-time setup, your PIN, and the recovery code you must save.
---

The first time Sinty OS starts after installation, it runs a short setup. This is
where your account and your encryption are created, so a couple of the choices
here matter more than a usual first-run wizard.

## Setting your PIN

Sinty OS does not use a traditional login password. You set a **PIN**, and that
single PIN is what unlocks the machine. It does three jobs, all from the one code:

- it decrypts your files when you log in,
- it confirms destructive actions (like a wipe or reinstall from recovery),
- it is the key to unlocking the machine's protected settings.

Choose a PIN you will remember. Because it is also your decryption key, there is
no separate "reset password" that a support person can do for you: if the PIN is
lost, only your recovery code can get you back in. See
[Your PIN, password, and encryption](/docs/os/pin-and-encryption/).

## Your recovery code

During first boot Sinty OS generates and shows you a **recovery code**: a one-time
string, unique to this installation, that can recover your data if you ever forget
your PIN.

:::danger[Write it down and keep it safe]
The recovery code is shown once, at setup. Copy it somewhere safe and offline (on
paper, or in a password manager on another device). It is not stored anywhere you
can look it up later. Without your PIN and without this code, encrypted data
cannot be recovered.
:::

Keep the recovery code as private as the PIN itself: anyone who has it can recover
the machine. What it is and how to use it is covered in
[The recovery code](/docs/os/recovery-code/).

## Logging in

After setup, Sinty OS presents its greeter. Enter your PIN to unlock and sign in.
From then on, your PIN is all you need to start a session.
