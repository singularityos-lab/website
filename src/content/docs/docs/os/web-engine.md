---
title: The web engine
description: Fotone, the web engine behind Browser and every app that shows web content on Sinty OS.
---

Every web page on Sinty OS, in Browser or inside any other app, is drawn by
**Fotone**. Fotone follows WebKit, the engine of Safari, and adds the Sinty
platform on top.

## What it brings

- **Drawn on the GPU, straight into the desktop.** Pages are rendered into GPU
  buffers that the toolkit shows directly, without copies.
- **Part of the desktop.** The web view is a native widget of the toolkit, with the
  system theme, accent colour, fonts, gestures and animations.
- **Passwords and passkeys** come from the system keyring and security keys, in
  every app that shows web content.
- **Media.** Video and calls go through [Sinty Media](/docs/os/media/), and
  protected content such as streaming services works after you agree to download
  the decryption module the first time a site asks for it.
- **Memory.** Tabs you are not using go to sleep and wake up instantly. Compiled
  JavaScript is kept on disk and shared by every app, so a large web app opens
  faster the second time.
- **Sandboxing.** Each web process is confined with Landlock and seccomp before it
  starts.

## Apps made for WebKitGTK

Apps written for WebKitGTK, on GTK 4 or GTK 3, also run on Fotone with no change:
the system provides the libraries they expect, with the same interface, and the
pages they show are drawn by Fotone.

## Remote control

Browser can be driven by other programs through WebDriver and through an MCP
server, for automated tests and for agents.
