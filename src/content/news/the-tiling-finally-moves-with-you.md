---
title: The tiling finally moves with you, and gestures
date: 2026-08-10T17:30:00Z
description: Scrolling tiling is finally on screen in Singularity, with one-to-one touchpad movement, animated settling and gestures that keep the rest of the desktop out of the way.
draft: false
---

Scrolling tiling is a feature I have wanted for a long time, ever since I was using GNOME with PaperWM many months ago. I liked the idea immediately, but liking the idea and making it behave like part of a desktop are two very different things.

I finally have it on screen in Singularity, and the important part is not that windows form a nice row for a recording. The strip follows the hand, windows can be stacked when that makes sense, and the rest of the desktop does not suddenly forget how to be itself.

<video class="post-video" controls playsinline preload="metadata">
  <source src="/scrolling-tiling.mp4" type="video/mp4" />
</video>

## The strip follows the hand

The useful idea is simple: columns do not keep shrinking until every window becomes a postage stamp, they continue past the edge and the focused one comes into view. A three-finger horizontal swipe moves the strip one to one, so when the fingers move 60 pixels the windows move 60 pixels too.

When I release, a short movement settles back to the current column and a real movement settles on the next one. I do not need to land perfectly in the middle of a window, and closing one does not throw its neighbour into the centre in a single frame, it lets the remaining column arrive there.

The small pill in the panel shows where I am in the strip. It appears automatically while scrolling tiling is active, disappears when it is not, and can be moved with the desktop customizer like the rest of the panel. It is not an extra item I expect people to add by hand just to understand what the mode is doing.

## Windows can share a place

Dragging was the part that made the prototype stop being a prototype. While I move a window, the desktop shows where it will land, and the last 30 pixels above or below another window become a place I can drop it. The two windows then share a column instead of fighting for separate positions.

If I pull one sideways, it leaves the stack and becomes its own column again. If I drag it into the lower drop area, it becomes floating, and the snapping guide gets out of the way for that interaction. I wanted the mode to give me a rhythm without forcing every window into the same answer.

## Gestures that do not fight each other

Three fingers horizontally belong to the tiling strip. Four fingers horizontally still switch workspaces, while three fingers vertically opens the workspace overview and four fingers vertically opens the app launcher.

The overview and launcher sit over the desktop without painting a second opaque panel over it, and opening them does not rearrange the tiled windows underneath. The second recording shows those gestures in the same session:

<video class="post-video" controls playsinline preload="metadata">
  <source src="/touchpad-gestures.mp4" type="video/mp4" />
</video>

I did not have a decent way to record the gesture itself without making the result harder to understand, so the video can only show the surfaces moving. The proper test is to try it directly on a touchpad, where the overview and launcher follow the gesture instead of asking you to trust a recording of it.

## The palette grew up too

The other shell piece I wanted to fix was the palette. It is still the quick box in the middle of the screen, but it no longer stops at launching an app or running a command. It can search files, show a useful preview on the right, and evaluate a calculation without making me open another app just to check the result.

Typing `!` switches it into action mode. That keeps the shortcuts out of the way when I am just searching, then gives me the things I actually need when I ask for them: customizing the panel and dock, opening Settings, locking the screen, showing workspaces or apps, opening a terminal, taking a screenshot and changing desktop features such as tiling. The icon changes with the mode, so the box tells me what it is doing instead of leaving a row of potentially dangerous commands under every search.

The result is closer to how I wanted the shell to feel from the start: one place that understands apps, files, calculations and desktop actions, with the extra context appearing only when it is useful.

<p class="post-gallery">
  <img src="/spotlight-empty.png" alt="The empty Singularity Spotlight palette" />
  <img src="/spotlight-app-search.png" alt="Spotlight searching installed applications" />
  <img src="/spotlight-file-preview.png" alt="Spotlight searching files with a preview" />
  <img src="/spotlight-math.png" alt="Spotlight evaluating a calculation" />
  <img src="/spotlight-actions.png" alt="Spotlight action mode with desktop commands" />
</p>

## It is finally a real desktop feature

I have spent enough time making this look convincing in a demo. The part I care about now is that I can open a window, move it, stack it, pull it out again and keep using the overview without the layout losing track of itself.

There are still clients and hardware combinations I have not met, so I am not pretending a recording proves the feature is finished. It does prove that the idea has moved out of the prototype stage and into the desktop where I can use it every day, find the sharp edges and keep fixing them ([#227](https://github.com/singularityos-lab/singularity-desktop/issues/227)).

The touchpad work is tracked separately in [#116](https://github.com/singularityos-lab/singularity-desktop/issues/116), and the implementation is available in the current Sinty build.
