---
title: Each component got its repo
date: 2026-06-01
description: The shell, session, apps, themes, plugins and widgets now live in their own repositories.
---

The shell, the session, the compositor integration, the apps, the themes, the wallpapers, the plugins and the widgets now each live in their own repository, orchestrated by a lean meta repo that wires them together with submodules and a single build. Cleaner to build, easier to contribute to: each piece has its own history, issues and release cadence, so if you only care about theming you clone the themes repo and you are productive in minutes, without pulling the entire desktop.

This was the hardest part of building Singularity Desktop. It all began on my laptop, and the project moved fast, taking many different paths and ideas, with plenty of failures and successes that left behind residue, debris, obstacles, and hardcoded parts. That made development wonderfully fluid and free for me, but it made it genuinely hard, in the end, to split everything apart and give each component its own repository, the way it should be. Here I have no reluctance in admitting that artificial intelligence helped me: explaining parts of the code to me, commenting it, and retracing all of the configuration to divide it as accurately as possible.

The meta repo keeps the full system one command away.
