---
title: SXI apps
description: The signed, immutable app format of Sinty OS and the sxi command.
---

Sinty OS ships a small base system. More Singularity apps, such as Browser,
Notes, Photos and Tasks, are installed later from the Store as **SXI** apps.

An SXI app is one signed bundle. Before any of it runs, the system checks who
published it and that nothing was changed. Once installed it is mounted read-only
and verified as it is read, so an installed app cannot be altered on disk. SXI
apps use the platform libraries already in the system, so they stay small.

## Installing and removing

Use the Store, in the Sinty collection. From a terminal:

```bash
sxi refresh                 # fetch the latest list from your sources
sxi list                    # available and installed apps
sxi install dev.sinty.notes # install, or move to the newest build
sxi remove dev.sinty.notes
sxi rollback dev.sinty.notes # go back to the build you had before
```

## Safety

- Every collection index and every app is signed. A publisher signs through a
  delegation from the collection's root key, and a revoked publisher stops being
  accepted.
- The system remembers the newest release it has seen of each app, so nobody can
  push an older, vulnerable build back onto your machine.
