---
title: Exposing app settings
description: Surface your app's settings in the Singularity Apps page with a JSON descriptor.
---

Your app can surface its settings inside Singularity's
[Apps page](/docs/app-settings/), so users configure it without opening it. You do
this by shipping a small JSON descriptor alongside the app. The shell reads it,
renders a row per setting, and binds each control to your `GSettings` schema, so
the values stay in sync whether they are changed in the app or in the settings
page.

## The descriptor

Install a `<app-id>.json` file into the `app-settings` data directory. The shell
looks in the user directory first, then the system ones. With meson:

```text
install_data('data/dev.sinty.files.json',
  install_dir: get_option('datadir') / 'singularity' / 'app-settings')
```

The file names your `GSettings` schema and lists the settings to show:

```json
{
  "schema-id": "dev.sinty.files",
  "settings": [
    {
      "key": "show-hidden",
      "label": "Show Hidden Files",
      "type": "boolean",
      "widget": "switch"
    },
    {
      "key": "view-mode",
      "label": "View Mode",
      "type": "string",
      "widget": "combo",
      "options": [
        { "id": "list",   "label": "List View" },
        { "id": "grid",   "label": "Grid View" },
        { "id": "column", "label": "Column View" }
      ]
    }
  ]
}
```

## The fields

Each entry has a `key` (a key in your schema), a `label`, a `type`, and a `widget`:

- `boolean` with `switch` (or `toggle`) renders a switch row.
- `int` with `spin` renders a spin button; add `min` and `max`.
- `string` with `entry` renders a text field.
- `string` with `combo` renders a chooser; provide `options` as `id` and `label`
  pairs.
- `string` with `color-scheme-selector` renders the theme picker; an optional
  `theme-set` narrows it to a family such as the terminal or editor schemes.

## How values flow

The shell looks up the schema named by `schema-id`, reads the current value of each
`key`, and binds the control to it. So the settings live in your own `GSettings`
schema, and your app reads them the usual way, defensively, with
`Singularity.Core.safe_settings (...)` (see [Build an App](/docs/build-an-app/)).
A change made in the Apps page and a change made inside your app are the same
change.

## When a key is not enough

For settings that are not a plain `GSettings` key, an app can instead implement the
`dev.sinty.App.Settings` D-Bus service and hand the shell its schema and values at
runtime. That, and the descriptor above, are part of the public
[contracts](/docs/contracts/).
