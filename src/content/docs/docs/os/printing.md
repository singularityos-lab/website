---
title: Printing
description: Print and scan on Sinty OS with torchio, the print system that replaces CUPS.
---

Printing on Sinty OS is handled by **torchio**. Apps print exactly as they would
with CUPS: print dialogs, browsers and the `lp` and `lpstat` commands all work,
because torchio speaks the same protocol.

![How a print job flows through torchio](/blog/torchio-flow.svg)

## Adding a printer

Open **Printers** and choose **Add Printer**. Printers found on your network are
listed, and each one is added only after you confirm it, so a device on a shared
network cannot install itself as your printer. `torchio usb` makes USB printers
that support IPP over USB available in the same way.

From a terminal the same steps are:

```bash
torchio discover                  # printers found on the network
torchio discover add <key> <name> # add one, after confirming
torchio printer list              # the printers you have
torchio queue                     # jobs waiting or printing
```

## Scanning

Network scanners that support eSCL, also called AirScan, work with the Scanner
app and with `torchio scan`.

## When something does not print

`torchio doctor` checks the whole print path, from the app to the printer, and
says where it stops.

## Why not CUPS

- **It runs as you.** The print service starts with your session and runs with
  your permissions. There is no system print daemon running as root.
- **Driverless first.** Modern printers speak IPP Everywhere and need no driver.
  Older printers whose drivers exist only for CUPS can be served by a driver
  that runs as a WebAssembly module, isolated from the rest of the system.
- **Format conversion is isolated too.** Turning a document into what the printer
  understands also runs as WebAssembly.
- **Sharing is opt in.** `torchio share` shares a printer on your network over
  IPPS, and only when you ask.
