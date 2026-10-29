---
title: How the global menu works
description: The native path Singularity apps use, and the fallback chain for everyone else.
---

The shell shows the focused app's menus in the center of the panel. Getting a menu
out of an app is not one mechanism but several, tried in order, so that almost any
app ends up with a menu even if it was never built for this desktop.

## The native path

A Singularity app is a GTK4 app, and that is all it needs to be. It builds a
`GLib.Menu` as its menubar and registers its actions on the application and the
window:

```vala
var menubar = new GLib.Menu ();
var file = new GLib.Menu ();
file.append ("New", "app.new");
file.append ("Open", "app.open");
menubar.append_submenu ("File", file);

var app = (Gtk.Application) GLib.Application.get_default ();
app.menubar = menubar;

var act = new GLib.SimpleAction ("new", null);
act.activate.connect (() => { /* ... */ });
app.add_action (act);
```

GTK4 exports the menu over `org.gtk.Menus` and the actions over `org.gtk.Actions`
automatically. When the app gains focus, the shell reads its menu model from the
standard `/menus/menubar` object and binds the `app.` and `win.` action groups, so
clicking an item runs the action back in the app. The panel's `GlobalMenuBar`
(from libsingularity) renders the model into buttons and dispatches the actions.
That is the whole of it: provide a menubar and actions, and the menu appears.

## The fallback chain

When the focused app does not offer a GTK4 menubar, the shell tries other ways, in
order, and uses the first that yields a menu:

1. **GTK menu model** (`org.gtk.Menus`), the native path above.
2. **GTK actions** (`org.gtk.Actions`). For apps that export actions but no
   menubar, common on libadwaita apps, the shell calls `DescribeAll` and arranges
   the known actions into File, Edit, View, Go, and Help.
3. **DBusMenu**, the legacy app-menu protocol. The shell runs a
   `com.canonical.AppMenu.Registrar`; apps that register their window's menu object
   on it get their `com.canonical.dbusmenu` tree adapted into a menu model.
4. **Accessibility**, as a last resort. The shell walks the app's AT-SPI tree,
   finds its menu bar, rebuilds it, and activates items through the accessibility
   action.
5. **A built-in fallback** if none of the above produce anything: the app's
   launcher-entry actions plus basic window controls (minimize, maximize, snap,
   quit), and on the bare desktop a small system menu.

There is a short timeout before the shell gives up on the native model and moves
down the chain, so the panel is never blank for long. A couple of heavy apps
(Chromium and its kin) are deliberately skipped on the accessibility path, where
their enormous trees would stall the scan.

## Why native is best

Every fallback is a best effort at reconstructing a menu the app never meant to
share. The native path is the only one where you control exactly what appears and
how it is grouped, and it is the cheapest for the shell to read. If you are
building an app for Singularity, expose a real GTK4 menubar and actions, and let
the fallbacks serve everyone else. These interfaces are part of the public
[contracts](/docs/contracts/).
