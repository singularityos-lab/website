---
title: Build from source
description: Build the full desktop, or a single component, with meson.
---

Today, running Singularity means building it. This page covers the full build
and building a single component on its own.

:::danger[Pre-release: install at your own risk]
Singularity is in active development. Building and installing it touches your
system and carries real risk: it has been tested on several machines, but there is
no guarantee it will not break something, or, worse, leave the device unable to
boot. Try it on a spare machine or a virtual machine, and back up anything you
care about first.

So far it has been tested only on Vanilla OS 2 Orchid, Vanilla OS 3 Reunion,
Debian Sid, and Ubuntu 26.04 (Resolute Raccoon). Other systems may not work.

Singularity always installs into the self-contained prefix `/opt/local`, never
into the system prefix. It runs from there because the session adds `/opt/local`
to `PATH`, `LD_LIBRARY_PATH` and `XDG_DATA_DIRS`. This keeps the system clean
(remove it with `rm -rf /opt/local`) and works on immutable systems where `/usr`
is read-only.
:::

## Vetro

The build needs the `vetro` transpiler on your `PATH` before you start, since
meson calls it to turn the `.vetro` files into GTK `.ui`. Install it first.

The `vetro` transpiler is a separate program, kept in
[its own repository](https://github.com/singularityos-lab/vetro), and the build
does not fetch it for you. The quickest way is to download the prebuilt binary
from the latest release, picking the matching architecture:

```sh
case "$(uname -m)" in
  x86_64)        arch=amd64 ;;
  aarch64|arm64) arch=arm64 ;;
  *) echo "unsupported architecture: $(uname -m)"; exit 1 ;;
esac
curl -L -o vetro \
  "https://github.com/singularityos-lab/vetro/releases/latest/download/vetro-linux-$arch"
chmod +x vetro
sudo install -Dm755 vetro /usr/local/bin/vetro
```

The `releases/latest/download/` path always resolves to the newest release, so
the command does not need updating between versions. Check the result with
`vetro --version`.

On immutable distributions, or anywhere `/usr/local/bin` is not writable, install
it into your home instead:

```sh
install -Dm755 vetro ~/.local/bin/vetro
```

Make sure `~/.local/bin` is on your `PATH`; if it is not, add it (for example with
`export PATH="$HOME/.local/bin:$PATH"` in your shell profile).

Prefer to build it yourself? It is a small Go tool (Go is already in the
dependency lists below):

```sh
git clone https://github.com/singularityos-lab/vetro.git
cd vetro
go build -o vetro .
sudo install -Dm755 vetro /usr/local/bin/vetro
```

Confirm it resolves with `which vetro` before building; meson calls it by name to
turn the `.vetro` files into GTK `.ui`.

## What you need

The build is GTK4 and Vala throughout, driven by meson, and it pulls in a fair
number of libraries. The shell uses GTK4, gtk4-layer-shell, VTE, libpeas,
PulseAudio, NetworkManager, UPower, polkit, libsoup, and Tracker, plus the Wayland
and X libraries; the apps add GtkSourceView, GStreamer, GNOME Online Accounts,
libsecret, poppler, and WebKitGTK; the xdg-desktop-portal-singularity backend also
links gtk4-layer-shell; and the labwc compositor brings the usual wlroots stack. You also need the build tools (meson, ninja, Vala, git, gettext,
pkg-config, gobject-introspection, wayland-scanner, scdoc) and the `vetro`
transpiler on your `PATH`, since the build invokes it to turn `.vetro` files into
GTK `.ui`. See [vetro](/docs/vetro/).

:::caution[These commands are generic]
The lists below are a starting point, not a guarantee. Package names and
availability change between distributions and releases, so check each one against
your own distro's repositories and adjust before running them.
:::

On Ubuntu or Debian:

```sh
sudo apt install \
  build-essential meson ninja-build valac git gettext pkg-config scdoc golang-go \
  gobject-introspection wayland-protocols \
  libgtk-4-dev libglib2.0-dev libgee-0.8-dev libjson-glib-dev libpeas-2-dev \
  libgtk4-layer-shell-dev libdecor-0-dev libgtksourceview-5-dev libvte-2.91-gtk4-dev \
  libgnome-desktop-4-dev libgoa-1.0-dev libgoa-backend-1.0-dev \
  libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev libpipewire-0.3-dev \
  libpulse-dev libnm-dev libupower-glib-dev \
  libpolkit-agent-1-dev libpolkit-gobject-1-dev libsoup-3.0-dev \
  libtracker-sparql-3.0-dev libsecret-1-dev libgudev-1.0-dev librsvg2-dev \
  libpoppler-glib-dev libwebkitgtk-6.0-dev libxml2-dev \
  libpango1.0-dev libcairo2-dev libpixman-1-dev libdrm-dev libinput-dev \
  libxkbcommon-dev libwayland-dev libxcb1-dev libxcb-ewmh-dev libxcb-icccm4-dev \
  libatspi2.0-dev libdbusmenu-glib-dev libsystemd-dev libpng-dev \
  libsodium-dev libgcrypt20-dev libpam0g-dev \
  libseat-dev libudev-dev libgbm-dev libdisplay-info-dev libliftoff-dev hwdata xwayland
```

On Arch:

```sh
sudo pacman -S --needed \
  base-devel gcc go meson ninja vala git gettext scdoc \
  gobject-introspection wayland-protocols \
  gtk4 glib2 libgee json-glib libpeas-2 gtk4-layer-shell libdecor gtksourceview5 vte4 \
  gnome-desktop gnome-online-accounts gstreamer gst-plugins-base libpipewire \
  libpulse networkmanager upower polkit libsoup3 tinysparql libsecret \
  libgudev librsvg poppler-glib webkitgtk-6.0 libxml2 pango cairo pixman \
  libdrm libinput libxkbcommon wayland libxcb xcb-util-wm at-spi2-core \
  libdbusmenu-glib systemd libpng libsodium libgcrypt pam \
  seatd mesa libdisplay-info libliftoff hwdata xorg-xwayland
```

On Fedora:

```sh
sudo dnf install \
  @development-tools meson ninja-build vala git gettext pkgconf-pkg-config scdoc golang \
  gobject-introspection-devel wayland-protocols-devel \
  gtk4-devel glib2-devel libgee-devel json-glib-devel libpeas-devel \
  gtk4-layer-shell-devel libdecor-devel gtksourceview5-devel vte291-gtk4-devel \
  gnome-desktop4-devel gnome-online-accounts-devel \
  gstreamer1-devel gstreamer1-plugins-base-devel pipewire-devel \
  pulseaudio-libs-devel NetworkManager-libnm-devel upower-devel \
  polkit-devel libsoup3-devel tinysparql-devel libsecret-devel libgudev-devel \
  librsvg2-devel poppler-glib-devel webkitgtk6.0-devel libxml2-devel \
  pango-devel cairo-devel pixman-devel libdrm-devel libinput-devel \
  libxkbcommon-devel wayland-devel libxcb-devel xcb-util-wm-devel \
  at-spi2-core-devel libdbusmenu-devel systemd-devel libpng-devel \
  libsodium-devel libgcrypt-devel pam-devel \
  libseat-devel mesa-libgbm-devel libdisplay-info-devel libliftoff-devel hwdata-devel xorg-x11-server-Xwayland-devel \
  grim cmake
```

:::note[Qt apps following dark/light and accent]
For Qt apps (Dolphin, Konsole, KWrite, and the like) to follow the Singularity
dark/light and accent settings, the Qt 6 `xdgdesktopportal` platform theme
plugin must be present at runtime. It ships with Qt 6 qtbase: Debian/Ubuntu
`qt6-base`, Arch `qt6-base`, Fedora `qt6-qtbase-gui`. The session exports
`QT_QPA_PLATFORMTHEME=xdgdesktopportal` so Qt reads the colour scheme and accent
from the Singularity settings portal.
:::

:::note[Global menu for third-party GTK apps]
The panel shows the focused window's menu bar. First-party Singularity apps
export it natively, but third-party GTK apps need the `appmenu-gtk-module` GTK
module present at runtime, otherwise they never publish a menu and the panel
falls back to a minimal entry. Package names: Debian/Ubuntu/Vanilla OS
`appmenu-gtk3-module` (add `appmenu-gtk2-module` for GTK 2 apps), Arch
`appmenu-gtk-module` (AUR). Fedora does not ship it in the official repositories;
it is available from COPR. Firefox is a special case: it exports its menu over
X11 only, so the global menu appears only when Firefox runs under XWayland
(`MOZ_ENABLE_WAYLAND=0`), not on native Wayland.
:::

labwc always builds `wlroots` from source as part of the build and links it
statically, so a known-good wlroots is used regardless of what the distro
ships. You do not need a system `wlroots` package (if one is installed it is
ignored, so there is no reason to remove it).

wlroots' DRM backend (needed for real hardware sessions, as opposed to running
nested) only builds when `hwdata`, `libdisplay-info` (>=0.2.0), `gbm` (Mesa),
`libdrm`, `libseat`, and `libudev` are all present; the lists above include
them. On Fedora the pkg-config file for hwdata ships in `hwdata-devel`, not
`hwdata`, which is why it is listed that way. If `wlroots` reports
`drm-backend: NO` during the build, one of those is missing. The optional
Vulkan renderer additionally needs `glslang`.

## The full build

The meta repo wires everything together as submodules:

```sh
git clone --recurse-submodules https://github.com/singularityos-lab/singularity-desktop.git singularity-desktop
cd singularity-desktop
make compile
```

`make install` writes the full install to `/opt/local`: binaries, bundled
libraries, the portal and systemd wiring, the icon theme, and the session entry.
(`make deploy-host` is a deprecated alias that now just runs `make install`; the
two were unified into one process.) Run Singularity from inside its session for
the `/opt/local` environment to apply.

## Upgrading an existing build

Pull the latest sources (the submodules move too, so update them) and rebuild:

```sh
git pull --recurse-submodules
make compile
make install
```

If the shell is already running, reload it in place: press `Super+Tab`, type
`r`, and submit, then wait a moment for the shell to come back. For larger
changes (compositor, libraries, session) skip the in-place reload and reboot
instead.

## Immutable systems: host runtime libraries

On immutable distributions you install into `/opt` with `make install`, but the
shared libraries Singularity links against still have to be present on the host
image. On Vanilla OS 3 Reunion (Debian-based) the packages to layer onto the host
are:

```
libgtk4-layer-shell0
libliftoff0
libpeas-2-0
libseat1
libxcb-composite0
libxcb-errors0
libxcb-ewmh2
libxcb-icccm4
libxcb-render-util0
libxcb-xinput0
xdg-desktop-portal-wlr
libnss3-tools
libgtksourceview-5-0
appmenu-gtk3-module
```

:::caution
These are the exact names for Vanilla OS 3 Reunion. The equivalent runtime packages
exist under different names on other distributions, so check them against your own
repositories.
:::

## Build a single component

Each component builds on its own with meson, as long as `libsingularity` is
installed and discoverable via `pkg-config`:

```sh
meson setup build
meson compile -C build
```

If `pkg-config --exists singularity-1.0` fails, point it at the install prefix:

```sh
export PKG_CONFIG_PATH=/usr/local/lib64/pkgconfig:$PKG_CONFIG_PATH
```

See [Build an App](/docs/build-an-app/) for the app workflow, and
[Repositories](/docs/repositories/) for how the pieces fit together.
