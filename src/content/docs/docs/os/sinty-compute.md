---
title: Sinty Compute
description: Let apps reuse work they have already done, with the kernel telling them when a stored result is no longer valid.
---

Apps keep redoing the same work: decoding the same wallpaper and icons, building
the same thumbnails, compiling the same JavaScript every time a web app opens.
Sinty Compute lets them keep the result and reuse it. The hard part of any cache
is knowing when a stored result has gone stale. Here the kernel answers that: it
watches the memory a computation read and reports when that memory may have
changed.

:::caution[Off by default]
Sinty Compute is an experimental feature of Sinty OS. It stays off until you turn
it on, and apps work exactly as before without it.
:::

## Turning it on

Turn on [developer mode](/docs/developer-mode/), then open the Developer page in
the system settings. The Sinty Compute switch only appears when the kernel module
is installed, which it is on Sinty OS. The choice is kept across restarts.

There are three modes:

- **Measure** counts how often a result could have been reused, without reusing
  anything. Use it to see what the feature would save.
- **Active** reuses results that are still valid.
- **Verify** recomputes every result and compares it with the stored one. It is
  slower, and it is there to check that reuse never changes what an app shows.

## Where it is used

- **The desktop** reuses decoded wallpapers, icons and window previews.
- **Files** reuses thumbnails.
- **Edit** reuses syntax highlighting.
- **Web views** reuse compiled JavaScript, so a large web app opens faster the
  second time. The cache is shared by every app that shows web content.

Other apps are being moved onto it one at a time.

## Outside Sinty OS

The Singularity desktop and its apps also run on other distributions. There the
kernel module is not present, the switch does not appear, and apps compute
everything as usual.

## For developers

The `sinty-compute status` command prints the state of the module and its
counters. Apps use the feature through the `libsintycompute` library. The source
and the details of how invalidation works are in the
[sinty-compute repository](https://github.com/singularityos-lab/sinty-compute).
