---
title: Contracts
description: The public D-Bus, extension, and settings contracts Singularity exposes.
---

Singularity exposes a small set of stable contracts that apps, plugins, and
widgets build against. They live in `libsingularity` so every component shares
the same definitions.

## D-Bus services

| Interface | Purpose |
| --- | --- |
| `dev.sinty.Shell` | The shell service: window, workspace, and desktop actions exposed to apps. |
| `dev.sinty.AppSettings` | App-settings descriptors the shell reads to render per-app settings. |
| `dev.sinty.App.Settings` | The per-app settings service apps implement to expose their own keys. |

## Extension points

These are in-process interfaces resolved through `libpeas`. Implement them to
extend the desktop:

| Interface | Extends |
| --- | --- |
| `Plugin` | The base plugin entry point loaded from a `.plugin` manifest. |
| `DockItemExtension` | Add or augment dock items. |
| `DockContextMenuProvider` | Contribute entries to dock context menus. |
| `OverviewWidgetProvider` | Provide widgets shown in the overview. |
| `SearchProvider` | Add results to the overview search. |
| `ShellSurfaceProvider` | Provide custom shell surfaces. |

Beyond these interfaces, the `PluginContext` handed to a plugin at activation is
itself part of the contract: through it a plugin adds panel and sidebar widgets,
registers search and VPN providers, and reaches shell state, without touching the
shell's internals. See [Plugins](/docs/plugins/).

## Settings

Shared look-and-feel preferences live in the `dev.sinty.desktop` GSettings
schema (accent, dark mode, wallpaper, enabled plugins, and more). Always read
it defensively, since standalone apps may run without it installed.

## Wallpaper providers

Wallpaper plugins implement `WallpaperProvider`. The interface exposes an
`id`, a `display_name`, and these asynchronous operations:

| Operation | Purpose |
| --- | --- |
| `choices(category_index, ...)` | List choices for a provider category. |
| `browse(choice_id, query, page, ...)` | Return a page of wallpaper items. |
| `import_item(item, ...)` | Import a selected item and return its local path. |

Plugins register providers with `PluginContext.add_wallpaper_provider()`.
The built-in provider has the ID `singularity`. Shipped provider plugins are
`wallpapers-stock`, `wallpapers-bing`, and `wallpapers-ocs`. The OCS and Bing
providers are opt-in and disabled by default.

Wallpaper pack metadata is discovered below
`singularity/wallpaper-collections` in each XDG system data directory,
followed by the same path in the user data directory. See
[Wallpaper packs](/docs/wallpaper-packs/) for the on-disk format.

## AccountsService vendor extension

Per-user appearance is published to the `com.singularity.Desktop` AccountsService
vendor extension so the greeter can read it before login:

| Property | Meaning |
| --- | --- |
| `Accent` | The user's accent colour, as a hex string. |
| `Background` | The user's wallpaper URI. |

:::note
A generated API reference for these contracts, derived directly from the source
interfaces, is planned. Until then, this page is the canonical summary.
:::
