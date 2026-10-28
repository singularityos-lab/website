---
title: Browser
description: Browse with tiles, tabs and bubbles, install web apps, sign in with passkeys, and drive the browser from other programs.
---

Browser is the web browser of Singularity. On Sinty OS it is installed from the
Store as an [SXI app](/docs/os/sxi-apps/), and its pages are drawn by
[Fotone](/docs/os/web-engine/).

## Tiles and tabs

A window can hold several **tiles**, pages shown side by side, each with its own
tabs. **New Tile** splits the window, and a tile can be moved to a window of its
own.

## Reading and marking up

- **Reader View** shows an article without the rest of the page.
- **Sketch on This Page** lets you draw over a page, then copy the sketch, save it
  as an image or add it to a note.

## Passwords and passkeys

Browser fills saved passwords and can import them from other browsers. Sites that
support passkeys let you sign in without a password: Browser offers to create a
passkey, and keeps it on this computer. A passkey on a phone or a security key
works too.

## Private windows

**New Private Window** keeps no history, cookies or site data after it closes, and
is never synced.

## Web apps

**Install as Web App** turns a site into an app of its own, with an entry in the
app list and its own window. Remove it from the same menu.

## Sync

**Sync Browser Data** keeps bookmarks, passwords and open tabs in step between your
devices. **Open Synced Tabs** shows the tabs open on the others.

## Extensions

Browser runs Chrome extensions, including content blockers written for the
declarativeNetRequest rules.

## Kiosk mode

`singularity-browser --kiosk <address>` opens a window that stays full screen and
cannot be left, and reloads the page on its own if it fails to load. It is meant
for dashboards and public screens. Start it from an autostart entry to have it
come up with the session.

## Driving Browser from other programs

Browser can be controlled by test tools and by agents.

- **WebDriver.** `singularity-webdriver --port=4444` starts a W3C WebDriver
  server. Selenium, WebdriverIO and other WebDriver clients can then drive
  Browser in its own session.
- **MCP.** `singularity-browser-mcp` offers the same session to an agent as an MCP
  server over standard input and output. It starts its own driver, or uses a
  running one with `--webdriver http://host:4444`. To drive Browser on another
  machine, run it over SSH: `ssh host singularity-browser-mcp`.

While Browser is being driven, a banner above the page tells the person at the
machine.

Some sites refuse automated sessions. `--undetectable`, accepted by both tools,
keeps the page from seeing that the session is automated. The banner still
shows.
