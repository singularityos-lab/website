---
title: Rooting Sinty OS
description: Why Sinty OS has no root by default, what "rooting" would mean here, and why it is strongly discouraged.
---

:::danger[Rooting is strongly discouraged and voids support stability]
Sinty OS is designed to run as a sealed, verified system. Rooting it, gaining
full root and stepping outside that verified system, breaks the guarantees the OS
is built on. A rooted system is no longer one whose behavior we can stand behind:
updates, rollback, and the security model may not work as intended, and the
stability of support no longer applies. Do not do this unless you fully understand
and accept that you are on your own.
:::

## Why there is no root by default

On most systems you become root with `sudo` or a root password whenever you want.
Sinty OS deliberately does not work that way. The point of the system is that what
runs is exactly what was built and signed, and that nothing can quietly change it.

- **The system is read-only and verified.** The base is mounted read-only and
  checked by dm-verity, so it cannot be modified underneath you. There is nothing
  to "edit as root" in the normal sense.
- **There is no always-on root and no root login.** You do not log in as root, and
  there is no `sudo` or `pkexec` waiting to hand out privilege.
- **Privileged actions are mediated.** When something legitimately needs a
  privileged operation, it goes through a broker that asks for your explicit
  approval, rather than through a blanket root shell. See
  [ush](/docs/ush/) for how applications get what they need without root.

This is a feature, not a limitation. It is what lets the system promise that it is
running exactly what was signed, and roll back safely when an update goes wrong.

## What "rooting" means on Sinty OS

Because there is no supported way to simply "become root", rooting means
deliberately stepping **outside** the verified system: putting the device into an
unverified, developer state so you can run a root shell and change things the
sealed system would otherwise refuse.

That is a different machine from the one Sinty ships. Once you do it:

- **The verification guarantee is gone.** You can no longer trust that the system
  is exactly what was built and signed, which is the whole point of the design.
- **Updates and rollback may not behave.** The atomic update and automatic
  rollback rely on the system being sealed and verified; a modified system can
  break those paths.
- **The security model is weakened.** The brokered, no-blanket-root design is
  there to contain mistakes and attacks. A root shell removes that containment.
- **Support stability no longer applies.** Support assumes a stock, verified
  Sinty OS. A rooted device is outside that assumption.

## How to unlock the device

Rooting is a deliberate, physically present act, closer to unlocking an Android
bootloader than to typing a password. The exact keys and prompts depend on your
device, but the flow is:

1. **Arm the unlock in settings.** In the system settings, under the developer or
   advanced section, turn on "Allow bootloader unlock". This asks for your PIN,
   so a locked device that is lost or stolen cannot be unlocked without you.
2. **Reboot into recovery.** Choose "Reboot into recovery" from settings, or hold
   the device's recovery key combination as it powers on.
3. **Choose to unlock.** Recovery shows a screen explaining exactly what unlocking
   does, verification off, a full wipe, the effect on support. Select "Unlock
   bootloader".
4. **Confirm deliberately.** A second screen requires an explicit, non-accidental
   action, such as holding a button for a few seconds or typing `UNLOCK`, so it
   cannot happen with a single stray tap.
5. **The device wipes and unlocks.** On confirmation the device erases all your
   data, flips a hardware-anchored lock bit to "unlocked", and disables dm-verity
   enforcement. The wipe is immediate, done by discarding the encryption keys.
6. **Reboot unlocked.** The device restarts and, from now on, shows a persistent
   notice at every boot that it is unlocked. It is now root-capable: the read-only
   system can be remounted read-write and a root shell is available. Updates still
   work; being unlocked does not cut you off from them.

After that you have a modifiable system with root, and you own the consequences:
the verification and immutability guarantees are gone, your data was wiped, and the
device is no longer in the sealed state Sinty ships and supports.

## Reach for the supported paths first

For almost everything people reach for root to do, there is a supported way that
does not require it: install and run software through [ush](/docs/ush/), develop
with containers through [dsh](/docs/dsh/), and let the
[broker](/docs/ush/#the-permission-broker) grant privileged actions one at a time.
Reach for those first.
