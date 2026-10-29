---
title: Keyring
description: The secret store that works behind the scenes.
---

Keyring is the part of Singularity you mostly do not see. It is the secret store:
the background service that keeps passwords and other secrets for the apps that
need them.

## What it does

Keyring runs as a daemon and provides the standard secret service on the session
bus, the same interface other desktops use, so apps that know how to store a
password just work. Secrets are grouped into collections, with a default one
called login, and each collection is a file encrypted on disk. The encryption
uses libsodium, with the key derived from your passphrase, so the contents are
unreadable without it.

## What you see

There is no day-to-day window. The only time Keyring shows itself is a small
dialog: once to set a passphrase the first time, and after that to unlock a
collection when an app asks for a secret and the keyring is locked. The rest of
the time it sits quietly in the background.
