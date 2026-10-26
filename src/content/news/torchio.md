---
title: "torchio: printing without CUPS"
date: 2026-10-26
description: "Sinty OS now prints through torchio, a small print service that speaks the CUPS protocol to your apps, IPP to your printers, and runs every file conversion in a sandbox."
---

Printing on Linux has meant CUPS for twenty years. It works, mostly, but it is a large system daemon running as root, it still carries a filter and driver model built for printers that are long gone, and the conversion programs it runs are some of the most exposed code on a desktop: they parse whatever file you throw at them, with privileges.

Almost every printer sold in the last decade speaks IPP and accepts PDF or a standard raster format directly. That makes most of CUPS unnecessary. torchio is what is left when you keep only the part that matters.

![How a print job flows through torchio](/blog/torchio-flow.svg)

### One per user, not one for the system

torchio runs as your user, not as root. Your printers, your queue and your history belong to you. There is nothing shared to break into and nothing to configure with an admin password.

### Your apps don't notice

torchio answers on the same socket CUPS uses and speaks the same protocol libcups speaks. The GTK and Qt print dialogs, browsers, `lp` and `lpstat` all work unchanged, because from their side it looks like CUPS. Sandboxed apps go through the print portal as before.

### The cheapest conversion

When a job arrives, torchio looks at what the printer accepts and plans the shortest way to get there. If the printer takes PDF, the PDF goes straight through, untouched. If it only takes raster, the document is rendered once, at the printer's resolution, and encoded in its format. No chain of filters each guessing what the next one wants.

### Conversions in a box

Every conversion runs in WebAssembly. The PDF renderer is pdfium compiled to wasm, and it gets exactly two things: the file on standard input and somewhere to write the result. No files, no network, no clock. A malicious PDF can at worst produce a garbage page.

### Printers you chose

torchio finds printers on your network with mDNS, and printers on USB that speak IPP over USB, but it never adds one on its own. It shows you what it found and waits for you to confirm. A printer that appears on a café network does not silently become your default.

### And the rest

It can share your printers with other machines over encrypted IPP, scan from multifunction devices through eSCL.

It is the default on Sinty OS, replacing CUPS entirely. The code is at [github.com/singularityos-lab/torchio](https://github.com/singularityos-lab/torchio).
