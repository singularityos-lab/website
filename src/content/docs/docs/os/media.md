---
title: Audio, video and cameras
description: Sinty Media, the media framework of Sinty OS, the shared camera service, and what an app developer can rely on.
---

Apps play audio and video, and use the camera, through **Sinty Media**. It takes
the place of GStreamer 1.x: it provides `libgstreamer-1.0.so.0`, the
gst-plugins-base libraries and the WebRTC library with the same symbols, types
and behaviour as GStreamer 1.28, so apps built for GStreamer load it unchanged.

## Writing an app

Use the GStreamer API as on any other system. Build against the GStreamer
headers; on Sinty OS the same binary runs on Sinty Media.

```vala
var play = Gst.ElementFactory.make ("playbin", null);
play.set ("uri", "file:///home/me/Videos/clip.mkv");
play.set_state (Gst.State.PLAYING);
```

The elements of gst-plugins-base are built in, together with Ogg, Vorbis, Opus,
Theora, `video4linux2` and VA-API. Elements from other plugin sets, such as
gst-plugins-good, are not part of the system: use what is listed here or ship
the plugin with your app.

## One camera, several apps

On Sinty OS a session service, `sinty-mediad`, owns the cameras. Pick the camera
the usual way, from `Gst.DeviceMonitor` with the `Video/Source` class, and call
`create_element ()`: on Sinty OS the element you get is `sintymediasrc`, which
receives frames from the service as shared buffers instead of opening the device.
Two apps can then use the same webcam at the same time, for example a call and a
recording. Each camera runs in its own isolated worker process.

```vala
var monitor = new Gst.DeviceMonitor ();
monitor.add_filter ("Video/Source", null);
monitor.start ();
var camera = monitor.get_devices ().data.create_element (null);
```

An app that builds `v4l2src` by name opens the device itself and keeps it to
itself, as on any other Linux system.

| Variable | Effect |
| --- | --- |
| `SINTY_MEDIA_DELEGATE=0` | Cameras are opened by the app, not by the service. `1` forces the service even outside Sinty OS. |
| `SINTY_MEDIAD_SOCKET=<path>` | Socket of the service. The default is `$XDG_RUNTIME_DIR/sinty-mediad.sock`. |
| `SINTY_MEDIAD_SOFTWARE=1` | The service decodes on the processor even when the GPU can. |

## Hardware video

On Intel graphics, Broadwell and newer, H.264 and VP9 video is decoded by the
GPU through VA-API and the Intel media driver. `vah264dec` and `vavp9dec` rank
above the software decoders, so `playbin` and `decodebin` pick them on their
own. Video players and the [web engine](/docs/os/web-engine/) use them. Other
codecs, other GPUs and encoding run on the processor.

## Compatibility

Every behaviour is checked by differential tests: each test runs once against
the real GStreamer and once against Sinty Media, and both must print the same
output. The list of symbols existing apps need is checked on every build.

Outside Sinty OS the libraries behave like GStreamer and open devices themselves.
