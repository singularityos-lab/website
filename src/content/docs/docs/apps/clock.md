---
title: Clock
description: Alarms, world clocks, a stopwatch, a timer and Pomodoro sessions.
---

Clock has four views: **World**, **Alarms**, **Stopwatch** and **Timer**.

## Alarms

An alarm has a time, the days it repeats (once, every day, weekdays, weekends or
the days you pick) and a label. Alarms and timers ring even when the Clock window
is closed: Clock starts in the background at login and keeps running while an
alarm is on or a timer counts. You can snooze an alarm, or skip only its next
ring.

## World clocks

Add the cities you care about to see their time next to yours.

## Stopwatch and timer

The stopwatch records laps. The timer counts down from up to 24 hours, and can be
paused and resumed.

## Pomodoro

**Start Pomodoro** runs a focus session, then a short break, and a long break after
every fourth session. Set the lengths in Settings, Apps, Clock.

While a timer or a Pomodoro runs, a countdown appears in the top bar and the Timer
tile in quick settings shows it; click it to pause, resume or cancel. A Pomodoro
can also be started from the tile.

## For developers

Clock exports its timers on the session bus as `dev.sinty.Clock.Timers` on
`dev.sinty.clock`, so widgets and other apps can show and control them. The
interface is described in the
[singularity-clock repository](https://github.com/singularityos-lab/singularity-clock).
