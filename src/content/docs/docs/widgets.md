---
title: Widgets
description: Build a widget for the Singularity overview.
---

Widgets are surfaces shown in the overview, sized to a grid. They come from two
places: a small set ships built in, in the `singularity-widgets` repository, and
apps or plugins can provide their own.

## What a widget is

A widget is a provider plus the instances it builds. The provider describes the
widget (its id, name, icon, and the grid sizes it supports) and creates an
instance, an ordinary GTK widget, for each placement. Providers implement the
`OverviewWidgetProvider` extension point from libsingularity, one of the public
[contracts](/docs/contracts/).

## Hello, widget

A minimal provider that shows a label:

```vala
public class HelloProvider : Object, Singularity.OverviewWidgetProvider {
    public string id           { get { return "hello"; } }
    public string provider_id  { get { return "dev.example.hello"; } }
    public string display_name { get { return "Hello"; } }
    public string icon_name    { get { return "face-smile-symbolic"; } }

    public Singularity.WidgetSize[] supported_sizes {
        get { return { Singularity.WidgetSize (1, 1), Singularity.WidgetSize (2, 1) }; }
    }

    public Gtk.Widget create_instance (string instance_id, Singularity.WidgetSize size, Variant? config) {
        return new Gtk.Label ("Hello, Singularity");
    }
}
```

## Shipping it

A built-in widget is declared by a `.widget` manifest that points at a factory
function returning the provider:

```ini
[Widget]
Id=hello
ProviderId=dev.example.hello
Name=Hello
IconName=face-smile-symbolic
Sizes=1x1;2x1
Module=libhello-widget.so
ModuleSymbol=hello_widget_new
```

```vala
[CCode (cname = "hello_widget_new")]
public static Object hello_widget_new () {
    return new HelloProvider ();
}
```

`Sizes` lists the grid sizes the widget supports, and `Module` with `ModuleSymbol`
name the shared object and the function the desktop calls to create the provider.

## From an app or a plugin

An app can expose its own widget alongside it, so installing the app brings the
widget too. The calculator does this, shipping a widget next to the app. A
[plugin](/docs/plugins/) can register an `OverviewWidgetProvider` the same way it
registers any other extension. Either path uses the same `OverviewWidgetProvider`
contract shown above.
