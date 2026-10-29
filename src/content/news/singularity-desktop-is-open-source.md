---
title: 🎉 Singularity Desktop is open source
date: 2026-06-03T23:59:59
description: The entire source is public, every component and every app, out in the open.
---

After more than a year of development, from an idea that started as an Easter egg, [announced on April 1, 2023](https://x.com/VanillaOSLinux/status/1642261202695757825) on the official Vanilla OS channel, which I founded, a question grew in me: "what if I actually did it?" So I started asking myself questions, a lot of questions. I could not just build a desktop environment for the sake of building one. It had to mean something.

I am mostly a UX designer, and the projects I make come from personal needs, usually the gaps and frustrations I run into over time. [Bottles](https://usebottles.com) is one example, Vanilla OS another, and the same goes for many other projects I have built. So I took all those gaps and complications and started thinking. I read a mountain of Reddit posts, of issues on GitHub and on the various GitLabs scattered across the web. I noticed what people want, specifically the things I relate to or that make sense to me, in my own opinion. Then I put it all in a jar, tipped it over, and figured I had better just say it out loud: folks, pleasing everyone is I-M-P-O-S-S-I-B-L-E, and honestly it is not what I want to do. What I want is a functional experience on Linux, even at the cost of breaking what are de facto or long-accepted standards.

I started with the thing I do best, drawing. I produced a huge pile of sketches of what the desktop environment should be, and got to the [first real prototype](https://www.figma.com/design/ZuQac76Rgtovazrfs5f7BI/Proj.-Desktop?node-id=0-1&t=dVOAl1eeszSSavbx-1). I built it entirely in HTML, CSS and JS just to try it, but after less than a week I was already tired of it: everything was TOO much, off the rails. The idea of making something new had buried the main goal, which was to make it work without getting in the way. So I went back to the start and took the opposite approach: I began from the code. I made a panel in GTK4 with Vala and just looked at it. Then I added a label showing the focused app's name, then a menu, then the icon to open that menu, then the clock, and... building it up bit by bit, I made what Singularity Desktop is today. Something maybe seen before, I will not pretend otherwise, but with small details I hope get noticed and make the difference.

I do not rule out that there are more bugs than features, I expect that, but I also expect you to notice what I am trying to show, what I want to come through: that you feel what I have been feeling, using it every day on my laptop for the past six months.

I am proud and happy to announce Singularity Desktop to you, and soon, Singularity OS.

The whole thing is public on [GitHub](https://github.com/singularityos-lab): the shell, [libsingularity](/docs/libsingularity/), the session and the greeter, the labwc compositor build, the themes and wallpapers, the plugins and widgets, the [vetro](/docs/vetro/) transpiler, the portal backend and the polkit agent, and every app, Files, Edit, Write, Store, Monitor, Git, Music, Photos, Videos, Calendar, Calculator, Leafs and Keyring. The full map is in [Repositories](/docs/repositories/). If you want to try it, start at [Install](/docs/install/) and [Build from source](/docs/build-from-source/), with one fair warning: it is pre-release and can touch your system, so use a spare machine or a virtual machine, and install into /opt on immutable systems.

[Join the Discord](https://discord.gg/Bj638UXffN) to chat and stay up to date. Thanks to everyone who followed and believed in the project from the start, to everyone who donated to keep development going from the very first screenshots, and to everyone who [decides to](/sponsor).

From the heart,
_Mirko B._
