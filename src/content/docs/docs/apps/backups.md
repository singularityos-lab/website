---
title: Backups
description: Automatic backups of your home folder, with a way back to any moment.
---

Backups keeps automatic copies of the files in your home folder, so you can go
back in time and recover anything you lose or change by mistake.

## Where backups go

- **An external disk** that you connect from time to time. Backups start whenever
  it is connected. A disk used only for backups works best, and Backups can erase
  one and prepare it for you.
- **A folder on another disk** inside the computer, which keeps your files safe if
  the main disk fails.
- **A network share**, once you have connected to it in Files.
- **An online account** added in Settings, Online Accounts.
- **Other services** added by backup plugins.

## Space and encryption

Files are stored once and shared between backups: copies of the same file, and
files you move or rename, take no extra space. After the first backup, only the
files that changed are copied or uploaded.

Backups can be encrypted with a passphrase. For an online account, files are
encrypted on this computer before they are uploaded, so the account only stores
unreadable data. Keep the passphrase safe: it cannot be recovered.

## Schedule

Backups run every hour, every day, every week, or only when you ask. By default
they keep hourly backups for a day, daily backups for a month and weekly backups
before that; you can keep a fixed number instead. Automatic backups pause when
the battery runs low and wait until the computer is charged again.

To leave something out, such as a large downloads folder, add it to the
exclusions by folder or by name pattern.

## Going back in time

**Browse Backups** shows your home folder as it was at each backup. Page Up and
Page Down move to older and newer backups, and you can show only what changed.
Restore a single file or folder, keep both copies, or **Restore Everything** from a
backup. A full restore can also reinstall the apps you had and their data.

To move to a new computer, point Backups at your old destination and choose to
continue those backups, or restore them here first.

**Verify Backups** reads every file of the latest backup and compares it with its
checksum.
