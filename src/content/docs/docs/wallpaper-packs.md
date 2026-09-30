---
title: Wallpaper packs
description: How wallpaper providers and local wallpaper collections fit together.
---

Singularity shows wallpapers from providers. The built-in provider has the ID
`singularity`; plugins can register additional providers. In the interface,
choose a **Theme pack** and a **Wallpaper pack**. Online provider plugins are
available through Plugins; OCS and Bing are opt-in and disabled by default.

## The `.collection` file

A local wallpaper pack is described by a `.collection` file: a [GLib
KeyFile](https://docs.gtk.org/glib/struct.KeyFile.html) with a `[Collection]`
group.

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
| `Id` | no | Stable identifier; defaults to the filename without `.collection`. |
| `Name` | no | Display name; defaults to `Id`. |
| `Artist` | no | Artist attribution. |
| `Dir` | yes | Absolute path to the image directory. Files without it are skipped. |
| `Type` | no | Pack type; defaults to `static`. |

## How the desktop finds it

The shell checks these roots in order:

1. `<system data dir>/singularity/wallpaper-collections` for each XDG system
   data directory.
2. `<user data dir>/singularity/wallpaper-collections`.

When only the default roots are configured, the shell can also use its built-in
fallback at `<data dir>/backgrounds/singularity`.

## ArtistPack

[ArtistPack](https://gitlab.com/ncz-os/artistpack) 0.1 is an external format
for supplying packs. Singularity does not ship ArtistPack integration. A
provider plugin could serve its feeds and packs, while installed content can
use the collection layout above.

An ArtistPack `pack.yaml` identifies the pack, artist, display rights, and each
artwork's original file and variants:

```yaml
artistpack: "0.1"
pack: { id, title, version }
artist: { id, name }
rights: { copyright, license: "artistpack-display-license-1.0" }
artworks:
  - { id, title, original: { file, sha256, width, height, mime_type }, variants: [ { file, sha256, width } ] }
```

A `feed.yaml` lists pack manifests:

```yaml
artistpack_feed: "0.1"
feed: { id, title, description, updated }
packs:
  - { url: "https://.../pack.yaml" }
```
