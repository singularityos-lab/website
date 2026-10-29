---
title: Networks and VPN
description: How Sinty OS connects to Wi-Fi, wired networks and WireGuard VPNs.
---

Networks are managed from the Network page of the system settings and from the
network menu in the top bar. Behind them runs **sinty-nm**, the network manager
of Sinty OS.

## Wi-Fi and wired networks

Pick a network from the menu or the settings page and enter its password the first
time. Known networks reconnect on their own.

## VPN

Sinty OS has WireGuard built in. Nothing extra to install.

- **Import a configuration.** In the settings, open Network, then **Import VPN
  Configuration**, and pick the `.conf` file your VPN provider or your
  administrator gave you.
- **Enter it by hand.** **Add VPN** asks for the same details: keys, address,
  peer and allowed addresses.

Turn the VPN on and off from the network menu. While it is on, the top bar shows a
VPN indicator with the connection name.

The settings also accept OpenVPN files. On Sinty OS only WireGuard connections can
be used. The desktop on other distributions uses whatever its NetworkManager
supports.

## From the terminal

`nmcli` is installed and talks to sinty-nm:

```bash
nmcli device                                   # devices and their state
nmcli device wifi list                         # networks in range
nmcli device wifi connect "Home" password "secret"
nmcli connection show                          # saved connections, VPNs included
nmcli connection up "Office VPN"               # turn a saved connection on
nmcli connection down "Office VPN"
nmcli device disconnect wlp0s20f3              # leave the current network
nmcli connection delete "Old network"          # forget it
```

Saved connections are keyfiles in `/etc/NetworkManager/system-connections`, in
the format NetworkManager uses. Supported connection types are Wi-Fi, Ethernet,
bridge and WireGuard.

For apps, the D-Bus interface is the NetworkManager one at
`org.freedesktop.NetworkManager`, usable through libnm or directly. These calls
are implemented: `ActivateConnection`, `AddAndActivateConnection`,
`DeactivateConnection`, `AddConnection`, `Update`, `Update2`, `Delete`,
`GetSecrets`, `RequestScan` and the device `Disconnect`.

## Under the hood

sinty-nm answers the NetworkManager interface on the system bus, so `nmcli`, the
desktop and any app that talks to NetworkManager work with it unchanged. Wi-Fi
goes through `iwd`, addresses and routes through the kernel directly, IPv4
addresses come from a built-in DHCP client, and VPNs use the kernel's WireGuard.
Each part is a small piece of the same program instead of a stack of separate
tools.
