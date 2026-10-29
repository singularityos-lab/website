---
title: Why I forked GTK, and why it is called SIT
date: 2026-10-26
description: "Singularity apps now run on SIT, our own fork of GTK 4. Same binary interface, so every GTK 4 app keeps working, plus the few things a desktop like ours could not do without."
---

For a long time I told myself I would never fork a toolkit. A fork is a promise to keep merging someone else's work forever, and GTK moves fast. Then I spent a year writing the same workaround in five apps, and the promise started to look cheaper than the workarounds.

SIT is that fork. It starts from GTK 4.22.4 and ships as `libgtk-4.so.1`, the same library name and the same binary interface as upstream. Nothing on your system has to be rebuilt for it. Any GTK 4 app you install, ours or not, loads SIT and runs exactly as it would on stock GTK. A check runs on every change and fails if a single exported symbol drifts from upstream.

![Where SIT sits between apps, the renderer and the compositor](/blog/sit-stack.svg)

### What it adds

The additions live behind a separate header and a separate pkg-config name, `sit-1.0`, so an app has to ask for them on purpose. Today that is a short list:

- **Visual transform, opacity and clip on any widget**, applied at draw time without touching layout. This is what lets a sidebar slide, a card scale on press or a list fade in without each app writing its own snapshot code.
- **A real window border.** A thin, light-catching edge drawn by the toolkit at the right radius and scale, instead of a CSS box-shadow that every app tuned slightly differently.
- **Frame statistics.** How long each frame took to lay out, render and present. I use it to find animations that drop frames before you notice them.
- **Glass.** A widget, and a snapshot call, that refract and blur whatever is behind them. More on that in [how Liquid Glass works](/news/how-liquid-glass-works).

The rest of the work is fixes: a couple of crashes in image loading found with the sanitizers, rendering bugs we hit in our own apps, things we could not wait months for.

### Why not just patch the apps

Because the problems were never in the apps. Corner radius, the border, how a transform is applied, how glass reads its backdrop: these belong to the toolkit. Done once in SIT, every Singularity app gets them the same way, with the same timing and the same edge. That consistency is most of what makes the desktop feel like one thing instead of a collection.

### What it means for you

If you run Singularity, you are already on SIT. Apps outside our set see plain GTK 4. If you build your own app and want the extras, link `sit-1.0` next to `gtk4` and include `sit.h`; if SIT is not installed, the app does not link, so you always know which one you are getting.

The source is at [github.com/singularityos-lab/sit](https://github.com/singularityos-lab/sit).
