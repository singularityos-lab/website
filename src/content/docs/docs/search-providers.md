---
title: Search providers
description: Add your own results to the overview search.
---

The overview search, the one you open with Super and Space, is extensible. Beyond
the built-in app, file, and math results, you can add your own. There are two
ways: a script, for anything you can produce from a command, or an in-process
provider in a plugin, for tighter integration.

This feeds the overview search, not [Spotlight](/docs/spotlight/), which stays
focused on apps and commands.

## A script provider

The simplest path needs no compiling. Drop an executable into
`~/.config/singularity/search-providers/` (the folder is created for you). When
the user types, the shell runs your executable with the query as its first
argument and reads a JSON array of results from standard output:

```sh
#!/usr/bin/env bash
query="$1"
cat <<JSON
[
  {
    "title": "Open the dashboard",
    "description": "Matches: $query",
    "icon": "web-browser-symbolic",
    "score": 0.8,
    "action": "cmd:xdg-open https://example.com"
  }
]
JSON
```

Make it executable with `chmod +x`. Each result object takes:

- `title` (required), the headline.
- `description`, a second line.
- `icon`, an icon name.
- `score`, a number used for ranking.
- `action`. If it starts with `cmd:`, the rest runs as a command when the user
  picks the result.

Keep it quick: it runs on every keystroke.

## An in-process provider

For results that need live state or richer activation, implement the
`SearchProvider` interface from libsingularity inside a [plugin](/docs/plugins/)
and register it. A provider has an `id`, a `name`, and a `search()` that returns
results:

```vala
public class WebSearchProvider : Object, Singularity.SearchProvider {
    public string id   { get { return "web"; } }
    public string name { get { return "Web"; } }

    public async List<Singularity.SearchResult> search (string query, Cancellable? cancellable) throws Error {
        var results = new List<Singularity.SearchResult> ();
        var r = new Singularity.SearchResult (this, "Search the web for " + query,
            null, "web-browser-symbolic");
        r.score = 0.5;
        r.activated.connect (() => {
            try { Process.spawn_command_line_async ("xdg-open https://example.com/?q=" + query); }
            catch (Error e) {}
        });
        results.append (r);
        return results;
    }
}
```

Register it from your plugin's `activate()` with `ctx.add_search_provider (...)`.
A `SearchResult` carries a title, an optional description and icon, a `score`, and
an `activated` signal you connect to. The emoji search that ships enabled is a
provider of exactly this kind.

## How results are ranked

Every provider runs together for each query. The results are merged and sorted by
`score`, highest first, with duplicates collapsed. So a higher score floats your
result up the list.
