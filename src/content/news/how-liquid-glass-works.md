---
title: How Liquid Glass works
date: 2026-10-26
description: "The dock, menus and notifications in Singularity are made of glass that bends what is behind it. Here is what actually happens, from the compositor down to a single toggle inside a window."
---

People ask me whether the glass is a blurred screenshot. It isn't. It is drawn live, every frame, from whatever really sits behind the surface, and it bends near the edges the way a thick piece of glass does. There are two places where this happens, and they work differently.

![The dock as liquid glass over the wallpaper](/blog/liquid-glass-dock.png)

### In the compositor

The dock, the top bar, menus and notifications are separate surfaces, and only the compositor knows what is underneath them. So that is where their glass is drawn. Our labwc build has a liquid glass shader, and surfaces ask for it through our blur protocol: they say which region should be glass and with what corner radius, and the compositor does the rest.

Each glass surface is built in layers, bottom to top:

![The layers of a glass surface](/blog/liquid-glass-layers.svg)

1. The compositor reads what is behind the surface: wallpaper, windows, anything.
2. It blurs it and pushes the saturation up a little, so colours stay alive instead of turning grey.
3. Near the curved edge it shifts pixels inward. This is the part that makes it look like glass and not frosted plastic.
4. It adds a faint tint and a highlight along the rim, as if light were catching the edge.
5. Then the app draws its own content on top.

The refraction is the interesting bit. A real glass pill is flat in the middle and curved at the rim, so light passes straight through the centre and bends near the edge. The shader does the same: for each pixel it works out how far it is from the edge of the rounded shape and pulls the backdrop toward the centre by an amount that is zero in the middle and grows quickly at the rim.

![Light passing through a glass pill, and how far each pixel is pulled](/blog/liquid-glass-lens.svg)

Because the shape is known exactly, corner radius included, the bend follows the real outline of the dock or the menu, not a rectangle.

### Inside a window

Inside an app, the toolkit already knows what is behind a widget, so glass there is drawn by [SIT](/news/why-sit) instead of the compositor. A widget asks for glass and SIT renders the content beneath it, then draws it back through a displacement map: a small texture that says, for each point, which way and how far to bend. Switches, segmented controls and selection pills use it while they move, so the thumb looks like a drop of glass sliding over the content.

![A switch and a segmented control in motion, from left to right](/blog/liquid-glass-lens-motion.png)

The pills only become glass while they are moving or pressed. At rest they settle back to a solid colour, so a static screen is calm and readable.

### Without a GPU

Glass costs GPU time. On a machine without hardware acceleration, or with software rendering, SIT switches to a plain translucent fill with the same shape and border. The layout does not change and nothing pops; it just stops refracting.

![The same controls with GPU glass on the left and the fallback on the right](/blog/liquid-glass-fallback.png)

The same rule applies to windows: a translucent window sidebar reads the desktop behind it when it can, and turns into a solid surface when it can't.

![A sidebar over the desktop, glass on the left and solid on the right](/blog/liquid-glass-window.png)

### Where it is not used

Glass is for things that float: the dock, menus, popovers, notifications, a control while you move it. Content never sits on glass. Text you read for more than a second, lists, documents, all stay on solid backgrounds. If everything is glass, nothing is, and you end up squinting at your own files.

If you run Singularity, all of this is on by default. The strength of each layer can be tuned, but I would start by leaving it alone for a week.
