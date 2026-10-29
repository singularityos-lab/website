---
title: Plugins
description: Extend the Singularity desktop with libpeas plugins.
---

Plugins extend the desktop at runtime. They are loaded through `libpeas` from a
`.plugin` manifest and can add panel widgets, dock items, overview widgets, search
results, and more.

## Anatomy of a plugin

A plugin is a shared module plus a `.plugin` manifest:

```ini
[Plugin]
Module=hello
Name=Hello
Description=A minimal plugin to copy from.
Authors=Your Name
Website=https://sinty.dev
Builtin=false
```

## Hello, plugin

The module registers itself with libpeas and implements `Singularity.Plugin`. Its
`activate()` receives a `PluginContext`, the handle through which it reaches the
shell. This one adds a button to the panel:

```vala
[ModuleInit]
public void peas_register_types (TypeModule module) {
    ((Peas.ObjectModule) module).register_extension_type (
        typeof (Singularity.Plugin), typeof (HelloPlugin));
}

public class HelloPlugin : Object, Singularity.Plugin {
    private Gtk.Button button;

    public void activate (Singularity.PluginContext ctx) {
        button = new Gtk.Button.from_icon_name ("face-smile-symbolic");
        button.tooltip_text = "Hello";
        ctx.add_panel_widget (button, Gtk.Align.END);
    }

    public void deactivate () {
        if (button != null) button = null;
    }
}
```

Build it against `singularity-1.0` and install the module alongside its `.plugin`
file.

## What a plugin can do: the contracts

`PluginContext` and a set of extension-point interfaces are the
[contracts](/docs/contracts/): the stable, public surface a plugin builds against,
so it never has to reach into the shell's private internals. Beyond adding panel
widgets, a plugin can implement:

- `DockItemExtension` to enrich a dock item, the way the bundled media, messaging,
  and download plugins do. See [the dock](/docs/dock/).
- `DockContextMenuProvider` to add entries to a dock item's menu.
- `OverviewWidgetProvider` to provide [widgets](/docs/widgets/).
- A search provider to add results to the overview search. See
  [Search providers](/docs/search-providers/).
- `ShellSurfaceProvider` to replace a whole shell surface, such as the dock.

## Where plugins live

The shell scans, in order, the system prefix (`share/singularity/plugins`) and the
per-user directory (`~/.local/share/singularity/plugins`), so user-installed
plugins sit alongside the built-in ones.

## Enabling a plugin

The easy way is graphical: the settings have a Plugins page where you turn plugins
on and off with a switch. Under the hood that is the `dev.sinty.desktop`
`enabled-plugins` key, so you can script it too. Several dock plugins ship enabled
by default.

## Start from an example

The plugins repository is full of working plugins to copy, from the simple
`example-dock` to the media, messaging, and download dock items.
