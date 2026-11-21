---
title: Sinty Key
description: Carry your files on an encrypted USB drive, open them on any Sinty OS computer, move your home onto it, start computers from it, and rescue a computer that does not start.
---

A Sinty Key is a USB drive that keeps your files encrypted and opens them with
your PIN on any Sinty OS computer. Manage it in **Settings, Sinty Key**.

There are two kinds of Key:

- **Key for Your Files**: your files encrypted with a PIN, opened on any Sinty OS
  computer.
- **Startup Key**: Sinty OS copied to the drive, so any computer that boots from
  USB starts it.

Making either kind erases the drive. Only removable drives can become a Key.

## Making a Key for your files

1. Insert the drive, choose **Make a Key…** and **Key for Your Files**.
2. Choose a PIN of at least four characters and repeat it.
3. Write down the **recovery code** and keep it apart from the Key. It is the only
   way back in if you forget the PIN or lose the Key.

Files you put in the **Data** folder of the Key are encrypted.

## Opening a Key

When you insert a Key, Sinty OS announces it. Choose **Open…** and type its PIN.

- On a computer you have marked with **Remember This Computer**, the Key is also
  sealed to that computer's security chip. The chip blocks guessing the PIN and
  refuses older copies of the Key, and the PIN alone opens it there.
- On any other computer the PIN is the only protection.

**Remembered Computers** lists those computers; **Forget** removes one.

When the Key is removed, its data is locked again. If your session runs from the
Key, removing it locks the session.

## Your home on the Key

**Move Your Home to the Key** copies your files and settings to the Key, so you
can take them to any Sinty OS computer. **Bring Your Home from the Key** copies
them back into your account on a computer.

The files are encrypted again with the keys of the side they land on. Every file
is checked before the original can be deleted:

- **Keep Both** leaves a copy on each side;
- **Delete Now** checks the files once more and deletes the original.

A copy that was interrupted continues where it stopped.

## Sessions from a Key

A Key whose owner has no account on a computer can still open its own session
there, from the login screen. Its files stay on the Key, and nothing is left on
the computer when it is removed.

- **Open as a guest** keeps nothing on the computer.
- **Open, this computer is remembered** uses the computer's security chip as
  well.

A computer decides whether it allows this with **Open Sessions From Other Keys**.

## Security keys

A Key can also require a FIDO2 security key with `hmac-secret`. It then opens
only when one of its security keys is plugged in and touched, together with the
PIN. Use **Add Spare** to register a second one and keep it apart. The recovery
code still opens the Key without them.

## Backup and restore

**Back Up…** saves the Key as one encrypted file that opens only with the
recovery code. Keep it on another drive or online.

**Restore a Key** writes a backup onto a new drive. That drive becomes a new Key,
with a new PIN and a new recovery code.

## Forgotten PIN

Choose **Forgot the PIN?**, enter the recovery code and choose a new PIN. If the
security keys are lost too, **Set PIN and Remove Security Keys** puts the Key
back to PIN and computer only.

## Startup Keys

Choose **Make a Key…**, then **Startup Key**:

- **Computer** copies the Sinty OS of this computer.
- **Intel and AMD Computers** and **ARM Computers** download Sinty OS for that
  kind of computer first.

When a Startup Key and the computer run different versions, Settings offers
**Update Key** or **Update This Computer**, whichever is older. The update takes
effect the next time the Key or the computer starts.

## Rescuing a computer

When a computer does not start, start it from a Startup Key and choose **Rescue This
Computer**. From there you can:

- open an account with its PIN or recovery code and **Copy Files** to the
  Rescued folder in your home;
- read the **Logs** of that computer;
- **Repair Startup**, which puts back its boot files;
- **Reinstall Sinty OS** from the copy on your Key, keeping the files of every
  account.

## Trusted devices

**Trusted Devices** lists the Keys, screens and phones this computer trusts.
**Revoke** removes one. A revoked Key opens here only with its recovery code.
