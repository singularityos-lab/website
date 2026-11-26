---
title: App start-up plans
description: Describe how your app starts as a plan of tasks and milestones, and let libsingularity schedule, measure and remember it.
---

An app built on libsingularity starts through `Singularity.Startup`. Instead of
doing everything in `activate()`, the app describes its start as a **plan**, and
libsingularity runs it: in dependency order, with the work that shows the window
first, the rest on worker threads or after the window is ready, and with a
measurement for every step.

An app that does not describe a plan still goes through the same runner. Its
`activate()` becomes a single task, so it gets the trace and the D-Bus report
without changing anything.

## Making an app bootable

Implement `Singularity.Startup.Bootable` on your `Singularity.Application`:

```vala
public class App : Singularity.Application, Singularity.Startup.Bootable {
    public Singularity.Startup.Plan build_plan(Singularity.Startup.Request request) {
        var plan = new Singularity.Startup.Plan();
        plan.version = "myapp-1";
        plan.main("window", Singularity.Startup.Category.SHELL, (c) => {
            build_window();
            c.window = main_window;
            main_window.present();
        }).reaches(Singularity.Startup.Milestone.SHELL_READY)
          .reaches(Singularity.Startup.Milestone.CONTENT_READY)
          .reaches(Singularity.Startup.Milestone.INTERACTIVE);
        return plan;
    }

    public void handle_request(Singularity.Startup.Request request) {
        main_window.present();
    }
}
```

`build_plan()` is called once, for the first request. Requests that arrive later
go to `handle_request()`. Requests that arrive while the app is still starting are
queued and handled, in order, once the app reaches **interactive**.

## Requests

A `Request` says why the app was started:

| Kind | When |
| --- | --- |
| `ACTIVATE` | The app was opened from the launcher, the dock or the command line. |
| `OPEN` | The app was asked to open files. `request.files()` lists them. |
| `SERVICE` | The app was started in the background to answer another app, without a window. |

Build a different plan for each kind. A `SERVICE` start usually needs no window
at all, and an `OPEN` start is interactive only once the file is shown.

## Tasks

Every task has an id, a category and a place to run.

| Method | Runs |
| --- | --- |
| `plan.main(id, category, work)` | On the main thread, in one go. |
| `plan.steps(id, category, work)` | On the main thread, in slices: `work` returns `true` while there is more to do, so frames are drawn in between. |
| `plan.worker(id, category, work, apply)` | `work` on a worker thread, then `apply` on the main thread with its result. |
| `plan.cached(id, category, key, work, apply)` | Like `worker`, with the bytes `work` returns kept by Sinty Compute under `key` and reused at the next start while they are still valid. |

The **category** says what the task is for:

| Category | Use it for |
| --- | --- |
| `PREPARE` | What the window needs before it can be built: settings, a database, a library folder. |
| `SHELL` | Building and presenting the window. |
| `CONTENT` | Filling the window with what the person came for. |
| `DEFERRED` | Everything that can wait: monitors, indexers, prefetching. It runs in the background once the app is usable. |

A task returns itself from every modifier, so they chain:

- `depends_on(id)` waits for another task to finish.
- `reaches(milestone)` marks the task as one that a milestone waits for.
- `recoverable(feature)` lets the task fail without stopping the start. The app
  opens with `feature` turned off; read the list with
  `runner.disabled_features()`.
- `budget(ms)` is how long the task is expected to take. Longer runs are
  recorded as an overrun.
- `heavy_io()`, `memory(bytes)` and `uncancellable()` describe the task to the
  scheduler.

A task that is not recoverable is essential. When it fails, the start stops and
`show_startup_error(window, task, error)` is called. The default implementation
shows a **Could Not Start** dialog with the error message, and quits the app when
it is closed if no window was shown yet. Override it to say something more
useful.

## Milestones

| Milestone | Reached when |
| --- | --- |
| `SHELL_READY` | Every task that reaches it is done: the window is on screen. |
| `CONTENT_READY` | What the person came for is shown. |
| `INTERACTIVE` | The app can be used. Queued requests are handled here. |
| `SETTLED` | Every task, deferred ones included, has finished. |

Wait for one from code with `yield Singularity.Startup.Boot.of(app).wait(milestone)`,
or connect to the `milestone` signal of the same object.

## Validation

A plan is checked before it runs. It is refused, with the reason in the log and
an error shown to the person, when:

- two tasks have the same id, or a task depends on itself or on a task that does
  not exist;
- the dependencies form a cycle;
- no task reaches `SHELL_READY`, `CONTENT_READY` or `INTERACTIVE`;
- a `DEFERRED` task reaches one of those three milestones, or a task that reaches
  one of them waits for a `DEFERRED` task.

The last rule keeps work that can wait from delaying the window.

## Scheduling

The runner walks back from the tasks that reach the first three milestones and
marks their whole chain as the **critical path**.

| Task | Worker priority | Main thread priority |
| --- | --- | --- |
| On the critical path, reaching `SHELL_READY` or `INTERACTIVE` | interactive | default |
| Elsewhere on the critical path | user | default |
| Off the critical path | utility | low |
| `DEFERRED` | background | low |

## Profiles

When the app settles, the runner records how long each task took, in
`$XDG_STATE_HOME/singularity/startup/`, one profile per app and per kind of
request. Durations are averaged across starts. After three starts the profile is
trusted, and the runner orders the critical path by the measured durations
instead of the budgets.

A profile is tied to the plan version and to the size and date of the app
binary. Change `plan.version` when you change the plan, and an update of the app
discards the old numbers on its own.

## Policies

`SINGULARITY_STARTUP_POLICIES` turns the optional behaviours on and off. It is a
comma separated list; when unset, all of them are on.

| Policy | Effect |
| --- | --- |
| `compute` | `cached` tasks reuse their result through Sinty Compute. |
| `scheduler` | `DEFERRED` tasks run at background priority. |
| `memory` | Start-up memory is returned to the system once the app settles. |
| `all` | All of the above. |

Run with `SINGULARITY_STARTUP_POLICIES=` (empty) to start without any of them
and check that the app looks and behaves the same.

## Tracing a start

Set `SINGULARITY_STARTUP_TRACE` to a file path and the app writes a report of its
start there: the time of the first layout, the first render and the first frame
on screen, each milestone, and every task with its duration, its overrun and
whether its result was reused.

```sh
SINGULARITY_STARTUP_TRACE=start.json singularity-photos
```

A running app also answers on the session bus, with the `dev.sinty.Startup1`
interface on its own object path. Its `Report` method returns, as JSON, the plan
kind, the state, the time of each milestone, the longest slice of main thread
work, the disabled features and every task.
