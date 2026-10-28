---
title: Sinty Compute for developers
description: Reuse the results of expensive work in your app with libsintycompute, and let the kernel tell you when they are stale.
---

[Sinty Compute](/docs/os/sinty-compute/) keeps the result of a computation and
hands it back the next time the same computation is asked for, as long as the
memory it read has not changed. The kernel module watches that memory; your app
only describes the computation.

The feature is off until the user turns it on, and it does not exist outside
Sinty OS. Write your code so it works the same either way: every call below falls
back to running your function.

## When it is worth it

Good candidates take milliseconds or more and give the same output for the same
input: decoding and scaling images, building thumbnails, highlighting a file,
parsing a large document, compiling a script. Calls that take microseconds cost
more in lookups than they save.

## From Vala, with libsingularity

`Singularity.Compute` loads the library at run time, so your app has no hard
dependency on it.

```vala
uint8[] key = Singularity.Compute.key ("thumbnail", "%s\n%lld\n%d".printf (path, mtime, size).data);
uint8[] png = Singularity.Compute.shared ().call (7, key, () => {
    return render_thumbnail (path, size);
});
```

- The first argument is a **region**, a number you choose for each kind of
  computation in your app. Keep it stable across releases.
- The **key** must contain everything the output depends on. Here that is the
  path, the modification time and the size. If two different inputs produce the
  same key, the second gets the first one's result.
- The producer returns the bytes to store. It runs whenever there is no valid
  stored result, and every time when the feature is off.

`Singularity.Compute.load_scaled (path, width, height, preserve_aspect)` does this
for the common case of loading a scaled `Gdk.Pixbuf` from a file.

`Singularity.Compute.available ()` tells whether the library could be loaded. You
do not need to check it before calling.

## From C, with libsintycompute

Include `sintycompute.h` and open `libsintycompute.so.0` with `dlopen` if your
app must also run without it.

```c
sinty_compute_ctx_t *ctx = sinty_compute_ctx_new(0);

uint32_t input;
sinty_compute_input(ctx, source, source_len, &input);

int r = sinty_compute_call(ctx, REGION_LAYOUT, key, key_len, &input, 1,
                           out, out_len, layout_fn, &state);
```

| Function | What it does |
|---|---|
| `sinty_compute_ctx_new(budget)` | Creates a cache that holds up to `budget` bytes of results, 64 MiB when `budget` is 0. Least recently used results go first. Returns `NULL` when the kernel module is not loaded. |
| `sinty_compute_ctx_free(ctx)` | Frees the cache and stops watching its inputs. |
| `sinty_compute_input(ctx, addr, len, &handle)` | Watches a range of your memory. A stored result that read it becomes invalid when any page of the range is written, or when the kernel discards or replaces it. Up to 1024 inputs per context. |
| `sinty_compute_input_drop(ctx, handle)` | Stops watching an input. |
| `sinty_compute_call(ctx, region, key, key_len, inputs, n_inputs, out, out_len, fn, arg)` | Copies a valid stored result into `out`, or runs `fn(arg, out, out_len)` and stores what it wrote if it returned 0. |
| `sinty_compute_ctx_set_verify(ctx, every)` | In verify mode, recomputes one hit out of `every`, 16 by default. |
| `sinty_compute_ctx_report(ctx, &report)` | Hits, misses, verified results, mismatches, and the time saved and spent. |
| `sinty_compute_ctx_used(ctx)` | Bytes currently held. |

Rules for `sinty_compute_call`:

- `out_len` is fixed for a region and key. If the size of your output varies,
  make one call that returns the size and a second that returns the bytes, as
  `Singularity.Compute` does.
- `fn` must write the whole output and have no side effects your app relies on,
  because it may not run.
- A nonzero return from `fn` is passed back to you and nothing is stored.
- Inputs only cover memory. Anything the output depends on that is not in a
  watched range, such as a file's contents or a setting, belongs in the key.

## Modes and verification

The user picks the mode in the Developer page of Settings:

- **Measure** runs `fn` every time and only counts what could have been reused.
- **Active** reuses valid results.
- **Verify** recomputes a share of the hits and compares them with the stored
  bytes. On a mismatch the region is switched off for that context, so a wrong
  key cannot keep showing wrong results.

Run your app in Verify for a while before relying on a new region. Mismatches
appear in `sinty-compute status`.

## The kernel interface

The low-level calls talk to `/dev/sinty-compute` directly: `sinty_compute_open`,
`sinty_compute_track` and `sinty_compute_untrack` for a memory range,
`sinty_compute_generation` to read its counter, which goes up each time the kernel
discards or replaces its pages, and `sinty_compute_state` for the switch and the
mode. They return 0 or a negative error number. Most apps only need the context
functions above. The source is in the
[sinty-compute repository](https://github.com/singularityos-lab/sinty-compute).
