---
title: Music
description: The Singularity music player.
---

Music plays your local audio, with a now-playing view that takes its color from
the album art.

## Playing

Add audio files to build a playlist, or open a track from Files. The now-playing
view shows the title, artist, and album, with the cover art pulled from the
file's tags and the accent color drawn from that cover. The usual controls are
there: play and pause, previous and next, a seek bar, volume, shuffle, and repeat
with an all and a one mode.

There is also a mini player, a small floating window with the cover, the title,
and the basic controls, for when you want playback out of the way.

## On the desktop

Music exports its state over MPRIS, so the desktop media controls and your
keyboard's media keys can play, pause, and skip without bringing the app
forward. Playback uses GStreamer, which handles MP3, Ogg, FLAC, WAV, and
MP4 or AAC audio.

:::note
Music plays the files and playlists you give it. It does not yet scan a music
library or search across your collection, and playlists are not saved between
sessions.
:::
