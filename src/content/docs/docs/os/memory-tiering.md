---
title: Memory tiering (MTS)
description: How Sinty OS keeps memory responsive under pressure by tiering cold pages to a local tier, using the Memory Tiering Standard.
---

Sinty OS can treat memory as **tiers** rather than as one flat pool. Hot pages,
the ones you are actively using, stay in fast RAM; cold pages that have not been
touched in a while are moved to a slower local tier. Your RAM stays free for the
work in front of you, and the system stays responsive when memory runs tight
instead of stalling or killing an app.

This is provided by the **Memory Tiering Standard (MTS)**, a project developed
alongside Sinty OS. It is not swap or a compression trick. It is a policy that
decides, page by page, where memory should live, with the kernel guaranteeing
that the system always makes forward progress and never loses your data.

Memory tiering is **on by default**: Sinty OS tiers your memory from the moment it
boots, with no setup on your part. It is still maturing along with the rest of the
system (see the pre-release note on the [overview](/docs/os/about/)).

## What it does for you

- **Keeps RAM for what matters.** Pages you are not using are moved out of RAM to
  a local cold tier, so the memory you are actively using has room.
- **Stays responsive under pressure.** When memory fills up, instead of thrashing
  or killing an application, the system relieves the pressure by tiering cold
  pages, so the machine keeps going.
- **Never loses data.** The move is safe: a page that was tiered out is brought
  back correctly the moment it is needed. Tiering is transparent to your apps.

## How it is different from swap

Traditional swap and compressed-RAM tricks react late and treat all memory the
same. MTS instead gives each page an explicit cost and places it against
**declared tiers** with measurable targets, so the system can keep a promise
about how responsive it stays, not just push pages out when it is already in
trouble. The kernel owns the safety; the policy on top decides placement.

## Configuring and watching it

You do not have to turn memory tiering on; it runs from boot. If you want to see
what it is doing or tune it, that lives in the developer and administration tools
rather than the everyday settings. See
[MTS for developers and administrators](/docs/os/mts-admin/) for how it is
configured and how to watch it work.
