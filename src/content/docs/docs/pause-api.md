---
title: App pause for developers
description: How the desktop pauses an app, the D-Bus interface behind it, and how an app can react to being paused or pause its own work.
---

Users can [pause an app](/docs/os/pausing-apps/) from the dock, from Monitor, or
when the computer suggests it. This page explains what happens to your app and
what it can do about it.

## What pausing does

Every app the desktop launches runs in its own cgroup under the user session,
named after its desktop ID. Pausing writes `1` to that cgroup's `cgroup.freeze`:
every process of the app stops at once, wherever it is, and uses no processor
time until it is resumed. Nothing is signalled or closed. The desktop then asks
the kernel to reclaim the app's memory, which [memory tiering](/docs/os/memory-tiering/)
moves out of RAM.

Because the whole app is frozen, it cannot run code when it is paused. It can
only notice afterwards, when it is resumed. Plan for these effects:

- Timers on the monotonic clock fire late, all at once. Compare the time that
  passed with the time you expected before acting on a timeout.
- Network peers may have dropped the connection. Reconnect instead of assuming
  a socket is still alive.
- Audio and video devices may have moved on. Reopen streams if they report
  errors.

Apps that are playing audio are never included in the automatic suggestions.

## The D-Bus interface

The desktop exports the interface on the session bus.

| | |
|---|---|
| Bus name | `dev.sinty.desktop` |
| Object path | `/dev/sinty/Shell/AppPause` |
| Interface | `dev.sinty.Shell.AppPause` |

| Member | Signature | Meaning |
|---|---|---|
| `Available` | property `b` | `false` when the session has no writable cgroup tree, for example outside Sinty OS. |
| `ListApps` | `() -> aa{sv}` | One entry per running app: `app-id` (s), `paused` (b), `cpu-usec` (t), `memory` (t), `swapped` (t). |
| `Pause` | `(s app_id) -> b` | Freezes the app. Returns `false` if it is not running or already paused. |
| `Resume` | `(s app_id) -> b` | Thaws the app. Returns `false` if it was not paused. |
| `Changed` | signal `(s app_id, b paused)` | Emitted after an app is paused or resumed. |

The app ID is the desktop file name without `.desktop`.

To react to your own resume, subscribe to `Changed` and act when `app_id` is
yours and `paused` is `false`. You will not see the `paused = true` signal for
yourself, because by then your process is frozen. It stays queued and arrives
together with the resume.

```vala
var bus = Bus.get_sync (BusType.SESSION);
bus.signal_subscribe ("dev.sinty.desktop", "dev.sinty.Shell.AppPause", "Changed",
    "/dev/sinty/Shell/AppPause", null, DBusSignalFlags.NONE,
    (conn, sender, path, iface, name, args) => {
        string app_id;
        bool paused;
        args.get ("(sb)", out app_id, out paused);
        if (app_id == "dev.sinty.example" && !paused)
            reconnect ();
    });
```

From a shell:

```sh
gdbus call --session --dest dev.sinty.desktop \
  --object-path /dev/sinty/Shell/AppPause \
  --method dev.sinty.Shell.AppPause.Pause dev.sinty.example
```

## Pausing work inside your app

An app can offer its own pause for parts of its work, the way Leafs pauses a
single terminal. Keep it consistent with the system pause:

- Stop the work for real. For child processes, send `SIGSTOP` to every process
  in their session and `SIGCONT` to resume. `SIGTSTP` is not enough, because
  shells ignore it.
- Show the paused part in black and white with a round play button in the
  middle, 72 pixels across. A click on the button resumes it.
- Block input to the paused part, so keystrokes do not pile up.
- If the user closes a paused part, resume it after sending the closing signal,
  or the processes never see it.

Outside Sinty OS, `Available` is `false` and the dock does not offer the pause
actions. An app's own pause keeps working, because it only uses signals.
