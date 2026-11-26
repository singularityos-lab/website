---
title: Parental controls
description: Choose which apps a child can open, set a daily limit and a bedtime, filter websites and see screen time.
---

Parental controls apply to a regular account and are set by an administrator.
Open **Settings**, **Users**, pick the account and choose **Parental Controls**.
An account can never change or remove its own limits.

## Apps

**Allowed Apps** lists every app installed. A blocked app is hidden from the
account and cannot be started from the desktop.

## Time limits

- **Daily Limit**: turn on **Limit Screen Time** and choose the **Minutes a Day**,
  from 15 minutes to 12 hours. Time counts only while an app is in use. A
  notification comes **Warn Before** the end, and when the time is used up the
  screen locks.
- **Bedtime**: turn on **Lock at Bedtime** and choose **From** and **To**. The
  screen stays locked during those hours.

## Websites

**Filter Websites** blocks the sites in the list. Turn on **Only Allow Listed
Sites** to open only the sites in the list instead. Add a site by its address,
such as `example.com`.

The filter applies to the Singularity Browser. Other browsers need their own
settings, so block them in **Apps** if the child should only use this one.

## Screen time

**Screen Time** shows which apps the account used and for how long.

## Where the settings live

Each account's policy is kept in `/var/lib/singularity/parental/USER.conf` and is
written by the `sinty-parentald` system service, which accepts a change only from
an administrator and only for someone else's account.
