---
title: Locking and unlocking
description: The lock screen, quick PIN and pattern unlock, Lockdown, security keys and fingerprints, and unlocking on a phone.
---

The lock screen covers the session when you lock it, when the computer has been
idle for the time set in **Settings, Power, Lock the Screen**, and when it wakes
from sleep. Notifications and the media controls stay visible on it; everything
else waits behind the PIN.

## Your PIN

On Sinty OS the lock screen asks for the same PIN you sign in with. The PIN is
checked by the TPM, which counts wrong tries: after too many the lock screen
tells you how long to wait before the next try. On devices without a TPM the
lock screen asks for your passphrase instead. See
[PIN, password and encryption](/docs/os/pin-and-encryption/).

## Quick unlock

A quick PIN or a pattern opens the lock screen faster, once you have signed in
with your full PIN. Set it up in **Settings, Users**, on your account, under
**Quick Unlock**:

- **Quick PIN**: four to twelve digits.
- **Pattern**: connect at least four dots on a three by three grid.

The full PIN is needed again:

- after a restart;
- after five wrong tries of the quick PIN or the pattern;
- after **Lockdown**.

The lock screen shows **Use PIN** under the pattern pad when you want to type the
full PIN anyway. **Turn Off** on the same page goes back to the full PIN only.

## Lockdown

With quick unlock on, the session menu in the sidebar has **Lockdown** next to
**Lock**. It locks the screen and switches quick unlock off until you type the
full PIN. Use it when you leave the computer somewhere you do not trust, or when
someone may have seen your pattern.

## Security keys

You can ask for a FIDO2 security key together with the PIN. Add the key in
**Settings, Users**, on your account, under **Security Keys**. The lock screen
then asks you to touch the key after the PIN. A Sinty Key can carry its own
security key in the same way.

## Fingerprints

With a supported reader, enroll a finger in **Settings, Users**. The lock screen
accepts the finger while it shows the PIN field.

## On a phone

On a phone the lock screen is a full screen clock:

- **swipe up** from anywhere to reach the keypad, and the screen follows the
  finger;
- type the PIN on the touch keypad, which vibrates on every press;
- **swipe down** on the keypad to cover it again.

The quick PIN and the pattern work the same as on a computer. The power button
turns the screen off and locks the phone.
