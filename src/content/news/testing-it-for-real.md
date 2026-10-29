---
title: Testing it for real
date: 2026-06-05
description: The portal "didn't work" for a lot of people. Instead of guessing again, I built a clean VM and traced the whole chain, then tested login through a TTY, GDM, and our own greeter.
---

Another day, another fresh batch of bugs. The one that would not leave me alone was the portal: taking a screenshot did nothing, third-party tools reported that capture was unavailable, and someone filed it plainly as [the portal not running by default](https://github.com/singularityos-lab/singularity-desktop/issues/32). I had already "fixed" screenshots once, so watching it come straight back nagged at me.

Here is the uncomfortable part. I run Vanilla OS 3 Reborn, and on my own machine the portal worked, so I had been pushing fixes I never actually verified anywhere else. That is not testing, that is hoping. Most of the reports were coming from Fedora 44, so I built a fresh Fedora 44 install in a VM and went through it the way a new user would: clone, build, install, log in. The bugs showed up right away, the ones I could never see at home.

It was not one bug. It was a chain, and each link hid the next.

The first link is the build itself. On modern distros the toolchain moved to GCC 16, which defaults to the C23 dialect: implicit function declarations are now errors, and common POSIX and GNU functions stay hidden unless you ask for them. So the C across the tree stopped compiling, `make install` died partway through, and it installed nothing, including the portal. A lot of "I don't have the portal" really meant "the build never finished." This is the one people hit on Discord while building on Fedora, with errors about `strdup` and `readlink` out of nowhere. The fix is to define the right feature macro project-wide and to resolve file-descriptor paths through GLib instead of a raw `readlink` that the Vala compiler did not always include the header for.

The second link only shows up once the build works. The portal backend is started on demand by the session bus, which decides what it can launch by scanning a fixed set of directories computed once, at login. We installed the backend's activation file into our own prefix under `/opt/local`, which that bus never looks at, so every request came back with "the name is not activatable" and the backend never started. The frontend was up, the configuration was right, the backend simply could not be reached. It now installs into a directory the bus actually scans.

The third link is the session wiring. Even with the backend reachable, the session has to export the right environment into the user service manager and bring up the unit target the portal and keyring are bound to, or they activate without the context they need. That is in place now too, and a separate crash where the portal started without its settings schema path is gone.

Here is what landed across the last few days:

- the portal does not run by default ([github.com/.../issues/32](https://github.com/singularityos-lab/singularity-desktop/issues/32))
- the portal was not part of a normal install ([github.com/.../issues/9](https://github.com/singularityos-lab/singularity-desktop/issues/9))
- games no longer opened fullscreen correctly ([github.com/.../issues/13](https://github.com/singularityos-lab/singularity-desktop/issues/13))
- desktop app icons showed a text-file image instead of the real icon ([github.com/.../issues/15](https://github.com/singularityos-lab/singularity-desktop/issues/15))
- desktop icons showed the `.desktop` filename ([github.com/.../issues/16](https://github.com/singularityos-lab/singularity-desktop/issues/16))
- Enter did nothing after searching in the app drawer ([github.com/.../issues/17](https://github.com/singularityos-lab/singularity-desktop/issues/17))
- an "add to desktop" action for apps ([github.com/.../issues/18](https://github.com/singularityos-lab/singularity-desktop/issues/18))
- the mouse cursor was upside down in VMs ([github.com/.../issues/27](https://github.com/singularityos-lab/singularity-desktop/issues/27))
- a build that only worked on modern GCC after the C sources were taught to compile again (this one came in over [Discord](https://discord.gg/Bj638UXffN), not as an issue)

While I had the VM up, I tried logging in through our own greeter, and it just did not. You typed the password, clicked sign in, and nothing happened, no error. It turned out the greeter was speaking the wrong wire format to greetd: greetd frames each message with a length header followed by JSON, and the greeter was sending newline-terminated JSON and reading by line. greetd read the first few bytes as a gigantic length and waited forever. So sign-in had never actually worked against real greetd, only in the windowed test mode. That is fixed now, and I added an opt-in `make install-greeter` to wire greetd up. The greeter stays optional: installing Singularity does not replace whatever login manager you already use, and the docs spell out how to switch if you want to.

Then I tested the whole thing three ways on that VM: from a plain TTY login, through GDM, and through our greeter, each one all the way to a screenshot taken through the portal. Same path a real machine takes, no hand-tweaking in between. It is the part I should have done before, and it is now part of how I work on this.

If you try Singularity and something breaks, please tell me: open an issue on [GitHub](https://github.com/singularityos-lab) or come find me on [Discord](https://discord.gg/Bj638UXffN). The reports from machines that are not mine are what make this real.
