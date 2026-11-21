---
title: Screens and form factors
description: How Singularity adapts to a desktop, a tablet, a phone or a TV, and how to choose what each connected screen behaves as.
---

Singularity is one shell that changes shape with the screen it runs on. The same
session can be a desktop on a monitor, a tablet, a phone, or a TV interface driven
by a remote, and each screen connected to the computer can behave in its own way.

## The form factors

| Form factor | What changes |
|---|---|
| **Desktop** | Top bar, dock, windows you move and resize, the global menu. |
| **Tablet** | Apps full screen, a home with the dock, a swipe up to go home, the top bar pulled down with a finger, and a divider to put two apps side by side. |
| **Phone** | A paged home screen, the home pill, the notification shade and a stacked layout. See [Sinty OS on phones](/docs/os/mobile/). |
| **TV** | A home built for a remote and a sofa, apps full screen, focus you move with the arrow keys. See [Singularity on a TV](/docs/tv/). |

Apps follow the screen they are on: a window moved from the monitor to the TV
takes the TV layout as soon as it arrives.

## Automatic choice

By default every screen is **Automatic**. Singularity measures the diagonal of
the screen:

- below 7.5 inches it behaves as a **phone**;
- the built-in screen of a laptop or a computer is a **desktop**;
- another screen below 13.5 inches is a **tablet**;
- an HDMI screen of 32 inches or more is a **TV**;
- everything else is a **desktop**.

When a Sinty Core says which kind of machine it is, Laptop, Desktop or TV in
**Settings, Sinty Core**, that choice wins over the measurement.

## Choosing for each screen

When you connect a screen, Singularity asks how it should behave and shows its
suggestion. Pick another one, or close the card to keep the suggestion.

You can change it later in **Settings, Displays**: select the screen and set
**Behaves As**. A laptop with a TV attached can show the desktop on its own panel
and the TV interface on the TV at the same time.

## A phone next to a bigger screen

When a phone drives a TV or a monitor, its own screen offers to become a
companion:

- **Use as Remote** shows arrow keys, OK, Back and Home for the big screen;
- **Use as Touchpad** moves the pointer with one finger, taps to click and holds
  for more options, with buttons for left and right click and for scrolling.

## Trying other form factors

Developers can switch the running shell, or open a nested preview of any form
factor at its real size, from **Developer Options, Form Factor**. See
[Adaptive apps](/docs/adaptive-apps/) to make an app ready for every screen.
