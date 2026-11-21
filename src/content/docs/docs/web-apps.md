---
title: Web apps
description: Turn a website into an app with its own window and dock icon, install the ready-made ones from Store, and manage them from the command line.
---

A web app is a website that runs as an app of its own: its own entry in the app
list, its own window and dock icon, its own sign-ins, and no tabs or address bar.
Web apps run on [fotone](/docs/os/web-engine/), the engine of Browser.

## From Store

Store has a **Web Apps** category with ready-made apps for video, music, mail,
chat and work, among them Netflix, YouTube, Prime Video, Disney+, Spotify, Gmail,
Google Docs, Notion, WhatsApp, Telegram and Figma. Each kind of screen gets its
own selection: on a TV, Store shows the ones made for the TV.

## From any site

Open the site in Browser, then choose **Install as Web App…** from the menu.
Give it a name and choose **Install**. Browser picks the best icon the site
offers.

The web app stays on its own site and the sites under it. Links to other sites
open in Browser. When another app opens a link to the web app's site, the web
app opens it.

To remove a web app, open it and choose **Remove Web App** from its menu.

## What a web app keeps

Each web app has a profile of its own: cookies, sign-ins, site data and
permissions are kept apart from Browser and from every other web app. Signing
out of a site in Browser does not sign the web app out, and the other way round.

## On a TV

Web apps declared for the TV open full screen without the app header, so the
site fills the screen and the remote drives it. See
[Singularity on a TV](/docs/tv/).

## From the command line

```sh
singularity-browser --install-webapp <id> <url> <name> [<form factors>] [<icon url>]
singularity-browser --uninstall-webapp <id>
singularity-browser --webapp <id> [<url>]
```

- `<id>` names the app; the desktop entry becomes
  `dev.sinty.browser.WebApp_<id>.desktop`.
- `<form factors>` lists the screens the app is made for, separated by `;`, for
  example `desktop;tablet;phone;tv`.
- `--webapp` opens an installed web app, optionally on a page of its site.

Web apps live in `~/.local/share/singularity/browser/webapps/`.
