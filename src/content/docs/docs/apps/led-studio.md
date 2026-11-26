---
title: LED Studio
description: Draw, animate and test scenes for LED matrices, such as the one on the Arduino UNO Q.
---

LED Studio makes the scenes a small LED matrix shows, such as the 13 × 8 matrix
of the [Arduino UNO Q](/docs/os/devices/arduino-uno-q/). It works on any computer:
the scene plays on a matrix drawn on screen, and on the real one when there is
one.

## Scenes and layers

A scene is a stack of layers. Add them from **Insert**:

- **Text** scrolls or stays still. Set the **Speed**, the **Letter Spacing** and
  what happens **When Too Long**.
- **Drawing** is drawn pixel by pixel with **Draw** and **Eraser**, with as many
  frames as you like. Every frame has its own **Frame Duration**, and **Duplicate
  Frame** starts the next one from the current.
- **Bar** fills with a live value.

Each layer has a **Position**, a **Pixel Brightness** and a **Show Only When**
condition, so a layer can appear only while music is playing or a notification
is waiting.

## Live values

Layers can show what the desktop provides: the time and date, the battery,
the system load, what is playing and your notifications. **Test Data** sets these
values by hand, to see how a scene behaves before using it.

## Trying it and using it

- **Preview on Matrix** plays the scene on the real matrix while you edit it.
  Stopping the preview gives the matrix back its own scene.
- **Use on Matrix** makes the scene what the matrix shows. It can also be picked
  later in **Settings**, **Displays**.
- **Templates** start a scene from a ready one, such as the clock.
- **Export** and **Import Scene** move scenes between computers as files.
