---
title: Git
description: The Singularity git client.
---

Git is a graphical client for the everyday git loop: see what changed, stage it,
commit it, and sync with a remote.

## Opening repositories

Open a single repository, or point Git at a folder and it discovers the
repositories nested inside it, so you can keep several projects open at once. They
appear in a list on the left, each one closable.

## Branches and history

Next to the repository list are its branches, split into local and remote, with
the current branch marked and ahead and behind counts beside each. The center of
the window is the commit log, drawn with a graph and with branch and tag labels
on the commits that carry them. Pick a commit to see its diff.

## Reviewing and committing

The diff viewer is syntax-colored, with additions and deletions shaded and hunk
headers called out. The working area lists your changes grouped into staged,
changed, and untracked, with buttons to stage, unstage, or discard each, and a
message box to commit. When there is a merge conflict, a banner appears and you
can open the conflicting files and mark them resolved. You can pop the diff out
into its own window when you want more room.

The toolbar carries fetch, pull, and push, along with new branch and refresh.

:::note
Git focuses on the day-to-day loop: status, diff, stage, commit, branch, and
sync. It does not yet cover stash, rebase, blame, or tag creation.
:::
