---
title: SIT and Liquid Glass
description: SIT, the GTK 4 fork Singularity apps run on, what it adds, and how Liquid Glass is drawn.
---

Singularity apps run on **SIT**, a fork of GTK 4. It ships as `libgtk-4.so.1`,
with the same library name and binary interface as GTK, so any GTK 4 app runs on
it unchanged. A check on every change fails if an exported symbol differs from
upstream.

![Where SIT sits between apps, the renderer and the compositor](/blog/sit-stack.svg)

## What SIT adds

The additions sit behind their own header and pkg-config name, `sit-1.0`, so an
app uses them only on purpose:

- **Transform, opacity and clip on any widget**, applied at draw time without
  touching layout. Slides, scaling on press and fades work the same in every app.
- **A real window border**, drawn by the toolkit at the right radius and scale.
- **Frame statistics**: how long each frame took to lay out, render and present.
- **Glass**: a widget and a drawing call that refract and blur what is behind
  them.
- **The web view**: the widget that shows web pages, drawn by
  [Fotone](/docs/os/web-engine/).

To use them, link `sit-1.0` next to `gtk4` and include `sit.h`. Where SIT is not
installed the app does not link, so you always know which toolkit you have.

## Liquid Glass

![The dock as liquid glass over the wallpaper](/blog/liquid-glass-dock.png)

Glass is drawn live, every frame, from what really sits behind it, and it bends
near the edges like a thick piece of glass. It is drawn in two places.

**In the compositor**, for the dock, the top bar, menus and notifications. These
surfaces ask for glass through the compositor's blur protocol, with the region
and corner radius. The compositor reads what is behind, blurs it and lifts the
saturation, shifts pixels inward near the curved edge, adds a faint tint and a
highlight on the rim, and then the app draws on top. The bend is zero in the
middle and grows quickly at the rim, following the real outline of the surface.

![The layers of a glass surface](/blog/liquid-glass-layers.svg)

![Light passing through a glass pill, and how far each pixel is pulled](/blog/liquid-glass-lens.svg)

**Inside a window**, for switches, segmented controls and selection pills while
they move. SIT renders what is beneath the widget and draws it back through a
displacement map that says which way and how far each point bends. At rest the
controls go back to a solid colour.

![A switch and a segmented control in motion, from left to right](/blog/liquid-glass-lens-motion.png)

Glass is only for things that float. Text, lists and documents always stay on
solid backgrounds.

![A sidebar over the desktop, glass on the left and solid on the right](/blog/liquid-glass-window.png)

### Without a GPU

On a machine without hardware acceleration, glass becomes a plain translucent
fill with the same shape and border. The layout does not change.

![The same controls with GPU glass on the left and the fallback on the right](/blog/liquid-glass-fallback.png)
