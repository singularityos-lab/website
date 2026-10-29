---
title: First boot
description: The greeter, logging in, and choosing your session.
---

Singularity ships its own greeter, the login screen you can put in front of the
desktop. It is optional: you enable it yourself, and until you do, you log in
through whatever display manager your system already uses.

## The greeter

The greeter lists the users on the system and lets you sign in. It is built on
the same framework as the rest of the desktop, so it already looks like
Singularity before you have logged in once.

Each user gets their own look on the login screen. The greeter reads your accent
color and your wallpaper from the system account service, so the background you
chose inside the desktop shows up, gently blurred, when you log in. Your avatar
appears too, taken from your account picture.

## Enabling the greeter

The greeter is optional, and installing Singularity does not replace your login
manager with it. If you are happy with GDM, SDDM, or whatever you already use,
keep it and pick the Singularity session there. To use the Singularity greeter
instead, enable it yourself.

The greeter runs on [greetd](https://git.sr.ht/~kennylevinsen/greetd), so install
greetd first (the package is `greetd` on Fedora, Arch, Debian, and Ubuntu). Then
write the greetd session configuration:

```sh
make install-greeter
```

This sets up greetd to launch the Singularity greeter, but it does not change
your active login manager. To switch over, disable your current one and enable
greetd, then reboot:

```sh
sudo systemctl disable gdm
sudo systemctl enable greetd
```

On systems with SELinux in enforcing mode, `greetd` may be denied permission to
run the greeter launcher scripts in `/etc/greetd`. `make install-greeter` already
relabels them as executable; if the greeter still fails to start, confirm the
labels with `ls -Z /etc/greetd` or, as a last resort, set SELinux to permissive
while you investigate.

## Choosing a session

If more than one desktop session is installed, the greeter lets you choose which
one to start. It finds sessions the standard way, by scanning the usual system
locations for installed session files, so anything installed correctly shows up
in the list. Pick the Singularity session and sign in.

## After login

The session launcher starts the compositor, then the shell, and keeps the
desktop alive across restarts. The first thing you will see is the
[desktop](/docs/desktop-tour/): a panel at the top and a dock at the bottom.
