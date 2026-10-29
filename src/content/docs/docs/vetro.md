---
title: vetro
description: The concise UI language that compiles to GTK at build time.
---

Every Singularity app authors its interface in `.vetro` files. vetro is a small,
declarative language for describing a GTK widget tree, compiled to a standard GTK
`.ui` file at build time. There is no runtime cost: what ships is plain, fast GTK
loaded through `GtkBuilder`.

## The syntax

A `.vetro` file describes a widget tree with nested blocks. The root is a
`Template` that names the generated class and its parent. Here is a real piece of
the calculator's window:

```text
Button(id: "mode_btn", marginStart: 8, marginEnd: 8) {
    HBox(spacing: 6) {
        Label(id: "mode_label", label: "Basic").translatable("label")
        Image(iconName: "pan-down-symbolic")
    }
}
```

Properties go in the parentheses (`id`, `label`, `spacing`, `marginStart`, and so
on). Children go in the braces. Method-style calls chain on after: `.cssClass(...)`
adds a CSS class, and `.translatable(...)` marks a string for translation.

You can use generic GTK widgets (`Box`, `Button`, `Label`, `Image`, `Grid`,
`ScrolledWindow`) and the Singularity primitives from
[libsingularity](/docs/libsingularity/) in the same tree.

## What it compiles to

The transpiler turns that into a standard GtkBuilder `.ui` file. The snippet
above becomes:

```xml
<object class="GtkButton" id="mode_btn">
  <property name="margin-end">8</property>
  <property name="margin-start">8</property>
  <child>
    <object class="GtkBox">
      <property name="orientation">horizontal</property>
      <property name="spacing">6</property>
      <child>
        <object class="GtkLabel" id="mode_label">
          <property name="label" translatable="yes">Basic</property>
        </object>
      </child>
      <child>
        <object class="GtkImage">
          <property name="icon-name">pan-down-symbolic</property>
        </object>
      </child>
    </object>
  </child>
</object>
```

That `.ui` is what ships, loaded through `GtkBuilder` at runtime. There is no
vetro left at runtime, and nothing to interpret.

## The build runs it for you

You do not call the transpiler by hand. The build invokes `vetro` from meson with
a `custom_target`, turning each `.vetro` into a `.ui`:

```text
vetro = find_program('vetro')

main_ui = custom_target('main_ui_gen',
  input: 'main.vetro',
  output: 'main.ui',
  command: [vetro, '--in', '@INPUT@', '--out', '@OUTPUT@'],
  build_by_default: true,
)
```

The transpiler is a standalone program, kept in
[its own repository](https://github.com/singularityos-lab/vetro), and must be on
your `PATH` for the build to find it. Download the prebuilt binary from the
[latest release](https://github.com/singularityos-lab/vetro/releases/latest), or
see [Build from source](/docs/build-from-source/) for the exact install steps,
including immutable systems.

## Wiring it up in Vala

UI lives in the `.vetro` file; behavior lives in Vala. You reach the widgets by
their `id`: point the class at the generated `.ui` with `[GtkTemplate]`, and pull
in the widgets you need with `[GtkChild]`.

```vala
[GtkTemplate (ui = "/dev/sinty/apps/calculator/main.ui")]
public class Calculator.Window : Singularity.Widgets.Window {
    [GtkChild] unowned Gtk.Label  display_label;
    [GtkChild] unowned Gtk.Button mode_btn;

    public Window (Gtk.Application app) {
        Object (application: app);
        display_label.label = "0";
        mode_btn.clicked.connect (() => { /* switch mode */ });
    }
}
```

The [demo app](/docs/build-an-app/) is the reference to copy from.
