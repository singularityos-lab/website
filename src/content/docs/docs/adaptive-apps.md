---
title: Adaptive apps
description: Make a libsingularity app work on a desktop, a tablet, a phone and a TV, with one code base and no per-device branches.
---

A libsingularity app already adapts without extra code. Every
`Singularity.Widgets.Window` follows the [form factor](/docs/screens/) of the
screen it is on:

- on a tablet and a phone, menus and rows get larger touch targets and windows
  open full screen;
- on a phone, narrow layouts collapse;
- on a TV the window goes full screen with a dark theme, focus moves with the
  arrow keys, OK held opens menus, Back walks back through the app, and the
  sidebar sections become tabs in a TV header.

This page covers what to add when the default is not enough.

## Declare where the app belongs

Declare the form factors the app is made for in its desktop entry:

```ini
X-Sinty-FormFactors=desktop;tablet;phone;tv
```

or in code, which takes precedence:

```vala
var app = new Singularity.Application ("org.example.App", ApplicationFlags.DEFAULT_FLAGS);
app.form_factors = { "desktop", "tablet", "phone", "tv" };
```

An app that declares form factors without `tv` runs on a TV in compatibility
mode, with a pointer moved by the remote. An app that declares nothing is treated
as ready for every form factor.

The TV home shows an app among its tiles when the app declares `tv`. For apps
that declare nothing, it goes by the desktop entry categories: players, music,
video, games, photos, news, weather, maps and similar apps are shown, editors
and mixers are not. Every app is always in **All Apps**.

## Know the current form factor

```vala
switch (window.form_factor) {
    case Singularity.FormFactorKind.TV:
        break;
    case Singularity.FormFactorKind.PHONE:
        break;
    default:
        break;
}

window.form_factor_changed.connect ((previous) => {
    update_layout ();
});
```

`window.form_factor_compat` is true while the window runs in compatibility mode.
`FormFactorKind` also answers `is_touch_first ()`, `is_handheld ()` and
`is_full_screen ()`.

Ask the window, not the global setting: a window moved from a monitor to a TV
changes form factor on its own while the rest of the session does not. For a
screen without a window, `Singularity.FormFactor.at (monitor)` gives the form
factor of that monitor.

## Style for a form factor

Each window carries a style class for its form factor: `ff-desktop`,
`ff-tablet`, `ff-phone`, `ff-tv` or `ff-watch`, plus `ff-compat` in
compatibility mode. Use them in the app's CSS rather than separate style sheets:

```css
window.ff-tv .poster { min-width: 220px; }
window.ff-phone .details { margin: 0 12px; }
```

## Build a different layout

When one form factor needs a different widget tree, not just different sizes,
use `AdaptiveBin`. It calls your builder again whenever the form factor of its
window changes:

```vala
var body = new Singularity.Widgets.AdaptiveBin ((kind) => {
    if (kind == Singularity.FormFactorKind.TV) return build_shelves ();
    return build_grid ();
});
```

Keep the state outside the builder, in the model, so a rebuild loses nothing.

## List and detail

`SplitView` shows a list next to its detail on wide windows and one of them at a
time on narrow ones:

```vala
var split = new Singularity.Widgets.SplitView (list, detail);
split.attach_back_bubble (window);
list_view.activate.connect (() => split.show_detail = true);
```

`collapsed` says whether only one pane fits. When collapsed, the back bubble and
the Back key return from the detail to the list and emit `back_requested`.
`list_width` and `detail_min_width` set where it collapses.

## On a TV

- Every action must be reachable by focus. Buttons, rows and grid children are
  reachable; custom drawing areas need `focusable = true` and key handling.
- Hold OK opens the item's `menu.popup` action, the same as a right click, so
  context menus work with a remote.
- Back follows the back button of the app's toolbar even when the TV header
  hides it. An app that draws its own full screen view, such as a video player,
  can hide the header with `window.tv_head_hidden = true`.
- Text fields get a keyboard driven by the remote; do not build your own.

## Testing

Run the app with `SINTY_FORM_FACTOR=tv`, `phone` or `tablet` to force a form
factor, or open a nested preview at the real size from **Developer Options,
Form Factor**. See [Developer mode](/docs/developer-mode/).
