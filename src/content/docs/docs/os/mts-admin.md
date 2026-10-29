---
title: MTS for developers and administrators
description: The model behind Memory Tiering Standard on Sinty OS, its tiers and domains, and the mtsd and mtsctl tools used to configure and observe it.
---

This page is the technical side of [memory tiering](/docs/os/memory-tiering/). It
describes the model the Memory Tiering Standard (MTS) uses, how it is put together
on Sinty OS, and the tools you use to configure and watch it.

:::note[On by default]
MTS runs by default on Sinty OS: `mtsd` starts at boot in `enforce` mode with a
local cold tier. It is still maturing, so the interfaces and defaults here can
change.
:::

## The model

MTS makes anonymous memory a **schedulable resource**. Three ideas:

- **Per-page cost.** Each page carries an explicit cost and a reuse estimate, so
  the system can reason about what it is worth keeping in fast memory.
- **Declarative tiers.** You declare the tiers that exist (for example fast DRAM
  and a slower local cold tier), each with its capacity and its latency and
  bandwidth characteristics.
- **Domains with targets.** A domain groups memory under a service-level target,
  such as a fault-service latency it must stay within. The placement engine moves
  pages between tiers to keep that target while respecting the tiers' limits.

The split is deliberate: the **kernel** owns admission, placement safety, and
forward progress (it will never lose a page or deadlock), while **userspace** only
declares the desired state and reports measurements. Userspace is never in the
fault path.

## The pieces on Sinty OS

- **Kernel support.** The kernel provides the tiering and reclaim path and a
  control device at `/dev/mts`. Tiered-out pages are tracked so they are brought
  back correctly on the next access.
- **`mtsd`.** A small daemon that reads the configuration, registers the tiers and
  domains with the kernel, and holds them for the life of the session.
- **`mtsctl`.** The control and inspection tool.

## Configuration

MTS is configured by a portable `mts.conf`. It declares the tiers and the domains.
A minimal shape looks like this:

```ini
[MTS]
Version=2
Mode=enforce

[Tier "cold"]
Kind=persistent-local-memory
Provider=/var/lib/mts/cold.img
CapacityBytes=1073741824
ReadLatencyP50NSec=15000
WriteLatencyP50NSec=20000
ReadBandwidthBytesPerSec=500000000
WriteBandwidthBytesPerSec=400000000

[Domain "/"]
Mode=enforce
Tiers=dram,cold
FaultServiceP99USec=500
ReserveCapacityBytes=536870912
```

- **`[Tier ...]`** declares a place pages can live. `dram` is implicit; here a
  `cold` tier is a file the kernel can write cold pages to, with conservative
  latency and bandwidth figures the placement engine uses.
- **`[Domain ...]`** sets the target. `Mode=observe` only measures; `Mode=enforce`
  actually moves pages. `FaultServiceP99USec` is the latency the domain tries to
  hold, and the `Reserve*` keys keep headroom so the tier is never driven to the
  edge.

## Using mtsctl

```bash
mtsctl validate <mts.conf>   # check a configuration without applying it
mtsctl apply <mts.conf>      # register the tiers and domains with the kernel
mtsctl observe               # read the live telemetry
mtsd run <mts.conf>          # run the daemon that holds the configuration
```

`mtsctl validate` is the safe first step: it parses the file and checks the tiers
and domains without touching the kernel. `mtsctl observe` reports normalized
measurements (how often pages are reused, how well the model's predictions held,
and the service the domain is actually delivering) so you can see whether a
configuration is doing what you intended.

## Status and limits

MTS is a research-grade implementation being measured end to end. The tiering and
reclaim path and the admission and telemetry are implemented, but large-scale
hardware acceptance is not claimed. On Sinty OS it runs by default and is still
maturing, so treat its numbers as something to measure and its behavior as subject
to change.
