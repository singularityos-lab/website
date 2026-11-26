---
title: Firewall and network privacy
description: Block connections you did not ask for, mark a network as public, and keep a different Wi-Fi address on every network.
---

## The firewall

Open **Settings**, **Network**, **Firewall** and turn on **Block Incoming
Connections**. The firewall is off until you do. When it is on, nothing from outside can open a connection to this computer
except the replies to connections it started itself, network setup traffic, and
the apps and services you allow.

### Home and Public

Every network is either **Home** or **Public**:

- **Home**: the apps you allowed can be reached, and nearby discovery works, so
  printers, other computers and phones find this one.
- **Public**: only the apps you allowed on every network can be reached, and
  nearby discovery is closed.

Use **Public** on networks you do not trust, such as in cafés and airports. The
type is saved per network in **Network Type**, on the page of each Wi-Fi or wired
network, and the firewall follows it as you move between networks. A network
marked Work counts as Home.

### Allowed apps and ports

**Allowed Apps and Ports** lists what may receive connections, with the ports
and whether it applies on **Every network** or **Home only**. Choose **Add Port**
to open ports yourself: give the rule a **Name**, write the **Ports** like
`8080/tcp` or `6000-6010/udp`, separated by commas, and turn on **Also on Public
Networks** if it should stay open there too. Remove a rule to close its ports
again.

System services that receive connections, such as Sinty Core, declare their
ports themselves and are listed too.

### From the terminal

The ruleset is a single nftables table, `inet singularity_firewall`, and every
rule carries the name of the app that opened it:

```sh
nft list table inet singularity_firewall
```

## A different address on every network

Every Wi-Fi network sees a different hardware address for this computer, always
the same one for the same network. Shops, stations and airports cannot follow the
computer from one network to the next by its address, and your home router still
recognizes it.

The address in use is shown as **Hardware Address** on the page of the network.

## VPN

See [Networking](/docs/os/networking/#vpn).
