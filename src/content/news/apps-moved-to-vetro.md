---
title: Apps moved to vetro
date: 2026-05-20
description: Every first-party app now authors its interface in concise .vetro files.
---

Every first-party app now authors its interface in concise `.vetro` files. vetro is our own small, declarative language for describing a GTK widget tree, compiled to a standard GTK `.ui` file at build time. Less boilerplate, more consistency.

Describing a window in vetro is a fraction of the code of hand-written GTK, and because every app shares the same primitives, they end up looking and behaving like siblings rather than distant cousins.

The transpiler runs as part of the normal build, so there is no runtime cost: what ships is plain, fast GTK. vetro lives in [its own repository](https://github.com/singularityos-lab/vetro), and the [vetro documentation](/docs/vetro/) walks through the syntax and how it compiles.
