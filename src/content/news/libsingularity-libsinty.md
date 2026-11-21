---
title: "libsingularity, soon libsinty: what's new"
date: 2026-11-21
description: "What libsingularity provides today: the application framework, the async layer on top of SIT, the native system core, the integration with Sinty Compute, the contracts with the shell and the system, and the widget set. It will be renamed libsinty."
---

libsingularity started as the shared widget library of the Singularity apps. Today it is the platform layer that every first-party application, the shell, Settings and the portals are built on. The name no longer describes it, so in an upcoming release it will be renamed **libsinty**.

This post describes what the library provides at the technical level and how it connects to SIT, Sinty Compute and the rest of the system. The widgets have their own section at the end.

### Layers

![The layers of libsingularity and what they depend on](/blog/libsingularity-layers.svg)

The source tree builds three libraries:

- **libsingularity** is the toolkit for applications: application framework, widgets, motion, the async layer, document formats, media, accounts.
- **libsingularity-system** contains the system managers used by the shell and Settings: audio, power, brightness, network, Bluetooth, displays, sensors, updates, sandbox permissions. It is enabled with `-Dsystem` and an application that only needs the toolkit does not link it.
- **libsinty-system-core** is a native core written in Zig with a flat C interface, `sinty-system/v1.h`. It is described in its own section below.


### Optional components resolved at runtime

libsingularity is not tied to Sinty OS. The same build runs on stock GTK 4, on SIT and on Sinty OS, and selects the available implementation the first time a feature is used:

![Optional components and their fallbacks](/blog/libsingularity-optional.svg)

- **SIT** is detected by looking up its symbols in the running process (`sit_task_run`, `sit_widget_set_glass`, `sit_widget_set_visual_transform` and others). No link-time dependency on SIT exists, so an application built against libsingularity runs unchanged on stock GTK.
- **Sinty Compute** is loaded with `dlopen("libsintycompute.so.0")`.
- **The system core** is loaded with `dlopen("libsinty-system-core.so.1")` by the features that need it outside libsingularity-system, such as the PipeWire graph.

Each path has a defined fallback, and the fallback produces the same results. Only the scheduling, the reuse or the effect is missing.

### The async layer and SIT

`Singularity.Async` is the interface Singularity applications use for work that must not run on the main thread:

```vala
Async.dispatch(this, Async.Qos.USER, (c) => {
    var rows = store.query(filter);
    return () => list.splice(0, list.n_items, rows);
});
```

```vala
var texture = yield Async.load_image(file, 512);
var feed = Async.Feed.spawn((feed, c) => scan(folder, feed));
```

| Call | Purpose |
|---|---|
| `dispatch(owner, qos, job)` | run a job on a worker; the returned closure runs on the main thread, and is skipped if the owner was finalized |
| `run<T>(work, qos)` | the same as an `async` method returning a value |
| `post(owner, apply)` | schedule a closure on the main thread with frame-paced delivery |
| `scope_of(widget)` | a cancellable bound to the widget's lifetime |
| `Feed` | a stream of results produced on a worker and consumed in batches |
| `load_bytes`, `load_texture`, `load_image`, `load_cover` | file loading with decoding on a worker |
| `Thumbnails` | thumbnail loading with an in-memory cache; failures are recorded in the shared thumbnail cache |
| `TileCache` | tiled drawing cache for large scrolling surfaces |

On SIT these calls map directly to the SIT scheduler: `SitTask`, `SitScope`, `SitStream` and `sit_file_load_async`. Jobs therefore get the four QoS classes, per-core queues with work stealing, io_uring file reads and delivery after the paint phase described in the [SIT post](/news/sit-a-month-later).

Without SIT, the same calls run on a `GTask` thread pool. Background jobs lower the priority of their thread to nice 19 and the idle I/O class for the duration of the job and restore it afterwards. `SIT_ASYNC=off` forces this path for comparison.

`TileCache` deserves a mention, because it is responsible for most of the rendering improvements measured in the SIT post. It splits a surface into 256 pixel tiles, keeps drawn tiles as GPU textures, redraws only tiles that are invalidated or newly exposed, and can draw tiles on scheduler workers. Spreadsheet scrolling went from 50 to 136 frames per second with it.

### The system core

`libsinty-system-core` replaces most of what a desktop usually obtains through a set of separate daemons and libraries. It is written in Zig, built in `ReleaseSafe` mode, and exports 255 functions through a versioned C header in 42 modules:

| Area | Modules |
|---|---|
| Processes and sessions | proc, session, logs, notify, settings, conf |
| Hardware | power, display, gpu, sensors, haptic, input, device, firmware |
| Storage | disk, mount, fs, ext4, f2fs, erofs, fsck, crypt, fscrypt |
| Network | net, nl, wifi, wireguard, firewall |
| Desktop data | audio (PipeWire protocol), bluetooth, clipboard, print, accounts, i18n, words, time, unlock |
| Formats | gvariant, gvdb |

The interface is plain C: structures with fixed layout, explicit ownership and `sinty_*_free` functions for every allocation. Three kinds of callers use it:

- libsingularity-system, through a Vala binding;
- the Sinty system services written in Go, through the `sintysystem` package: `sinty-diskd`, `sinty-firewalld`, `sinty-timedate` and `sinty-nm` use it for block devices, encryption, netfilter, the real-time clock, netlink and WireGuard;
- any C program, through `pkg-config sinty-system-1`.

The PipeWire graph is an example. The core implements the PipeWire native protocol itself, and `Singularity.PipeWireGraph` returns the graph in the same shape as `pw-dump`, without spawning a process or linking libpipewire. The camera and microphone indicators in the shell, which show which applications are reading a device, are built on it.

### Sinty Compute

Applications repeat a lot of work: the same wallpaper is decoded by several processes, the same thumbnails are rebuilt each time a folder opens. Sinty Compute stores results of such computations and reuses them, across threads and across processes, while the kernel reports when the memory a computation read may have changed.

libsingularity exposes it as `Singularity.Compute`:

![How a call goes through Sinty Compute](/blog/libsingularity-compute.svg)

```vala
var pixbuf = Compute.load_scaled(path, 256, 256, true);
```

```vala
var bytes = Compute.shared().call(region, Compute.key("my-result", id.data), () => {
    return produce();
});
```

A call is identified by a region and a key; the key includes everything the result depends on, such as the path, modification time, size and target dimensions. Thumbnails, scaled image decoding, cover art, previews and accent colour samples in the Singularity applications go through it. One context is shared by all threads of a process.

Sinty Compute is experimental and disabled by default. When it is not installed or not enabled, `Compute.available()` returns false and the producer runs directly.

### Contracts with the system

Integration with the shell and with system services is done through contracts: D-Bus interfaces that the application implements and the system discovers. Each contract is a class in libsingularity, so implementing one does not require writing D-Bus code.

![Contracts between an application and the system](/blog/libsingularity-contracts.svg)

- **Shell**: search providers with secondary actions, quick settings tiles with detail pages, entries in the dock menu of a running application, overview widgets loaded from `.widget` manifests, watch faces.
- **Settings**: applications do not ship their own preferences window. They install a GSettings schema and a JSON descriptor, and Settings renders the page under the application's entry.
- **Capabilities**: an application can declare that it provides notes, tasks, calendars or translation (`dev.sinty.Notes1`, `Tasks1`, `Calendar1`, `Translate1`) through a key file, and other applications obtain the provider through `Singularity.Capabilities`.
- **System agent**: `dev.sinty.AppAgent1` lets an application publish intents, each with a declared risk level that decides whether the agent must ask before running it. Only the owner of `dev.sinty.Agent` may call it.
- **State**: Focus (`dev.sinty.Focus1`), form factor (desktop, tablet, phone, TV, watch), one-time codes, camera and microphone clients.

### Libraries for applications

The remaining areas are domain libraries shared by the applications, so that, for example, PDF handling exists once rather than in each application that opens a PDF:

| Area | Contents |
|---|---|
| PDF | parser, writer and editor: pages, fonts, forms, annotations, attachments, encryption, signatures, redaction, optimization, linearization, tagged PDF, comparison |
| Printing | IPP transport, printer discovery and monitoring, presets, layout, preview, print dialog |
| Accounts | CalDAV, CardDAV, WebDAV, Exchange, cloud drives and shared links, synchronized collections |
| Documents | charts (DrawingML, ODF), equations (MathML, OMML), vector geometry with boolean operations and offsets, markup |
| Media and imaging | playback, streaming, video paintables, filters, blending, ICC profiles, float images |
| Sharing | share sheet, Nearby, live sessions over TLS; the screen sharing host with Wayland capture, virtual input and RFB encoders, used by the remote desktop and the portal |
| Other | calendar recurrence and ICS, collaborative text sessions, Git diffs, text recognition, speech synthesis, parental controls, QR encoding and decoding, LED matrices, 3D scenes |

### Compatibility

libsingularity exports a stable binary interface. A CI job compares every revision against the previous one with libabigail and fails on incompatible changes, and the native core has its own ABI test in Zig. Applications installed separately from the system, such as those distributed through SXI, depend on this check.

### Widgets

The widget set covers what the Singularity applications need, and every first-party application uses these widgets instead of defining its own:

- **Windowing**: `Window` with the Singularity title bar and rounded clipping, `ToolBar`, `AppMenu`, `AdaptiveBin` for layouts that change with the form factor, `Focus`.
- **Navigation**: `AppSidebar` and `SidebarTabs`, `SplitView`, `DetailPane`, `InspectorPanel`, `TabBar` and `TabContainer`, the ribbon used by the office applications (`RibbonWidget` and its items), `ContextMenu`, `ToolPalette`, `EdgeSheet` and `EdgeSwipe` for touch.
- **Controls**: `SegmentedControl`, `BubbleSwitcher`, `ChoiceButton`, `IconButton`, `CircularButton`, `SearchEntry`, `TimePicker`, `ColorPickerButton`, `QuickSettingTile`, `SwipeNavigation`, `GlassBin`.
- **Preferences**: `PreferencesWindow`, `PreferencesPage`, `PreferencesGroup` and rows for switches, entries, passwords, e-mail addresses, spin buttons, selections, expanders and colour schemes.
- **Data**: `DataGridView`, `DataListView`, `GroupedDataListView`, `ColumnBrowser`, `SectionedList`, `CommandPalette`, `OverlaySearch`.
- **Pages**: `WelcomePage`, `StatusPage`, `ImageViewer`, `ScreenshotCarousel`, the calendar month, week, day and time grid views.
- **Editors**: `SourceView`, `PageCanvas`, `RulerWidget`, `FindReplaceBar`, `FloatingFormatBar`, `StyleChooser`.
- **Visual**: `Avatar`, `Banner`, `Toast`, `Chip` and `ChipBar`, `Carousel`, `Skeleton`, `CircularProgress`, `SparkLine`, media cards and shelves, watch faces, the wallpapers drawn in code (Aurora, Bauhaus, Event Horizon, Meridian).
- **Dialogs**: `AboutDialog`, `AppDialog`, `ConfirmDialog`, `ShortcutsDialog`.
- **Motion**: spring animations with a velocity tracker, keyframe animations, page transitions, popover motion, list animations, widget morphing, drag lift and focus ring. On SIT these use visual transforms, which change how a widget is drawn without triggering a new layout.
- **Style**: `StyleManager` with light and dark modes and accent colours, the glass material and its fallback on software renderers, icon recolouring.

The source is at [github.com/singularityos-lab/libsingularity](https://github.com/singularityos-lab/libsingularity).
