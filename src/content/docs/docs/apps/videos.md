---
title: Videos
description: The Singularity video player.
---

Videos plays your local video files, simply.

## Playing

Open a file from the menu or from Files and it starts playing. You get play and
pause, a seek bar, and skip back and forward by ten seconds. The controls are
[bubbles](/docs/bubbles/) floating over the video: they fade out while you watch
and come back when you move the pointer, or you can click the video to toggle
them. The window sizes itself to the video.

Playback uses GStreamer. If the GStreamer GTK4 output is missing, Videos tells
you on the welcome screen and points you at the package to install.

:::caution[Early and minimal]
Videos is a basic player today. It does not yet have subtitles, a fullscreen
mode, a playlist, or an on-screen volume control.
:::
