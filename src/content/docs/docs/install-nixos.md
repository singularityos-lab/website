---
title: Install on NixOS (community maintained)
description: Run Singularity on NixOS through the community flake.
---

The community-maintained
[singularity-flake](https://github.com/mateoalfaro/singularity-flake) packages the
desktop and exposes a small NixOS module, so you can enable it with a single
option. It builds the full desktop from source, updating on a daily basis.

:::danger[Pre-release: install at your own risk]
Singularity is in active development, and this flake layers a large build on top
of NixOS. It has been tested on a handful of machines, but carries real risk: try
it on a spare machine or a virtual machine, and back up anything you care about
first.
:::

:::note[Community maintained]
This flake is maintained by the community, not the Singularity core team. If a
build breaks, or a piece of the desktop does not behave the way the rest of these
docs describe, please report it in the
[flake's repository](https://github.com/mateoalfaro/singularity-flake) first,
not upstream.
:::

## Add the flake

Add it to your flake inputs, import the NixOS module it ships, and enable it:

```nix-flake
{
  inputs.singularity-desktop.url = "github:mateoalfaro/singularity-flake";

  outputs = { self, nixpkgs, singularity-desktop, ... }: {
    nixosConfigurations.myhost = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [
        singularity-desktop.nixosModules.default
      ];
    };
  };
}
```

```nix-config
{ ... }:

{
  programs.singularity-desktop = {
    enable = true;
    # more options will be added over time
  };
}
```

Then rebuild and switch:

```sh
sudo nixos-rebuild switch --flake .
```

Once built, the session shows up in your display manager. Log out then pick the Singularity session and log back in.

## Try it without installing

you can also run the desktop directly from the flake, without touching your system config:

```sh
nix run github:mateoalfaro/singularity-flake
```

Or build it locally first:

```sh
nix build github:mateoalfaro/singularity-flake
```

See [Install](/docs/install/) for the general build-from-source flow the flake
automates, and [First boot](/docs/first-boot/) for what to do once everything is up and running.
