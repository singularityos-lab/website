---
title: Theming
description: The CSS variables Singularity exposes, and how to write a theme.
---

Singularity themes are CSS, driven by a set of named colors that the desktop keeps
in sync with the user's accent and their light or dark preference. A theme builds
on those variables rather than literal hex values, so it follows the accent and
the color scheme automatically. Use `alpha(@accent_color, x)` for tints instead of
inventing new fixed colors.

The light and dark stylesheets define the same names with different values, so the
same variable resolves correctly in either scheme. The accent variables are
injected at runtime by the style manager whenever the user changes their accent.

## Accent

Set at runtime from the user's choice, including standard GTK aliases so plain GTK
widgets follow along:

- `@accent_color`, `@accent` - the accent itself
- `@accent_bg`, `@accent_bg_color` - accent as a background
- `@accent_fg`, `@accent_fg_color` - readable foreground on accent
- `@selected_bg_color`, `@selected_fg_color`, `@theme_selected_bg_color`,
  `@theme_selected_fg_color` - GTK selection aliases mapped to the accent

## Backgrounds and surfaces

- `@window_bg`, `@window_bg_color` - the base window background
- `@surface_bg`, `@surface_raised`, `@surface_dim`, `@surface_mid`,
  `@surface_bright`, `@surface_alt` - the layered surface scale
- `@surface_overlay` - translucent overlay surfaces
- `@surface_scrim`, `@surface_scrim_heavy` - scrims behind modals and popovers
- `@card_bg`, `@card_bg_color`, `@card_hover_bg`, `@card_shade_color` - cards and
  their hover and shade states
- `@view_bg_color` - content views

## Text and edges

- `@text_color`, `@fg_color`, `@window_fg_color` - foreground text
- `@border_color`, `@borders` - separators and outlines
- `@shadow_color` - drop shadows
- `@window_tint` - the subtle wallpaper-aware tint applied over surfaces

## Shell surfaces

The pieces of the shell carry their own names so a theme can restyle them
without touching app chrome:

- `@panel_bg`, `@panel_fg`, `@panel_solid_bg` - the top panel, including its flat
  (solid) state
- `@dock_bg` - the dock
- `@overview_bg` - the overview
- `@titlebar_bg`, `@toolbar_bg`, `@headerbar_bg_color` - window and toolbar strips
- `@sidebar_bg_color`, `@secondary_sidebar_bg_color` - sidebars

## Semantic colors

- `@success_color`
- `@warning_color`
- `@error_color`, `@destructive_color`, `@destructive_hover`
- `@link_color`, `@link_active_color`

## GTK compatibility aliases

Several names mirror the standard GTK theme variables (`@theme_bg_color`,
`@theme_fg_color`, `@theme_base_color`, `@theme_text_color`, and the selection
aliases above) so unmodified GTK widgets pick up the right colors without special
handling.

## Start from the example

The `SingularityExample` theme is a documented reference: copy it, keep the
variable-based approach, and restyle from there. It is a template and is not
installed by default.

## Shipped themes

- `Singularity` - the default theme, installed by default.
- `Kids` - a playful theme, installed by default.

Themes live in the `singularity-themes` repository.
