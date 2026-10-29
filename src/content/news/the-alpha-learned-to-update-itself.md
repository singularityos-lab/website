---
title: The Alpha learned to update itself
date: 2026-08-09T12:00:00Z
description: The first Alpha could boot, now it has a signed update feed, a recovery path that can put it back together, firmware that travels on its own, and a way onto machines without a TPM, with an honest security cost.
draft: false
---

The first public Alpha could boot, which was enough to make it public, but it could not yet do the one thing an image-based operating system eventually has to do without excuses: replace itself without becoming a different machine halfway through.

![The Sinty OS Event Horizon 26 welcome screen](/sinty-os-event-horizon-26-welcome.webp)

Now it can: there is a real signed update feed, the update timer is part of the system, the installer and OTA path run against an installed disk in QEMU, recovery can fetch a clean signed deployment over Wi-Fi, and firmware bundles can move separately from the root image.

There is also one correction I need to make: despite what the Alpha article says, TPM 2.0 is no longer mandatory, so machines without one can now install Sinty OS, although they enter a weaker security tier which the installer clearly identifies, and I will get to that without pretending the trade-off disappeared.

## The year is the version

Sinty OS now follows the year it is released in, so the main version for 2026 is `26` and the full name of this release is **Sinty OS Event Horizon 26**. In 2027 the system becomes `27`, delivered through the same updater as any other system image, with no reinstall and no separate upgrade ritual waiting at the end of the year.

Intermediate releases may use versions such as `26.1`, `26.2` and `26.3`, but they are not traditional point releases kept as separate generations with their own maintenance lives. Sinty OS follows a semi-rolling model: the current yearly release keeps receiving continuous system images, while the next yearly version gives that moving system a new major number.

Identifiers such as `26A013` name one exact build inside version 26, and are useful when reporting a bug or checking which image booted, but they do not replace the simpler version people see in the interface.

## An update is still a boot

Instead of updating the root filesystem while you are using it, the updater checks the signed release feed, downloads a complete root image and its hash tree, downloads the matching kernelcache, verifies the artifacts, and stages them beside the deployment that is already running.

Nothing active gets patched in place: the next boot selects the pending deployment, sends it through the normal verified boot path and promotes it to stable only after a successful boot, otherwise Atom Loops returns to the previous complete deployment.

That was the design described in the Alpha post, but the difference now is that the pieces are connected: the system ships the update timer, the stable feed at `updates.sinty.dev` has carried signed releases through build `26A013`, and update status is exposed in the default dock instead of living somewhere only a terminal can find.

The disk layout became simpler at the same time: an installed machine has an EFI System Partition and one data partition, while root deployments are files inside that storage, so active, pending and rollback images consume the space they need instead of reserving fixed A/B partitions forever.

## The server is not the trust

Putting a JSON file on a website would be an update feed, but not one I would let replace the operating system.

Each Sinty release manifest is signed by an operational key whose certificate is signed by the release root, and the updater verifies that chain before checking the hashes declared for the root image, hash tree, kernelcache and firmware bundles. Artifact downloads pass through a restricted streaming proxy, but the proxy is only transport, so a compromised host cannot turn an unsigned image into a Sinty OS release.

The full path now has a QEMU test which boots an installed disk image and exercises OTA against that layout, which proves that the installer, on-disk state, updater and boot selection can speak the same language, but not that every firmware implementation and storage controller on real hardware will behave, so I am keeping the usual Alpha warning attached to it.

## Recovery can put the machine back together

Recovery is a small, independently signed system rather than a tool copied into the root it may need to repair, so it can bring up Wi-Fi without NetworkManager or the desktop, verify the same release chain, download a clean deployment and stage it, or return to the last known good deployment already on disk when the network is unavailable.

Both the graphical interface and the text fallback drive the same recovery core, and the bootloader unlock flow also lives there now: it requires authorization before reboot, confirmation inside recovery and a data wipe before verified boot can be disabled. Root access is meant to be deliberate, visible and destructive to existing secrets, not a password prompt any application can borrow.

Recovery is still an Alpha component, and although I trust its architecture, the number of machines it has met so far is a different measurement.

## Firmware can move without the whole OS

GPU firmware no longer needs to wait for a complete root release, since the update manifest can name separate AMD and NVIDIA bundles, each packed as its own EROFS image with a `dm-verity` hash tree and release metadata.

The initramfs verifies each bundle before mounting it over the firmware included in the root, so a bad root stops the boot while a missing or damaged optional firmware bundle is ignored, and the machine falls back to the verified base instead of becoming a very secure black screen.

The split is not finished: AMD firmware still ships in the base image, and the published NVIDIA path covers the firmware side while the complete proprietary driver bundle still needs hardware certification against the exact kernel it ships with. The target remains a small survival set in the root with dedicated GPU support delivered independently, but I am not calling that done early.

## TPM is no longer the gate

The Alpha article has a section titled "Why is TPM 2.0 mandatory?", but the short answer today is that it is not.

With a TPM, Sinty OS still uses the model I designed for it: a short PIN authorizes the TPM to release the user's encryption key, the key is bound to that machine and repeated wrong attempts are throttled in hardware, so copying the disk does not give an attacker a password verifier they can try forever on another computer.

Without a TPM, the installer asks for a passphrase of at least 12 characters instead of a PIN, and the user's random encryption key is wrapped using a key derived with Argon2id and authenticated with XChaCha20-Poly1305. The home directory remains encrypted through `fscrypt`, login still unwraps the key through `pam_sinty`, and there is still no reusable Unix password hash in `/etc/shadow`.

But the wrapped key now lives on the disk it protects, so an attacker who copies that disk can attempt passphrases offline, without a hardware rate limit or a machine-bound secret standing beside the passphrase.

I do not like that trade-off, but it is still better than refusing to run on every otherwise capable machine that lacks a TPM, as long as the weaker mode is named correctly. Sinty calls it the software L1 tier, where TPM remains the expected and recommended configuration while L1 is a compatibility path with a longer secret and fewer guarantees.

## What is still not done

The update chain works, but broad hardware validation does not exist yet, recovery needs more destructive testing on machines I can afford to wipe, the firmware split still carries AMD in the base, full NVIDIA driver delivery is not ready for a promise, and the no-TPM tier deliberately accepts an offline attack surface that the TPM path avoids.

That is where the Alpha stands now: it can install onto its real layout, discover a signed release, stage it, boot it and keep a way back, whereas two weeks ago most of that was an architecture with sharp edges between its parts, and today it is one path I can test, break and improve as a whole.

The desktop had its own two weeks outside my machines. That story is in [The Alpha left my desk](/news/the-alpha-left-my-desk/).

The current nightly image is available here:

https://github.com/singularityos-lab/os/releases/tag/nightly

Use a spare machine, keep a backup and assume Alpha still means Alpha.
