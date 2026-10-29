---
title: The web engine
description: How Fotone renders web content on Sinty OS, how an app embeds it, and the settings and limits a developer can rely on.
---

Every web page on Sinty OS, in Browser or inside any other app, is drawn by
**Fotone**. Fotone follows WPE WebKit upstream at a pinned release and replaces
the toolkit port with the Sinty platform: pages render into GPU buffers that the
toolkit composites directly, and input, theme, keyring, media and sandboxing come
from the desktop.

## Embedding a web view

Write your app against **WebKitGTK 6.0** (GTK 4), exactly as on any other Linux
system. On Sinty OS, `libwebkitgtk-6.0.so.4` and `libjavascriptcoregtk-6.0.so.1`
are provided by Fotone with the same binary interface, so the same build runs
everywhere and gets the Sinty features on Sinty OS without code changes.

```vala
var view = new WebKit.WebView ();
view.load_uri ("https://sinty.dev");
window.child = view;
```

Apps on GTK 3 that link `libwebkit2gtk-4.1.so.0` also run unchanged: that
library paints into its own GTK 3 widget and maps the older API (web contexts,
JavaScript results, website data flags) onto the engine.

What the app gets on Sinty OS:

| Feature | Behaviour |
| --- | --- |
| Theme | The system accent colour, light or dark scheme and fonts reach pages as CSS system colours and `prefers-color-scheme`. |
| Passwords and passkeys | Form passwords and WebAuthn come from the system keyring and FIDO security keys. |
| Media | Audio, video and WebRTC go through [Sinty Media](/docs/os/media/), with hardware decoding where the GPU supports it. |
| Protected content | The Widevine module is downloaded from Google the first time a site asks for it, after the user agrees. |

## Web apps with a window material

A page can ask for a translucent window so the desktop shows through its
background:

```html
<meta name="sinty-material" content="liquid">
```

`glass` and `blur` are also accepted. The page must leave its own background
transparent for the effect to be visible.

## Process model and memory

Two limits keep many open pages from exhausting the machine:

| Limit | Default | Override |
| --- | --- | --- |
| Live web views per app | RAM / 768 MiB, between 4 and 48 | `FOTONE_WEB_VIEW_BUDGET=<count>` |
| Memory of all web processes of an app | a quarter of RAM, between 512 MiB and 8 GiB | `FOTONE_WEB_MEMORY_MIB=<MiB>` |

Above either limit, the oldest hidden view of the site with the most open views
goes to sleep first. Views that play audio or use the camera, microphone or
screen sharing are never put to sleep. A sleeping view keeps its URL and wakes
when it is shown again.

## Caches and network

| Variable | Default | Effect when set to `0` |
| --- | --- | --- |
| `FOTONE_BYTECODE_CACHE` | on | Compiled JavaScript is no longer stored on disk. With the cache on, scripts of 4 KiB or more are kept and shared by every app, so a large web app starts faster the second time it opens. |
| `FOTONE_HTTP3` | on | Requests use HTTP/1.1 and HTTP/2 only. With it on, servers that advertise HTTP/3 are reached over QUIC, and a server whose QUIC fails goes back to TCP for five minutes. |
| `FOTONE_DNS_CACHE` | on | Host names are resolved for every connection instead of from the engine's cache. |

## Per-site exceptions

Some sites serve a degraded page to browsers they do not recognise. Fotone reads
per-site rules from `$XDG_CONFIG_HOME/fotone/site-exceptions.json` first, then
from the system copy in the data directories. A file named by
`FOTONE_SITE_EXCEPTIONS` replaces both.

```json
{
  "sites": [
    {
      "domains": ["teams.microsoft.com"],
      "user-agent": "chrome",
      "autoplay": "muted",
      "settings": { "enable-webgl": true }
    }
  ]
}
```

- `domains` matches the host and its subdomains.
- `user-agent` is `chrome`, `firefox`, `safari` or a literal user agent string.
- `autoplay` is `allow`, `muted` or `deny`.
- `settings` sets any writable `WebKitSettings` property by name. Unknown names
  and values of the wrong type are ignored.

## DevTools

Set `FOTONE_DEVTOOLS=1` before starting an app to enable the inspector in all of
its web views on a free local port, or `FOTONE_DEVTOOLS=127.0.0.1:9222` to choose
the address. The inspector uses the Chrome DevTools frontend.

## Sandboxing

Before a web process runs any page code it is confined with Landlock, which
limits the files it can reach, and seccomp, which limits the system calls it can
make. The engine applies the confinement, so it covers every app that embeds a
web view, not only Browser.

## Automation

Browser is the target for automated sessions: see
[WebDriver and MCP](/docs/apps/browser/) for `singularity-webdriver`,
`singularity-browser-mcp` and `--undetectable`.

## Limits

- Fotone is the engine only on Sinty OS. On other distributions the same app uses
  the WebKitGTK installed there, without the features above.
- WebGPU, WebCodecs and the File System Access API follow upstream WebKit and may
  be missing or behind Chrome on some sites.
