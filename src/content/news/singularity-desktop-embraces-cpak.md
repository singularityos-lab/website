---
title: Singularity Desktop meets cpak
date: 2026-08-16T12:00:00Z
description: Singularity Desktop can now be installed through cpak and selected as a complete Wayland session from the login screen.
draft: false
---

I first spoke about Singularity Desktop in April 2023, but it was not the only project taking shape on my desk because, five months later, [I made the first cpak commit](https://github.com/Containerpak/cpak/commit/8c874eca2e7b7379ff5f877f82aebaeff361b490), a package format born from a simple question: could I build a Docker image of my software and make it behave like a real application on any Linux distribution, without spending the rest of the week wiring graphics, audio and desktop integration by hand?

For almost three years the two projects grew beside each other, with Singularity slowly becoming the desktop I wanted to use every day while cpak learned how to make increasingly complex images feel at home on Linux, and this week they finally met at the login screen.

Neither project is stable yet, and that is exactly why this meeting matters. The [Singularity public alpha has left my desk](/news/the-alpha-left-my-desk/) in search of hardware and habits I do not have, while cpak has reached the point where its new session support needs something real enough to expose every bad assumption behind it.

## Now they can break each other

The first month of testing already confirmed how much Singularity changes outside my setup, because every laptop, graphics driver and display layout finds a different edge, yet asking somebody to build the compositor, shell, toolkit and applications before they can report one means their first problem may come from a build I have never seen.

cpak has the opposite problem: ordinary applications already exercise most of its runtime, but a login session begins earlier, owns more hardware and stays alive for much longer, so a small example written for the documentation could never tell me whether the new capability was ready. Putting the two alphas together gives each one the test it was missing.

## The first real login

Once Singularity opened through cpak, the next step was obvious: stop opening it inside another environment. I wanted to log out, select it beside my other sessions and give it the displays until I decided to leave, exactly as I would on Sinty OS or a distribution package.

That is what the new cpak session support makes possible. Singularity declares its login entry and the access it needs, cpak shows the request before registering anything on the system, then the display manager can start the package as a real Wayland session and remove that entry again when it is disabled.

The package itself is split between a small Singularity Runtime and the session, with the common userspace in the first image and the compositor, shell and applications in the second, while the writable profile stays separate so updates do not rebuild personal data. The host keeps its kernel and drivers, then grants the hardware, services and XDG folders declared by the package.

## It had to feel like the same computer

The part that made this useful was not the first frame of the shell, it was opening the launcher and finding the applications already installed on my computer, then opening Documents or Downloads and finding the same files in the same places. I did not want to publish a sealed demonstration environment where people could admire my panel and little else, I wanted another way to use Singularity.

cpak keeps the package away from the private parts of the home it was never given, but it can discover and launch software installed on the host and expose the familiar user folders declared in its permissions, so the session arrives with boundaries without pretending the rest of the computer disappeared.

## One more way to try Singularity

The package is experimental because both alphas now need the kind of testing that starts after the first successful login, when somebody suspends a laptop, reconnects a monitor, opens the applications they actually use and expects tomorrow's update to leave everything where it was.

Sinty OS remains the place where I can shape the operating system and Singularity together, and native distribution packages remain part of the project rather than something this work is trying to replace. cpak is one more official way to try the same session on another Linux system, and if one exposes a problem in the other, the experiment is already doing its job.

The package and its session setup are documented in [Desktop and kiosk sessions](https://cpak.it/docs/desktop-sessions), and the distributions already working on native packages are still welcome to reach out because Singularity should not depend on a single road into the login screen.
