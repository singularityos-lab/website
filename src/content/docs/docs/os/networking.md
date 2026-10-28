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

## Under the hood

sinty-nm answers the NetworkManager interface on the system bus, so `nmcli`, the
desktop and any app that talks to NetworkManager work with it unchanged. Wi-Fi
goes through `iwd`, addresses and routes through the kernel directly, IPv4
addresses come from a built-in DHCP client, and VPNs use the kernel's WireGuard.
Each part is a small piece of the same program instead of a stack of separate
tools.
