---
title: Creating Artist Packs
description: How to package a set of wallpapers as an Artist Pack the desktop can discover.
---

An **Artist Pack** is a directory of wallpaper images plus one small text file
that tells the desktop what to call it and who made it. This is everything the
Wallpaper Source selector in [Appearance](/docs/appearance/) needs to list your
pack alongside the built-in ones.

## Images

- **Format:** JPEG or PNG.
- **Size:** 3840×2160 (4K) is the convention the shell's own packs and its OCS
  importer both normalize to, so it is the safe default. Images are shown as
  a cover-cropped background, not stretched, so a different aspect ratio isn't
  a hard failure -- but a 16:9 source avoids any cropping surprise on a wide
  panel.
- Put every image for the pack in its own directory. One pack, one directory --
  don't mix multiple artists' work in the same folder, since the pack is the
  unit the selector shows and rotates.

## The `.collection` file

A pack is described by a `.collection` file: a plain [GLib
KeyFile](https://docs.gtk.org/glib/struct.KeyFile.html) (the same INI-like
format used elsewhere in Singularity), not JSON. It needs a single
`[Collection]` group:

```ini
[Collection]
Id=your-pack-id
Name=Your Pack's Display Name
Artist=Your Name
Dir=/absolute/path/to/your/images
Type=static
```

| Key | Required | Meaning |
| --- | --- | --- |
| `Id` | no | Stable identifier. Falls back to the `.collection` filename (without the extension) if omitted -- set it explicitly if you might rename the file later. |
| `Name` | no | Display name in the Wallpaper Source selector. Falls back to `Id`. |
| `Artist` | no | Shown alongside `Name` when it differs from it. |
| `Dir` | **yes** | Absolute path to the directory of images. A `.collection` file with no `Dir` is skipped entirely. |
| `Type` | no | Free-form; `static` is the convention for a plain image pack. |

Extra keys (a `Comment`, a `Homepage`) aren't read by the selector, but aren't
an error either -- feel free to carry your own metadata in the file for other
tooling, such as a packaging script.

## How the desktop finds it

The shell scans a list of search directories for `*.collection` files.
Dropping your `.collection` file into a directory the shell already scans (and
pointing `Dir` at wherever you put the images) is all that's needed -- there's
no registration step or database. If two `.collection` files declare the same
`Id`, the one found in the earlier search directory wins.

There's no prescribed archive or package format for distributing a pack --
it's just a directory of images plus one `.collection` file, so ship it
however makes sense for your platform (a distro package, an installer script,
or a plain download the user unpacks themselves).

## Getting it online

If you'd rather host your pack for others to find without packaging it
yourself, upload it to one of the providers the built-in **Browse online...**
picker already searches -- pling, openDesktop, KDE Look, or GNOME Look (see
[Appearance](/docs/appearance/)). Anyone running Singularity can then find and
import it as an Artist Pack directly from the desktop, with the provenance and
any licence you set on the upload shown honestly as "from &lt;provider&gt;,"
rather than presented as one of the desktop's own curated packs.
