---
title: Singularity on a watch
description: The watch face, its ten built-in designs and their options, the apps grid and the quick settings shade, and how to write a watch face of your own.
---

:::caution[Developer preview]
The watch form factor is offered only with Developer mode on. Open it from
**Developer Options, Form Factor**, as a nested preview at 396 by 396 pixels, or
choose **Watch** in **Behaves As** for a small screen. See
[Screens and form factors](/docs/screens/).
:::

A screen smaller than 2.2 inches behaves as a watch. The shell then shows a watch
face instead of a desktop or a home screen.

## Using it

| Gesture | Action |
|---|---|
| Tap the face | open the apps, three to a row |
| Touch and hold the face, or right click | choose a watch face |
| Pull down from the face | open the quick settings shade |
| Escape | go back one step, to the face |

Apps open full screen and take the watch layout of libsingularity.

## Watch faces

Ten watch faces come with Singularity: **Meridian**, the default, **Portrait**,
**Chronograph**, **Event Horizon**, **Stack**, **Rings**, **Words**, **Aurora**,
**Bauhaus** and **Pilot**.

Touch and hold the face, pick one, then choose **Customize** to change its
options, such as the colour of the dial, the seconds hand, the date, or the photo
behind **Portrait**, which comes from your wallpaper. **Done** keeps the choice.
Faces can show the battery, charging and how many notifications are waiting.

Your choices are kept in `~/.config/singularity/watch-faces.ini`.

## Writing a watch face

A watch face is a shared module that returns a `Singularity.WatchFaceProvider`.
The provider names the face, lists its options, says how often it must be
redrawn, and draws it with Cairo:

```vala
public class OrbitFace : Singularity.WatchFaceProvider {
    public override string id { get { return "org.example.watch.orbit"; } }
    public override string name { get { return "Orbit"; } }

    public override Singularity.WatchFaceOption[] get_options () {
        return {
            Singularity.WatchFaceOption.colors ("accent", "Accent",
                { "#ff6a2b", "#4aa3ff" }, { "Orange", "Blue" }, "#ff6a2b"),
            Singularity.WatchFaceOption.toggle ("seconds", "Seconds", true)
        };
    }

    public override Singularity.WatchFaceRefresh get_refresh (Singularity.WatchFaceFrame frame) {
        return frame.get_flag ("seconds", true) ? Singularity.WatchFaceRefresh.SECOND
                                                : Singularity.WatchFaceRefresh.MINUTE;
    }

    public override void draw (Cairo.Context cr, Singularity.WatchFaceFrame frame) {
        var accent = frame.get_color ("accent", "#ff6a2b");
    }
}

public Object orbit_face_new () {
    return new OrbitFace ();
}
```

The frame gives the size, the time, the battery level and charging state, the
number of waiting notifications, the wallpaper, and the values of the options.
Options are a **choice** among labelled values, a set of **colors**, or a
**toggle**. Refresh is per **MINUTE**, per **SECOND**, or **CONTINUOUS** for faces
that animate.

Install the module with a `.watchface` manifest in
`~/.local/share/singularity/watchfaces/` or `/usr/share/singularity/watchfaces/`:

```ini
[Watch Face]
Module=liborbit-face.so
ModuleSymbol=orbit_face_new
```

`Module` is looked up next to the manifest, then in
`/usr/lib/singularity/watchfaces/`.
