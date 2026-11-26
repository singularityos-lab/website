---
title: Games
description: Game Mode, the game overlay, MangoHud, tearing and the faster graphics card.
---

Sinty OS runs games from Steam, from Wine and from the Store. 32 bit apps work,
Wine and Proton use the kernel's NT synchronization driver, and the system makes
room for a game while it is in full screen.

The settings are in **Settings**, **Performance**, **Games**.

## Game Mode

Game Mode holds the performance power profile while you play, and uses Feral's
GameMode as well when it is installed.

- **Auto Game Mode** turns Game Mode on by itself when a game goes full screen,
  and off when it leaves full screen.
- **Game Mode Active** turns it on now, for as long as the switch stays on.

While a full-screen game runs, the panel and the dock step aside, and the apps
you are not looking at get less processor, disk and memory. See
[Pausing apps](/docs/os/pausing-apps/) for what happens to them.

## The game overlay

Press <kbd>Super</kbd>+<kbd>G</kbd> over a full-screen game. The overlay opens on
top of the game without taking it out of full screen, and shows:

- what is playing and for how long, the time and the battery;
- your latest notifications;
- quick switches for **Game Mode**, **Performance Overlay**, **Allow Tearing**,
  **Focus** and the power profile;
- **Screenshot**, which captures the whole screen.

Press <kbd>Esc</kbd> or <kbd>Super</kbd>+<kbd>G</kbd> again to go back to the
game.

## MangoHud

MangoHud ships with Sinty OS. Turn on **Auto MangoHud** and every game started
from the desktop opens with frame rate, frame time and processor and graphics
load in a corner. The **Performance Overlay** switch in the game overlay does the
same, from the next launch.

## Tearing

**Allow Tearing** lets a full-screen game that asks for it show each frame as
soon as it is ready, instead of waiting for the screen. Input lag is lower, and
you may see a horizontal tear when the camera moves fast.

Variable refresh rate is set per screen in **Settings**, **Displays**.

## The faster graphics card

On a computer with two graphics cards, games that ask for the discrete card start
on it by themselves. Any app can be started on it from its menu in the dock, with
**Open with Dedicated GPU**. **Settings**, **Performance** also offers **Dedicated
GPU Only**, which connects the screen to the dedicated card for the highest frame
rates at the cost of battery life.

## No interruptions

A [focus profile](/docs/profiles/) can turn itself on while a full-screen app or
game runs. Notifications then wait until you leave full screen.

## Wine, Proton and Steam

Steam is in the Store. Wine and Proton find the `ntsync` device of the kernel and
use it for their synchronization primitives, which lowers the processor time
spent in games that use many threads.
