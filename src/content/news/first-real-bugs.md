---
title: First real bugs
date: 2026-06-04
description: People started building Singularity from source and found the rough edges. Here's what broke this week and what I fixed.
---

I didn't expect this much interest on day zero. People I've never met were already building Singularity from source, by hand, on completely different distros: Debian here, Fedora there, Arch, Garuda. That's the side of open source I hadn't felt in a while on my own projects, and honestly it means a lot.

It also means they walked straight into the rough edges, which is exactly what I was hoping for. Until now I'd only tested on my own machines, so I only ever find the bugs my own setup happens to have. A few reports from other people's machines are worth ten of my own guesses.

Here's what landed:

- Discord, Steam and other X11 apps wouldn't open ([github.com/.../issues/2](https://github.com/singularityos-lab/singularity-desktop/issues/2))
- taking a screenshot did nothing at all ([github.com/.../issues/3](https://github.com/singularityos-lab/singularity-desktop/issues/3))
- most of the icons were missing ([github.com/.../issues/4](https://github.com/singularityos-lab/singularity-desktop/issues/4))
- the dock would hide on autohide and never come back ([github.com/.../issues/5](https://github.com/singularityos-lab/singularity-desktop/issues/5))
- some apps could crash on launch when built on their own ([github.com/.../libsingularity/issues/3](https://github.com/singularityos-lab/libsingularity/issues/3))
- Firefox and a few other apps showed an empty window preview in the overview ([github.com/.../issues/8](https://github.com/singularityos-lab/singularity-desktop/issues/8))
- focusing Telegram or Discord could throw the whole desktop into a crash loop (no issue for this one, I caught it myself while chasing the others)
- clicking the hot-corner buttons in settings crashed the whole desktop ([github.com/.../issues/10](https://github.com/singularityos-lab/singularity-desktop/issues/10))
- some apps (Steam, a few flatpaks) had no icon in the dock, overview or alt-tab ([github.com/.../issues/11](https://github.com/singularityos-lab/singularity-desktop/issues/11))
- and a build that only worked through `make`, not plain meson, chased down with help on [Discord](https://discord.gg/Bj638UXffN)

Many of them shared one root: a lot of "nothing works" really means "this is running outside the Singularity session." The desktop installs into its own prefix, and the session is what wires it up. The panel and dock are layer-shell surfaces that need the labwc compositor, and screenshots and X11 apps go through it too. Outside the session, half of it can't work. That one I answered with clearer errors and better docs.

The rest were real bugs. The installer wasn't copying the icon theme the shell pins to. The autohide dock kept getting stuck hidden, and this one took me two tries: the thin strip it leaves on screen to catch your cursor wasn't repositioned when the dock changed size as apps opened and closed, so it slowly drifted off-screen until there was nothing left to touch. It now keeps that strip in place on every relayout. Clicking the hot-corner buttons in settings could also bring the whole desktop down, a classic use-after-free where the button's menu held on to data that had already been freed. A few code paths read a settings schema without the safe check and could crash. And the meson build relied on a Makefile side effect to find its introspection data, now made explicit.

The Firefox preview was the one I'm happiest about, because it taught me something. Window previews go through a small Wayland protocol I wrote: the overview asks the compositor for a thumbnail, the compositor reads the window's pixels back and hands them over. The catch is that it was only reading the window's main surface. That's fine for most apps, but Firefox paints its actual content on a child subsurface (it renders through WebRender on its own buffer), so the main surface is basically empty and the preview came back blank. The fix is to walk the whole surface tree and composite it into the thumbnail when a window has more than one layer, then crop to the real window geometry so the client-side shadow doesn't leave a black border around it. Same idea, just looking at the full window instead of one slice of it.

The crash loop I found myself, and it was a good lesson. To show the menu of apps that don't export one the modern way, the shell reads it from the accessibility tree (AT-SPI). The accessibility library hard-aborts the entire process when that tree changes under it or its cache is in a bad state, and there's nothing you can catch from inside the process: it's fatal by design. So I moved the scan into a throwaway helper process. If it blows up, only the helper dies and the shell just shows no menu for that app. The feature stays, the crash doesn't.

The missing icons were two problems wearing one coat. Windows that were already open when you logged in got resolved before the app list had finished loading, so they ended up with no icon; the dock quietly re-resolved them on its next refresh, but the overview and alt-tab read the icon set at that first moment and kept showing nothing. Now the shell re-resolves those once the list is ready, and everywhere reads from the same place. The other half is apps like Steam, whose actual window is a helper process called `steamwebhelper` that matches no installed app by name; I match those back to their parent app by id prefix, so the helper window borrows Steam's icon instead of showing blank.

None of this is glamorous. It's the unphotogenic work that turns a desktop from a demo into something you can leave running. If you try Singularity and something breaks, please tell me: open an issue on [GitHub](https://github.com/singularityos-lab) or come find me on [Discord](https://discord.gg/Bj638UXffN). It's the fastest way to make this better.
