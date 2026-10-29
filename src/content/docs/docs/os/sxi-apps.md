---
title: SXI apps
description: The signed, immutable app format of Sinty OS, the sxi command, and how to build and publish an app for it.
---

Sinty OS ships a small base system. More Singularity apps, such as Browser,
Notes, Photos and Tasks, are installed later from the Store as **SXI** apps.

An SXI app is one signed bundle. Before any of it runs, the system checks who
published it and that nothing was changed. Once installed it is mounted read-only
and verified as it is read, so an installed app cannot be altered on disk. SXI
apps use the platform libraries already in the system, so they stay small.

## Installing and removing

Use the Store, in the Sinty collection. From a terminal:

```bash
sxi refresh                  # fetch the latest list from your sources
sxi list                     # available apps, latest and installed build
sxi list -installed          # installed apps, active and previous build
sxi install dev.sinty.notes  # install, or move to the newest build
sxi remove dev.sinty.notes
sxi rollback dev.sinty.notes # go back to the build you had before
```

The system refreshes every collection every six hours, and as soon as the
network comes up after boot. After each refresh it installs any newer build of
the apps you already have, so they stay current without a click. The build you
had before stays on disk for `rollback`.

## Safety

- Every collection index and every app is signed with Ed25519. A publisher signs
  through a delegation from its root key, and a revoked key stops being accepted.
- The system remembers the newest release it has seen of each app, so nobody can
  push an older, vulnerable build back onto your machine.
- A collection is marked official only when its source file is part of the
  verified system image. A source you add yourself is never official.

## Building an app for SXI

Build your app with the prefix `/run/sxi/apps/<app id>` and the usual `bin`,
`lib` and `share` layout. The app is mounted there, so compiled-in paths,
translations and data point into its own mount:

```bash
meson setup build --prefix /run/sxi/apps/org.example.Notes --libdir lib
ninja -C build
DESTDIR=$PWD/stage ninja -C build install
```

Link against the system libraries (GTK, SIT, libsingularity, Fotone) instead of
bundling them. Leave headers, `pkgconfig` and `vala` files out of the payload.

When installed, the system links these files from the app's `share` into
`/run/sxi/share`, which comes after the system data directories, so an app can
never replace a system file:

| From the app | Becomes |
| --- | --- |
| `share/applications/<id>.desktop` | A launcher entry that starts the app from its mount |
| `share/icons/hicolor/scalable/apps/<id>.svg` | The app icon, found by name |
| `share/dbus-1/services` | D-Bus activation, only for names the app owns |
| `share/glib-2.0/schemas` | Settings schemas, compiled; every schema ID must start with the app ID and every path must sit under it |
| Search providers, app settings, share targets, file actions, widgets, shell plugins | Registered with the desktop |

### The spec file

```json
{
  "id": "org.example.Notes",
  "name": "Notes",
  "version": "1.2.0",
  "sequence": 4,
  "entries": [
    { "arch": "amd64", "image": "bin/notes", "personality": "linux" }
  ]
}
```

- `sequence` is the build number. It must grow with every release; the system
  refuses a build whose sequence is not higher than one it already accepted.
- `entries` lists one executable per architecture (`amd64` or `arm64`), relative
  to the payload.
- `resources` and `icons` list extra paths the manifest should name, `grants`
  and `portals` the authority the app asks for.

### Signing and packing

```bash
sxi keygen -o root           # once per publisher: root.key and root.pub
sxi keygen -o release
sxi delegate -root root.key -key release.pub -purpose release -o release.certs

sxi build -spec app.json -payload stage/run/sxi/apps/org.example.Notes \
  -root root.pub -key release.key -certs release.certs -o Notes.sxi
sxi verify -roots roots Notes.sxi
sxi pack -roots roots -o org.example.Notes-4.sxi Notes.sxi > pack.json
```

Keep `root.key` offline: it only signs delegations. `pack` writes the
reproducible erofs image and prints the size, digest, verity root hash and slot
ID that go into the collection index.

### Publishing a collection

A collection is three files under one URL: `index.json`, its signature
`index.json.cose` and the delegation `index.certs`.

```bash
sxi keygen -o index
sxi delegate -root root.key -key index.pub -purpose index -o index.certs
sxi index init -root root.pub -name "Example apps" -o index.json
sxi index add -index index.json -pack pack.json \
  -url https://example.org/org.example.Notes-4.sxi -name Notes
sxi index sign -index index.json -key index.key -certs index.certs -root root.pub
```

Every `add` and `remove` raises the index sequence. Upload the image and the
three index files, then add the source on a machine:

```json
{"name": "example", "url": "https://example.org/apps"}
```

saved as `/etc/sinty/sxi/sources.d/example.json`, with `root.pub` copied to
`/usr/share/sinty/sxi/roots`. Only roots in the system trust store can publish
anything installable.

## The daemon API

`sxid` is on the system bus as `dev.sinty.SXI1`, object `/dev/sinty/SXI1`. The
Store uses it, and so can any client:

| Method | Result |
| --- | --- |
| `ListAvailable() -> s` | Apps of every collection as JSON, each with `releases` and, if installed, `installed` |
| `ListInstalled() -> s` | Installed apps as JSON, with `active` and `previous` builds |
| `Refresh()` | Fetch every collection again |
| `Install(s id)` | Install or update |
| `Remove(s id)` | Remove an app and its images |
| `Rollback(s id)` | Switch back to the previous build |

Signals: `Changed()`, `Progress(s id, s stage, x done, x total)` and
`Finished(s id, s error)`, where an empty error means success. Users with a
login account may change apps.

```bash
gdbus call --system --dest dev.sinty.SXI1 --object-path /dev/sinty/SXI1 \
  --method dev.sinty.SXI1.ListInstalled
```

For client work without root, `sxid -session -extract -roots DIR -state DIR
-run DIR -sources DIR` serves on the session bus and extracts images instead of
mounting them; `SXI_BUS=session sxi list` talks to it.
