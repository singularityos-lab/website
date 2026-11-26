---
title: "A boot chain for apps"
date: 2026-11-26
description: "Sinty OS knows every step between the power button and the desktop. Apps had one function that did everything. libsingularity now starts every app from a plan, with milestones, a critical path, a memory of past launches and a trace of where the time went."
---

Every step between the power button and the desktop of Sinty OS is mine: the loader, the early boot, the init, the loading screen. Each one knows what the previous one did, how long it took and what to do when it fails. When a step is slow I can point at it.

Then the desktop appears, you open an app, and all of that disappears. A GTK app starts in a single function, `activate()`, and everything happens in there: read the settings, open the database, build the window, fill it, start the file monitors, index the library. One function, on the main thread, in whatever order it was written. If it takes 400 ms nobody can say which part, and if the library is unreadable the whole app either crashes or opens empty.

So I gave apps their own boot chain. It lives in libsingularity, in `Singularity.Startup`, and 58 apps already start through it.

### A plan instead of a function

An app no longer starts by running code. It describes its start as a plan, and libsingularity runs the plan.

A plan is a set of tasks. Each task has an id, the tasks it waits for, and four properties:

- **A category.** `prepare` sets up what the window needs, `shell` builds the window, `content` fills it, `deferred` is everything that can wait until you are already working.
- **A place.** `main` tasks run on the main thread, `worker` tasks run on a thread of the async layer and hand their result back to the main thread.
- **A failure mode.** An essential task that fails stops the start and shows a proper error. A recoverable one turns off a single feature, and the app opens without it.
- **Hints.** A time budget, heavy I/O, the memory it is going to use, a cache key.

This is the plan of Photos:

```vala
plan.main("library", Category.PREPARE, (c) => prepare_library());
plan.main("catalog-open", Category.PREPARE, (c) => open_catalog());
plan.worker("catalog-read", Category.CONTENT, (cancellable) => {
    return Catalog.opened().read_all();
}, (c, snapshot) => {
    catalog.adopt((CatalogSnapshot) snapshot);
}).depends_on("catalog-open").depends_on("library").heavy_io();
plan.main("window", Category.SHELL, (c) => build_window())
    .depends_on("library").depends_on("catalog-open")
    .reaches(Milestone.SHELL_READY);
plan.main("content", Category.CONTENT, (c) => fill_content())
    .depends_on("window").depends_on("catalog-read")
    .reaches(Milestone.CONTENT_READY)
    .reaches(Milestone.INTERACTIVE);
plan.main("library-monitor", Category.DEFERRED, (c) => setup_library_monitor()).depends_on("content");
plan.main("index", Category.DEFERRED, (c) => indexer.scan(library_roots())).depends_on("content");
```

![The start-up plan of Photos](/blog/boot-chain-plan.svg)

The catalog is read on a worker while the window is being built, so the two overlap instead of queuing. The indexer and the folder monitors wait until the photos are on screen.

The plan depends on why the app was started. Opening a photo from Files adds an `open-file` task, and the app is interactive only once that photo is shown. When Photos is started in the background to answer another app, the plan keeps the catalog and drops the window altogether.

### Milestones

The boot chain of the system has stages, and so does the app:

- **shell-ready**: the window is on screen, even if empty.
- **content-ready**: what you came for is in it.
- **interactive**: you can use it. Requests that arrived during the start, like a second file to open, wait until here and are then handled in order.
- **settled**: the deferred work is done too.

A plan is checked before it runs, and a broken plan is refused with a message, not left to fail halfway. Every early milestone must be reached by some task, there can be no cycles, and a deferred task can never hold back an early milestone, directly or through a dependency. That last rule is the point of the whole design: work that can wait is not allowed to make you wait.

### The critical path

With dependencies and milestones written down, the runner knows which tasks stand between you and the window. It walks back from the tasks that reach the first three milestones and marks their whole chain as the critical path.

That decides the priority of everything. Critical tasks that reach shell-ready or interactive run at the interactive level of the async layer, the rest of the critical path at user level, off-path work at utility level, and deferred work in the background, where the Sinty scheduler is allowed to keep it away from the app in focus. Work on the main thread is split into slices with the matching GLib priority, so a deferred task never sits between you and a frame.

### It remembers

Each launch is recorded. The runner writes how long each task took into a small profile, one per app and per kind of start: a cold start and opening a file are different starts. Durations are averaged over runs, and a profile is trusted after three of them.

A trusted profile feeds the scheduler with real numbers instead of budgets, so the critical path is ordered by what actually takes long on this computer. The profile carries the identity of the app binary and the plan version, and an update throws it away instead of trusting numbers measured on different code.

A task can also declare a cache key. Then its result goes through Sinty Compute, and the next start reuses it as long as it is still valid. When Compute is not there, the task runs as usual.

Once the app settles, the runner hands the start-up memory back to the system. Every policy, reuse, scheduling and memory, can be switched off with `SINGULARITY_STARTUP_POLICIES`, which is how I check that none of them changes what the app shows.

### It is observed

Every app built on libsingularity carries an observer. It marks the moments that matter, from the first line of the library through the first layout, the first render and the first frame painted on screen, and the milestones of the plan. With `SINGULARITY_STARTUP_TRACE` set it writes them to a file. The same report is on the session bus, at `dev.sinty.Startup1` on the app's own object path, so a tool can ask a running app how its start went.

The first thing the observer found was not in any app. The Calculator, the smallest app I have, parsed the 221 KB stylesheet of the desktop two times on every start, and three times with an accent other than blue. The library loaded the theme in dark mode with the blue accent, then the app corrected it to the real mode and accent, and each correction parsed the whole stylesheet again. Now the mode and the accent are set before the theme loads, and the portal is asked for the accent only when it is needed.

![First paint of the Calculator before and after](/blog/boot-chain-first-paint.svg)

Six cold starts against six, alternated on the same machine: the first paint went from 227 to 194 ms, and the library start from 117 to 85 ms. Screenshots taken before and after are identical, byte for byte, in light and in dark.

I wanted 150 ms and I am not there. The trace says where the rest goes: about 30 ms for GTK to start, 28 ms to parse the stylesheet the one time it is still needed, 39 ms to build the interface, and 70 ms between the window being mapped and its first frame. Those are now numbers with names, and that is where the next round starts.

### For every app

An app that does not describe a plan still starts through the runner. Its `activate()` is wrapped into a single task that reaches the first three milestones, so it gets the observer, the trace and the D-Bus report without changing a line. Moving it to a real plan is then a matter of cutting that one task into pieces.

The boot chain of Sinty OS made the system honest about its own start. This does the same for apps: a declared order, a known critical path, failures that are contained, and a measurement for every step.

If an app feels slow to open on your computer, run it with `SINGULARITY_STARTUP_TRACE=/tmp/start.json` and send me the file on [GitHub](https://github.com/singularityos-lab) or on [Discord](https://discord.gg/Bj638UXffN).
