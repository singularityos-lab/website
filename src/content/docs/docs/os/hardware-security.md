---
title: Hardware security and the TPM
description: What the TPM does in Sinty OS, and why your data is bound to the machine.
---

Sinty OS ties your encryption to the specific machine using a **TPM** (Trusted
Platform Module), the small security chip in modern PCs. This is what makes your
data bound to the device: even with the right [PIN](/docs/os/pin-and-encryption/),
the same disk will not simply decrypt in another computer.

## What the TPM does

Your encryption key is not stored on disk in a form anyone can read. It is
**sealed** by the TPM: the chip releases the key only on the machine it belongs
to, and only when the system booting is a genuine, signed Sinty OS. Combined with
your PIN, that means two independent things are required to unlock your data:
something you know (the PIN) and something the machine holds (the sealed key).

This is also what makes the "wipe" in [recovery](/docs/os/recovery/) instant:
destroying the sealed key makes all the encrypted data unreadable at once, with no
need to overwrite the disk.

## Tiers of protection

Not all TPMs are equal, and Sinty OS uses the best your machine offers:

- **Firmware TPM in the CPU (best).** AMD Pluton (Ryzen 6000 and newer), recent
  Intel, and Qualcomm build the TPM into the processor. Because the key never
  travels across an external chip's wires, this resists physical bus-sniffing
  attacks. It is the PC equivalent of a phone's secure enclave.
- **Discrete TPM 2.0.** A separate TPM chip on the motherboard. Fully supported.
- **No TPM (planned).** A machine with no TPM is meant to fall back to protecting
  your key with the PIN alone (a strong password hash), without hardware sealing.
  This graceful fallback is designed but not yet wired up; the current build
  requires a working TPM.

## Updates do not lock you out

A common failure of hardware sealing is that any system update changes the
machine's measurements and the key refuses to unseal, locking you out of your own
data. Sinty OS avoids this: the key is sealed to a stable root of trust (the signed
boot chain), not to the exact bytes of one system version, and the system re-seals
the key when it needs to. Any signed Sinty OS image can unlock your data, so an
update or a reinstall does not lose it.

## What you need to do

Nothing, on supported hardware. If your machine meets the
[requirements](/docs/os/requirements/), the TPM is used automatically during
[first boot](/docs/os/first-boot/). You only ever interact with your PIN and, if
you need it, your [recovery code](/docs/os/recovery-code/).
