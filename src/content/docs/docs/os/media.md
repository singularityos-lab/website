---
title: Audio, video and cameras
description: Sinty Media, the media framework of Sinty OS, and the shared camera service.
---

Apps play audio and video, and use the camera, through **Sinty Media**. It takes
the place of GStreamer: apps built for GStreamer load it unchanged and do not know
the difference.

## One camera, several apps

On Sinty OS a session service, `sinty-mediad`, owns the cameras. When an app picks
a camera, it receives the picture from the service, so two apps can use the same
webcam at the same time, for example a call and a recording. Each camera runs in
its own isolated process.

## Hardware video

On Intel graphics, Broadwell and newer, video is decoded and encoded by the GPU
through VA-API and the Intel media driver. Video players and the web engine use
it, which keeps the processor free and the battery longer. On other GPUs video is
handled by the processor.

## Why replace GStreamer

- **Shared devices.** The camera service above.
- **Checked against the original.** Every behaviour is tested against the real
  GStreamer and must give the same result, so existing apps keep working.

Outside Sinty OS the libraries behave like GStreamer and open devices themselves.
