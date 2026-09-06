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

## Artist Packs

A wallpaper source -- built-in, a provider cache, or something imported from
online -- is described by a `.collection` file: a `GLib.KeyFile` with one
`[Collection]` group. The shell discovers packs by scanning a list of search
directories for `*.collection` files, in priority order -- the first root a
given `Id` is found in wins, so a later root can't silently override an
earlier one.

| Key | Meaning |
| --- | --- |
| `Id` | Stable identifier for the pack. Falls back to the filename (without `.collection`) when absent. |
| `Name` | Display name shown in the Wallpaper Source selector. |
| `Artist` | Attribution shown alongside the name, when different from it. |
| `Dir` | Absolute path to the directory of images this pack scans. |
| `Type` | Free-form pack kind (for example `static`); defaults to `static` when absent. |

Only `Dir` is required -- a `.collection` file missing it is skipped. `Dir` is
scanned recursively, bounded to a few levels deep, into any subdirectory other
than another registered pack's own `Dir` (so a provider cache with its own
subdirectories works, without pulling a separately-registered pack into its
parent's gallery).

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
