---
title: "SIT: A new async architecture and apps that never freeze"
date: 2026-11-21
description: "SIT now has a task engine that moves slow work off the GTK main thread, both for Singularity apps and for unmodified GTK 4 applications. This post describes the architecture, the measurements, the rendering work around it and the new touch handling."
---

A month ago I described [why I forked GTK](/news/why-sit). At that point SIT added a few visual features on top of GTK 4.22.4: visual transforms, the window border, frame statistics and glass. Since then most of the work has gone into scheduling: where slow operations run and how their results get back to the user interface.

### The main thread

A GTK application processes input, layout and drawing on a single main thread. At 60 Hz each frame has a budget of 16.7 ms, at 120 Hz about 8.3 ms. Any operation on the main thread that exceeds the remaining budget delays the next frame.

GTK provides `GTask` and a thread pool, and well written applications use them. Several parts of GTK itself, however, still run on the main thread: texture decoding, icon loading, list sorting and directory enumeration among them. Results of background work are also delivered through the main loop as soon as they complete, without regard to frame timing, so a large batch of completions can occupy several frames.

The figure below shows the case of decoding a 2000 x 1500 PNG.

![The same image decode with the stock GTK path and with SIT, frame by frame](/blog/sit-async-timeline.svg)

With the stock path the decode runs on the calling thread and occupies it for 17.8 ms, so one frame is missed. With SIT the decode runs on a worker thread. Until it completes, the texture is drawn as an empty area of its final size, so layout does not change when the image arrives; the decoded texture is then handed to the widget after the next paint.

### Architecture

All asynchronous work in SIT goes through one scheduler per process:

![Work flow through the SIT scheduler](/blog/sit-async-engine.svg)

- **Quality of service classes.** Each job belongs to one of four classes: interactive, user, utility or background. The class determines queue priority and the scheduling policy of the worker that runs it.
- **Per-core queues with work stealing.** Each CPU core has its own queue, and idle workers take jobs from busy queues. In the tests, eight jobs queued on a single core were executed on eight threads within 23 ms.
- **Background workers.** Background jobs run with `SCHED_IDLE` and idle I/O priority. The workers register with the Sinty system scheduler (`sinty-schedd`), which can then account for them.
- **io_uring.** Local file reads use io_uring through direct system calls. If the kernel does not allow io_uring, SIT falls back to the thread pool.
- **Frame-paced delivery.** Completions are not dispatched immediately. They are drained after the frame clock's paint phase, with a budget of 2 ms per frame, so a large number of completions is spread over several frames.
- **Scoped cancellation.** Jobs are created inside a `SitScope`. Destroying the scope, for example when the owning widget is destroyed, cancels all of its pending jobs.

The public API is in `sit.h`:

- `SitTask` runs a single job.
- `SitFuture` represents a pending result and can be combined with `all`, `any`, `race`, `timeout` and `then`. Futures implement `GAsyncResult`, so they can be used wherever GIO expects one.
- `SitStream` delivers results incrementally.
- `SitChannel` is a bounded channel for passing data between threads.
- `SitScope` groups jobs for cancellation.

In Singularity applications the same scheduler is exposed by libsingularity as `Singularity.Async`. The job runs on a worker and returns a closure that is executed on the main thread:

```vala
Async.dispatch(this, Async.Qos.INTERACTIVE, (c) => {
    var texture = Gdk.Texture.from_file(file);
    return () => viewer.set_texture(texture);
});
```

The first argument is the owner. If it is finalized before the job completes, the closure is not executed.

### Changes inside GTK

SIT remains a binary compatible replacement for `libgtk-4.so.1`, so the following changes apply to any GTK 4 application without recompilation:

- **Textures** created from files or clipboard data are decoded on a worker. A deferred texture reports its final size immediately and is drawn empty until decoding completes.
- **Icons and icon themes** are loaded by the scheduler.
- **Sorted list models** sort in parallel and emit a single change notification.
- **String filters** on large list models are evaluated in parallel.
- **Directory enumeration** runs on workers. The file chooser also gained a recursive folder search that does not require a desktop indexer.
- **Recent files**, **print and export finalization** and **clipboard images** complete their expensive parts on workers.
- **GIO file reads** go through io_uring by means of a GIO module, `sit-vfs`, installed with SIT.

### Measurements

The tests below run the same build twice: with the scheduler enabled and with `SIT_ASYNC=off`, which restores the GTK code paths. For responsiveness the relevant figure is the longest uninterrupted period during which the main thread could not process events or draw.

| Test | GTK path | SIT |
|---|---:|---:|
| Decode a 2000 x 1500 PNG, time on the calling thread | 17.8 ms | 0 ms |
| Enumerate 20,000 files, longest main thread block | 4.62 ms | 1.70 ms |
| Enumerate 20,000 files, total time | 68 ms | 85 ms |
| Sort 200,000 strings | 264 ms | 207 ms |
| Sort 60,000 strings in a list model, change notifications | 21 | 1 |
| Filter 200,000 list items by text | 174 ms | 47 to 92 ms |
| Small jobs dispatched by the scheduler | | 201,455 per second |

Directory enumeration takes about 17 ms longer in total with SIT, because results are delivered in chunks spread over several frames. In exchange the longest block of the main thread drops from 4.62 to 1.70 ms. The chunk size has not been tuned yet.

The Singularity applications were migrated to the same scheduler. Of 131 manually created threads, 100 were converted automatically and 22 by hand. The remaining ones are long running loops that should keep a dedicated thread: audio, encoders, render loops and samplers. The migration touched 30 repositories.

### Rendering

SIT records per-frame statistics for any application (`SIT_FRAME_STATS`): layout, snapshot, render and present times with medians and percentiles, matching an external frame counter within 1.2 percent. Profiling the heavier Singularity applications with it showed that most of their frame time went into full redraws: a spreadsheet scrolled by a few pixels repainted its entire visible area, although almost all of it had been drawn in the previous frame. libsingularity now provides a tile cache that keeps already drawn content as GPU textures and repaints only the newly exposed tiles; tiles can also be drawn on scheduler workers. Write uses a per-page texture cache, and Keyframe, Atelier, Draw and Montage received targeted fixes found by the same profiling.

![Frames per second before and after, per application](/blog/sit-frames-chart.svg)

All numbers were measured with the same documents on the same machine at 144 Hz. Spreadsheet scrolling went from 50 to 136 frames per second; with the tile cache the rendered output differs from direct drawing in 20 pixels out of 2,073,600. Overall the improvement ranges from 1.4 times (Montage) to 12 times (Atelier).

Glass, the refraction effect provided by SIT, has no measurable cost on a GPU renderer even with 24 panels redrawing every frame. On software renderers it used to reduce a test window to 7 frames per second. SIT now detects Cairo, llvmpipe, softpipe and CPU Vulkan devices and disables in-window glass for those windows; the same test then runs at 113 to 161 frames per second depending on the number of panels.

On a Pixel 7 Pro the stack renders on the GPU; a full screen animated GTK application measured 107 frames per second on the 120 Hz panel.

### Touch input

GTK's gesture handling assumes a pointer for context menus: a secondary button press opens the menu and a second click selects an item. SIT now adapts this to touch screens.

![Press and hold, slide, release](/blog/sit-touch-slide.svg)

- A `GtkGestureClick` listening to the secondary button also responds to a touch long press. Applications do not need changes to support it.
- When the long press opens a popover, the touch sequence is passed to the popover. Moving the finger highlights the item under it, and releasing activates that item. Releasing without moving leaves the menu open for a normal tap.
- The long press tolerates movement up to 1.5 times the drag threshold, measured as a distance rather than per axis. Scrolling still cancels it, because scrollable containers claim the sequence at the regular drag threshold.

Each change has a test in the gesture suite that fails without it.

### Availability

On Singularity and Sinty OS every application already runs on SIT with the scheduler enabled; the touch changes ship with the next update. Applications that want to use the scheduler directly can depend on `sit-1.0` and include `sit.h`. Every change continues to be checked against the upstream GTK binary interface.

The source is at [github.com/singularityos-lab/sit](https://github.com/singularityos-lab/sit).
