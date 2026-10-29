---
title: Touchpad gestures
description: The default workspace, launcher, desktop, and scrolling tiling gestures.
---

Singularity keeps workspace gestures on four fingers and reserves three fingers
for the active scrolling tiling strip. The surfaces and windows follow the
gesture before settling into place when you release.

## Gesture map

| Gesture | Action |
| --- | --- |
| Four fingers left or right | Switch workspace |
| Four fingers down | Open the workspace overview |
| Four fingers up | Close the workspace overview |
| Four fingers up | Open the application launcher when the workspace overview is closed |
| Four fingers down | Close the application launcher |
| Spread four fingers | Reveal the desktop |
| Pinch four fingers | Restore the windows after revealing the desktop |
| Three fingers left or right | Move through scrolling tiling columns |
| Three fingers down | Close the focused scrolling tiling window |

The vertical four-finger gesture uses the surface already on screen as context.
Swiping down opens workspaces on the desktop, while the same direction closes an
open launcher. Swiping up opens the launcher, while it closes an open workspace
overview.

## One-to-one movement

Horizontal workspace switching and scrolling tiling move with your fingers. The
workspace overview and application launcher also move their content and opacity
with the vertical gesture. If the gesture is too short, the surface returns to
where it started; a committed gesture finishes the remaining motion.

The desktop reveal moves the current workspace windows toward the screen edges
and leaves a small part of each one visible. Spread four fingers to expose the
desktop, then pinch them to restore the saved positions. **Super + D** toggles
the same action from the keyboard.

The three-finger gestures are claimed by the desktop only while scrolling tiling
is active. Applications receive their normal touchpad gestures in other modes.

See [Scrolling tiling](/docs/scrolling-tiling/) for column movement, stacking,
and its settings.
