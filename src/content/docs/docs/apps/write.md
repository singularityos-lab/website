---
title: Write
description: The Singularity markdown editor and PDF reader.
---

Write is for prose. It is a Markdown editor with a live preview, a reader for
PDFs, and a rich-text mode for documents laid out on a page.

## Markdown

The Markdown editor has three layouts you can cycle through: editor only, a split
with the preview beside it, and preview only. The preview renders as you type. As
you write, Write helps along the way: typing `#` and a space turns a line into a
heading, `>` starts a quote, lists continue themselves on the next line, and
`---` becomes a divider. A live word count sits in the toolbar, and autosave keeps
a saved file up to date.

Smart quotes and auto-correct are on by default, turning straight quotes curly
and expanding things like `--`, `...`, and `(c)` into their proper characters.
You can export to PDF or save a copy as Markdown.

## Reading PDFs

Open a PDF and Write shows it as a scrollable, paginated document. You can keep
several PDFs open as tabs and switch between them. PDF viewing is read-only:
Write opens and reads PDFs, it does not annotate or edit them.

## Rich-text documents

Write also has a page-based rich-text mode, with a paper canvas, adjustable
margins, and a ruler. A formatting toolbar covers bold, italic, headings, lists,
and quotes, and you can insert links, tables, images, and footnotes. An outline
in the sidebar tracks your headings in any mode.

:::caution[Still in development]
The rich-text document mode and its export are still being built. The Markdown
editor and the PDF reader are the solid parts today; the page-based editor is
rougher and its file export is incomplete.
:::

## Finding text

Find and replace is available in both Markdown and document modes with `Ctrl+F`
and `Ctrl+H`, with a match count and wrap-around.
