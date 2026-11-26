---
title: Using your devices together
description: One pointer and keyboard across your Sinty devices, apps that move from one to another with their state, a desktop shown on a paired screen, and updates shared between devices.
---

Sinty devices next to each other can work as one: they share a pointer and a
keyboard, hand apps to each other, show one desktop on another screen and pass
updates around.

## One pointer, one keyboard

Place your other Sinty devices around your screens, and the pointer crosses onto
them when it reaches that edge, with the keyboard following it.

Open **Settings**, **Displays**. **Other Sinty Devices** lists the devices you
can use this way. Drag one next to a display in the picture, or choose **Place**
and pick a side. You can also push the pointer against a free edge of a screen:
the desktop asks **Put a Sinty Here?** and places the device there.

The other device has to allow it the first time; until then it shows **Waiting
for ... to allow it**. Once a device is placed, its row says whether it is
**Ready** or **Using this pointer and keyboard**. **Stop Using This Sinty Here**
removes it.

## Moving an app to another device

Drag a window to the edge where another Sinty device sits. A card tells you what
happens when you let go:

- **Let Go to Move ... to ...**: the app continues on the other device exactly as
  it is now, and closes here. The other device adapts it to its own shape, so an app
  moved from a computer to a phone uses the phone layout.
- **Let Go to Use ... on ...**: the app cannot be moved, so it keeps running here
  and is shown on the other device, where you can use it.
- **Let Go to Stop Showing ... Here**: you dragged back an app that was only shown
  here. It goes on running on the device it came from.
- **... Cannot Move to ...**: the app cannot continue on another device.

Apps built on libsingularity move with their state. The other device draws the
moved app and compares its picture with the original, ignoring video and
animations, to check that it arrived exactly as it was.

## Showing the desktop on a paired screen

A computer can show its desktop on a TV or a monitor and take keyboard and
pointer input from it, as a Sinty Core. Open **Settings**, **Connected Devices**,
**Screens**.

1. Start Sinty Screen on the TV or the monitor. It shows a six digit code.
2. Choose **Pair a Screen…** and type the **Code**.

The screen has to be on the same network, or plugged in with a cable. Without a
network the computer opens a Wi-Fi network of its own and tells you which one the
screen should join. Two devices already paired in Nearby skip the code.

- **Paired Screens** lists the screens with **Showing the desktop** or **Not
  connected**. **Remove** ends the pairing at once.
- **Used As** tells the desktop which kind of machine this is: **Laptop**,
  **Desktop**, **TV** or **Core without a screen**.
- **USB-C Port** makes this computer appear as a **Network Adapter** or a **Disk**
  to the computer it is plugged into.
- **Screen Key** is the key that identifies this computer to its screens. It is
  sealed in the security chip; without one it is kept in a file only the system
  can read.
- **Back Up Screens** saves the key and the paired screens in one encrypted file,
  with a recovery code to write down. **Restore from a Backup** brings every
  pairing back on a new or reset computer.

## Sharing updates

Turn on **Share Updates Nearby** in **Settings**, **Updates**. Your devices pass
downloaded updates to each other on home and work networks, so an update is
downloaded from the internet once. Every piece is checked against the signed
release before it is used.
