---
title: Store
description: Find and install apps from Flathub and the Sinty collection.
---

Store is where you find more apps for Singularity. It browses Flathub, the
catalog the rest of the Linux desktop uses, and on Sinty OS it also lists the
optional Singularity apps.

The first time you open it, a welcome screen introduces the catalog.

## How apps are installed

- **On Sinty OS**, Flathub apps are installed, updated and removed with
  [cpak](/docs/install-cpak/). The catalog, the trending lists and the reviews
  still come from Flathub. Flatpak itself is not installed.
- **On other distributions**, Store keeps using Flatpak with the Flathub remote.

## The Sinty collection

On Sinty OS, Store also lists optional Singularity apps that are not part of the
system image. They are installed as SXI packages built for Sinty OS. Install only the ones you
need, and remove them like any other app.

## Browsing

The sidebar organizes the catalog into Featured (editor's picks and new and
noteworthy), Popular, Recently updated, and Categories covering the usual
ground from Development to Games to Office. There is also a search box that
queries Flathub directly. An Installed page lists the Flatpaks already on your
machine, and an Updates page collects what has a new version, with an Update all
button.

## App pages

Opening an app shows its icon, developer, and summary, a carousel of
screenshots, the full description, and the permissions it asks for, such as
network, audio, or file access. Where Flathub has them, star ratings and user
reviews appear too.

## Installing

The Get button installs the app and shows the live install log as it runs, so you can watch progress and see any errors. Updating and removing work
the same way, from the app page or the Installed and Updates lists.

:::caution[Still in development]
Store is an early storefront. Outside Sinty OS it needs Flatpak set up with the
Flathub remote. Expect rough edges around error handling and offline behavior.
:::
