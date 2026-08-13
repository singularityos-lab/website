---
title: libsingularity primitives
description: A reference of the UI building blocks every Singularity app reuses.
---

libsingularity is the shared GTK4 framework under the shell and every first-party
app. Build from its primitives and your app inherits the desktop's look, behavior,
and accent for free; app-specific classes are for the genuinely unique parts only.

Use them from a [vetro](/docs/vetro/) file like any other widget, and configure
them in Vala. The signatures below are the everyday ones, with the options and
methods you reach for most; the exact, current API always lives in the installed
headers.

## Window and the bubble bar

### Window

```vala
Window (Gtk.Application app)
```

The base app window. It owns the toolbar, an animated sidebar, window-state
persistence, and the [bubble bar](/docs/bubbles/).

- Options: `flat` (bool), and the read-only `content_area`, `sidebar_area`,
  `toolbar`, `force_ssd`.
- Layout: `set_content(Widget)`, `set_sidebar(Widget)`,
  `set_sidebar_visible(bool)`, `set_sidebar_width(int)`.

The controls live as bubbles you add to the window:

- `add_bubble_icon(string icon, string tooltip, BubbleAction action)` returns the `Button`
- `add_bubble_text(string label, BubbleAction action)`
- `add_bubble_suggested(string label, BubbleAction action)` (accent pill)
- `add_bubble_widget(Widget w)`
- `add_bubble_label(string text, bool dimmed = false)`
- `add_bubble_menu(string icon, string tooltip, Gtk.Popover popover)`
- `add_bubble_search(string placeholder, BubbleSearchAction action)` returns a `SearchBubble`

Choose how the bar relates to your content:

- **Overlay, fading on hover** for full-bleed content like video or photos:
  `set_bubbles_on_hover(true)`.
- **Reserve a strip, always visible** for dense content like lists, tables, or
  code: call `Singularity.Widgets.apply_view_edge(your_scrolled_content)`, which
  reserves room (55 px in client-side-decoration mode) so nothing hides under the
  bubbles.

See [Bubble navigation](/docs/bubbles/) for the why and the two modes in depth.

### HoverControls

```vala
HoverControls ()
```

The widget behind the bubble bar. You normally do not build it directly: a window
creates it on the first `add_bubble_*` call. If you need one standalone,
`HoverControls.with_window_bubbles(window)` builds it with the drag grip and close
bubble, and `set_content(Widget)`, `add(Widget)`, `add_text_button(...)`,
`add_suggested_button(...)`, and `add_separator()` fill it.

### ToolBar

```vala
ToolBar ()
```

The titlebar strip used in server-side-decoration mode. `set_title(string)`,
`set_title_widget(Widget?)`, `pack_start(Widget)`, `pack_end(Widget)`; exposes
`title_label`, `start_box`, `end_box`, `close_btn`.

## Preferences

### PreferencesGroup

```vala
PreferencesGroup (string? title = null, string? description = null)
```

A card holding a titled set of rows. `add_row(Widget)`, `remove_row(Widget)`,
`clear()`, `get_rows()`; signal `row_added`.

### PreferencesPage

```vala
PreferencesPage ()
```

Holds groups with the standard margins. `append_group(PreferencesGroup)`.

### PreferencesWindow

```vala
PreferencesWindow (Gtk.Application app, Gtk.Widget preferences_page, bool use_modal = true)
```

A dialog wrapping a preferences page.

### PreferencesRow

```vala
PreferencesRow ()
```

The base class the rows below extend.

### ActionRow

```vala
ActionRow (string title, string? subtitle = null, string? icon_name = null)
```

Title, optional subtitle, leading icon. Options: `title`, `subtitle`,
`icon_name`. `add_prefix(Widget)`, `add_suffix(Widget)`; signal `activated`.

### SwitchRow

```vala
SwitchRow (string title, string? subtitle = null, bool active = false)
```

An action row with a toggle. Options: `active`, and the `switch_btn` to bind to
GSettings. The whole row toggles on click.

### SpinRow

```vala
SpinRow (string title, string? subtitle = null, double min, double max, double step, double value)
```

A numeric row. Options: `value`, and the `spin_btn` to bind.

### EntryRow

```vala
EntryRow (string title, string? icon_name = null)
```

A row with a text field. Options: `text`. Signals: `entry_changed`,
`entry_activated`.

### PasswordRow

```vala
PasswordRow (string title)
```

An entry row with masked input and a reveal toggle.

### EmailRow

```vala
EmailRow (string title)
```

An entry row that validates an email address and shows icon feedback.

### ExpanderRow

```vala
ExpanderRow (string title, string? subtitle = null, string? icon_name = null)
```

Expands to reveal child rows. Options: `expanded`. `add_row(Widget)`,
`clear_rows()`.

### SearchableExpanderRow

```vala
SearchableExpanderRow (string title, string? subtitle = null, string? icon_name = null)
```

An expander with a search field over its rows. Exposes `search_entry`, `list_box`.

### SelectionRow

```vala
SelectionRow (string title, string[] items, string current = "")
SelectionRow.with_details (string title, string[] items, string[]? subtitles, GLib.Icon?[]? icons, string current = "")
SelectionRow.with_options (string title, Gee.ArrayList<Singularity.Core.AppSettingOption> options, string current = "")
```

A single choice from a filterable list. Options: `current_value`.
`set_items(string[])`; signal `selected`.

### ConfirmRow

```vala
ConfirmRow (string title, string? subtitle = null, string? icon_name = null)
```

A row whose button expands into a confirm-or-cancel prompt. Options:
`confirm_label`, `cancel_label`; signal `confirmed`.

### ColorSchemeRow

```vala
ColorSchemeRow (string title, Gee.ArrayList<ColorTheme> themes, string current)
```

A grid of color-scheme swatches. Options: `current_scheme`; signal
`scheme_selected`.

### ColorSchemePreview

```vala
ColorSchemePreview (ColorTheme theme)
```

A single scheme swatch. Options: `selected`.

### ColorTheme

```vala
ColorTheme (string id, string name, string background, string foreground, string[] palette)
```

The data type a scheme uses: an id, a name, background and foreground hex, and a
16-entry palette.

## Controls

### IconButton

```vala
IconButton (string icon_name, string? tooltip = null, int size = 16)
```

A frameless icon button. Options: `icon`, `icon_size`.

### CircularButton

```vala
CircularButton (string icon_name, string? tooltip = null, int size = 16)
```

An icon button drawn as a circle.

### CloseButton

```vala
CloseButton ()
```

An icon button pre-set to the window-close icon.

### ColorPickerButton

```vala
ColorPickerButton (Gdk.RGBA? initial = null)
```

A swatch that opens a color picker. Options: `color`; signal `color_changed`.

### QuickSettingTile

```vala
QuickSettingTile (string title, string icon_name, bool is_active = false)
```

The quick-settings tile. Options: `title`, `subtitle`, `icon_name`, `active`,
`n_states`, `state`, `auto_toggle`.

### SearchEntry

```vala
SearchEntry ()
```

A search field. Options: `text`, `placeholder_text`, and the inner `entry`; signal
`search_changed`.

### SegmentedControl

```vala
SegmentedControl (Gtk.Stack? stack = null)
```

A segment strip. Bind a `Gtk.Stack`, or `add_option(name, label)` and
`set_active(name)`; option `active_option`; signal `selected`.

## Dialogs

### AppDialog

```vala
AppDialog (Gtk.Application app, bool use_modal = false, bool show_close = true)
```

A lightweight modal window with a card and a close button. Put content in
`content_box`; open and close with `open_dialog()` and `close_dialog()`; option
`closable`.

### ConfirmDialog

```vala
ConfirmDialog (Gtk.Application app, string title, string? icon_name, string? description, string primary_label, ActionStyle primary_style = ActionStyle.DEFAULT)
```

A confirmation dialog with a primary action and an optional secondary one
(`set_secondary(label, style)`), plus an injectable `custom_area`. Listen to
`response`.

## Navigation

### AppSidebar

```vala
AppSidebar (int width = 200)
```

A scrollable navigation column; append widgets to its `box`. Option:
`sidebar_width`.

### SidebarRow

```vala
SidebarRow (string icon_name, string text)
```

A navigation entry. `set_active(bool)`, `update_icon_name(string)`.

### SidebarSectionLabel

```vala
SidebarSectionLabel (string text)
```

An uppercase, dimmed section heading.

### MenuRow

```vala
MenuRow (string label_text, string? icon_name = null)
```

A labelled, optionally-iconned row for use in a context menu.

### ContextMenu

```vala
ContextMenu (Gtk.Widget parent_widget)
```

A popover menu. `add_item(label, icon, callback, css_class)`, `add_widget(Widget)`,
`add_separator()`; the static `ContextMenu.attach_editable(host)` adds the standard
text-editing menu on secondary click.

### TabBar / TabButton

```vala
TabBar (Gtk.Notebook notebook)
TabButton (Gtk.Widget page)
```

A tab strip mirroring a notebook, made of tab buttons. You normally use
`TabContainer` rather than these directly.

### TabContainer

```vala
TabContainer ()
```

A notebook plus its tab bar. `add_tab(Widget, title)`, `remove_tab(Widget)`,
`get_n_pages()`; signals `page_added`, `page_removed`, `switch_page`. The bar shows
once there are two or more pages.

## Pages

### StatusPage

```vala
StatusPage ()
```

A centered empty state. Options: `icon_name`, `title`, `description`, `child`.

### WelcomePage

```vala
WelcomePage ()
```

A first-run split layout. Options: `app_icon_name`, `title`, `subtitle`; signal
`close_requested`.

### CalendarMonthView / CalendarWeekView / CalendarDayView

```vala
CalendarMonthView (CalendarManager mgr)
CalendarWeekView  (CalendarManager mgr)
CalendarDayView   (CalendarManager mgr)
```

The three calendar layouts, each driven by a calendar manager.

### CalendarNavPicker

```vala
CalendarNavPicker ()
```

A month-and-year picker. `set_date(DateTime)`, option `displayed_month`; signals
`date_selected`, `today_clicked`.

### CalendarEventChip

```vala
CalendarEventChip (CalendarEvent evt)
```

The chip that represents an event in the calendar views.

### ScreenshotCarousel

```vala
ScreenshotCarousel (string[] urls)
```

A carousel of images loaded from URLs. `set_image(index, paintable)`; option
`count`.

## Visual

### Carousel

```vala
Carousel ()
```

A swipeable page stack. `append_page(Widget)`, `scroll_to_index(i, animate)`,
`clear()`; options `n_pages`, `position`, `show_indicator`, `interactive`,
`transition_duration`; signal `page_changed`.

### Chip / ChipBar

```vala
Chip (string id, string? label = null)
ChipBar ()
```

Pill tags. A `ChipBar` holds chips: `add_chip(id, label)`,
`update_chip_label(id, label)`, `remove_chip(id)`, `set_active(id)`; options
`ellipsize_labels`, `min_label_chars`, `max_label_chars`, `reorderable`,
`detachable`; signals `chip_activated`, `chip_closed`, `chip_detached`,
`chips_reordered`. Set `detachable` and handle `chip_detached` to move the
corresponding page into another window when its chip is dropped outside the
current one.

### CircularProgress

```vala
CircularProgress (int diameter = 30)
```

A progress ring. Options: `fraction` (0 to 1), `label`, `color`, `diameter`.

### CommandPalette / CommandPaletteItem

```vala
CommandPalette ()
CommandPaletteItem (string icon_name, string title, string? subtitle, string? hotkey, string category, PaletteAction action)
```

A searchable command list. `set_items(CommandPaletteItem[])`, `open()`, `close()`;
signal `close_requested`. Each item carries an icon, title, optional subtitle and
hotkey, a category, and an action.

### DataListView / GroupedDataListView

```vala
DataListView ()
GroupedDataListView ()
```

A scrollable `Gtk.ColumnView` with Singularity styling. `set_selection_model(...)`,
`add_column(title, factory)`; signals `row_activated`, `background_right_clicked`.
The grouped variant adds collapsible groups (signal `group_toggle_requested`).

### DataGridView

```vala
DataGridView ()
```

A scrollable `Gtk.GridView`. `set_selection_model(...)`, `set_factory(...)`; options
`min_columns`, `max_columns`; signals `item_activated`, `background_right_clicked`.

### MediaPlayerCard

```vala
MediaPlayerCard ()
```

An MPRIS player card with art, metadata, and transport controls, discovered
automatically. Option: `always_visible`.

### OverlaySearch / OverlaySearchItem

```vala
OverlaySearch ()
OverlaySearchItem (string id, string icon_name, string title, string? subtitle = null, string? hotkey = null, string? category = null)
```

A centered floating search surface. `set_items(...)`, `open()`, `close()`; options
`placeholder`, `show_list`, `internal_filter`, `empty_text`; signals
`query_changed`, `item_activated`, `entry_activated`, `close_requested`.

### SearchBubble

```vala
SearchBubble (string placeholder = "Search...")
```

The search pill used in the bubble bar. Options: `text`, `placeholder`;
`grab_focus_entry()`, `clear()`; signal `search_changed`.

### BrowserPill

```vala
BrowserPill ()
```

A floating address pill (domain, security icon, reload). `update_from_uri(uri)`;
signal `reload_requested`.

### ColumnBrowser / ColumnBrowserPane

```vala
ColumnBrowser ()
ColumnBrowserPane (int width = 240)
```

A Finder-style column browser. `push_pane(width)`, `pop_to(index)`,
`get_pane(idx)`, `clear()`; option `pane_count`; signals `pane_added`,
`pane_removed`. A pane exposes `list_box` and `scroll`, plus `set_empty(...)` and
`set_filled()`.

### SparkLine

```vala
SparkLine (int size, string? color = null, string? fill = null)
```

A tiny live chart. `push(double)` adds a normalized value and redraws;
`set_color(hex)`.

## Editor

### SourceView

```vala
SourceView (GtkSource.Buffer? buf = null)
SourceView.with_buffer (GtkSource.Buffer buf)
```

A `GtkSource.View` with Singularity defaults and a built-in context menu. Options:
`toolbar_top_padding`, `use_context_menu`.

### PageCanvas

```vala
PageCanvas ()
```

A paper canvas with margins. Options: `page_width_mm`, `left_margin_mm`,
`right_margin_mm`. `set_content_widget(Widget)`, `show_ruler(bool)`; signal
`margins_changed`.

### StyleChooser

```vala
StyleChooser ()
```

A paragraph-style dropdown (body, headings, quote, code, lists).
`set_current_style(id)`; signal `style_selected`.

### FindReplaceBar

```vala
FindReplaceBar ()
```

A find-and-replace bar. Options: `reveal_child`, `find_text`;
`set_match_info(current, total)`; signals `find_next`, `find_prev`, `replace_one`,
`replace_all`, `closed`.

### FloatingFormatBar

```vala
FloatingFormatBar ()
```

A formatting popover. Signals `format_toggled` (bold, italic, underline,
strikethrough), `color_changed` (text or highlight), `link_requested`,
`alignment_changed`.

### RulerWidget

```vala
RulerWidget ()
```

A horizontal ruler with draggable margin handles. Options: `page_width_mm`,
`left_margin_mm`, `right_margin_mm`; signal `margins_changed`.

### MiniBar

```vala
MiniBar (string? color = null)
```

A slim indicator bar used alongside the editor ruler.

## See them all running

The reference is the [demo app](/docs/build-an-app/), `singularity-demo`. It is a
template that puts the primitives on screen, so the fastest way to see a widget in
context is to build the demo and read its `.vetro` and Vala side by side.
