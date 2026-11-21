---
title: Sinty OS on phones
description: How the desktop adapts to a phone, what the phone-specific parts of the system do, and what is still missing.
---

Sinty OS on a phone is the same system as on a PC: the same root, the same
updates and recovery, the same apps. There is no separate phone shell. The
desktop reads the form factor of the device and adapts the shell, the apps and
the input to it.

:::caution[Early]
Phone support is new and runs on one model, the
[Pixel 7 Pro](/docs/os/devices/pixel-7-pro/). The device page lists what works
on it today.
:::

## Form factor and scale

The form factor (desktop, tablet, phone, TV or watch) is derived from the size
of the built-in screen. Apps read it through libsingularity and adapt their
layout: an app with a list and a detail view shows one at a time on a phone, with
a back button, instead of both side by side.

When the display configuration does not fix a scale, the compositor picks one
from the panel: on screens under 7.5 inches one step per 160 dots per inch, in
quarters, up to 3. A Pixel 7 Pro (1440 x 3120 on 6.7 inches) runs at 3.

## The shell on a phone

- **Home and dock** take the full screen; apps open full screen.
- **The pill** at the bottom of the screen replaces the window controls: swipe
  up to go home, swipe up and hold for the open apps, swipe sideways along it to
  move to the previous or next app.
- **The sidebar** opens as a shade pulled down from the top edge. It closes by
  pulling up the handle at its bottom edge, or with a quick flick upwards.
- **The power button** turns the screen off and locks the phone. On a desktop
  the same button asks what to do. **Settings, Power** changes it.

## Touch input

- **Press and hold** opens the context menu of whatever is under the finger,
  in Singularity apps and in any GTK 4 app. Keep the finger down and slide to an
  item to choose it, or lift to leave the menu open. See the
  [SIT post](/news/sit-a-month-later/) for how this works.
- **The screen keyboard** appears when a text field takes focus, in apps and in
  web pages. It vibrates on every key; **Settings, Keyboard, Vibrate on Key
  Press** turns that off.

## Phone hardware

| Part | How Sinty OS handles it |
|---|---|
| Firmware | Wi-Fi, Bluetooth, audio and haptics firmware is copied from the Android vendor partition already on the phone, on the phone itself, and nothing is redistributed. It is copied again only when that partition changes. |
| Boot partitions | Android phones load the kernel from boot partitions instead of a filesystem. Each update rebuilds those boot images from the kernel it carries, and every boot puts back the running release's kernel if a failed update left another one there. |
| Charging | The charger and battery gauge are driven by mainline drivers with conservative limits. |
| Mobile network | The modem is driven by `sinty-modemd`, which presents itself on the system bus as ModemManager. Calls, SMS and mobile data are in development. |
| Debug access | With the [debug bridge](/docs/sdb/) on, the USB cable becomes a private network link between the phone and the computer. |

## Debug bridge over USB

When the Sinty Debug Bridge is on and the phone is connected by cable, the phone
takes the address `172.16.42.1` on the cable and gives the computer
`172.16.42.2`. The link has no route and no name server, so the computer never
sends its own traffic through the phone. Pair it with:

```sh
sdb pair 172.16.42.1
```

and confirm the code shown on the phone.

## Installing

Phones are installed with [Sinty Flash](/docs/os/sinty-flash/), which keeps
the bootloader, modem and calibration partitions as they shipped. See the page
of your device for the steps.
