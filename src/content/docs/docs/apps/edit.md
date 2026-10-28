---
title: Edit
description: The Singularity code editor.
---

Edit is the code editor. Its whole job is to get out of the way and show you the
code, and it is built around that idea more than any other Singularity app.

## Languages

Edit highlights a broad set of languages out of the box. For most of them it
leans on GtkSourceView, which recognizes the file by its name and colors it: C,
C++, Java, JavaScript, HTML, CSS, XML, Markdown, shell, and many more, with no
setup.

For a handful of languages it goes further, using Tree-sitter to understand the
structure of the file rather than just its tokens:

- Go
- Rust
- Python
- TypeScript
- TSX and JSX

For these, Edit gives you richer highlighting, an outline of the file, and code
folding. The outline and folding are Tree-sitter features, so they appear for the
languages above; other languages still get full highlighting, just not the
structure view.

## Tabs, where you would not expect them

The open files sit as a strip of tabs along the bottom of the window, just above
the status bar, rather than across the top. That is deliberate. It keeps the top
edge clear and your eyes on the code, and it puts the file switcher somewhere that
does not push the code down. When you are reading code, the height of the window
is the thing you are short of, and those few pixels matter. The reasoning behind
this comes from a small [attention study](/docs/ux-research/).

Drag a file chip outside the window to detach it into another Edit window. The
same editor buffer moves with it, including unsaved changes. Detached windows
start with the file browser closed; use the first bubble or F9 to open it. The
main window remembers its sidebar state for the next launch.

## Built for bubbles

Edit leans on [bubble navigation](/docs/bubbles/) harder than anything else on the
desktop. Its toolbar buttons are bubbles floating at the top, the tabs are at the
bottom, and everything in between is your code, edge to edge. That is the bubble
bar doing exactly what it is for: handing the whole window to what you actually
came to look at, and keeping the controls to small pills at the margins.

## Reading and moving around

Line numbers and current-line highlighting are on by default. An optional minimap
(`Alt+M`) gives you a bird's-eye view of long files, the outline panel lists the
file's structure for the Tree-sitter languages, and the command palette (`Ctrl+P`)
lists every action with its shortcut and doubles as a quick way to switch files.
Markdown files get a preview pane with `Ctrl+Shift+M`.

## Finding and editing

Find and replace (`Ctrl+F`, or `Ctrl+H` for replace) supports case sensitivity,
whole words, and regular expressions, with a live match count. Editing has the
comforts you expect: auto-indent, smart backspace, bracket matching, and a
configurable tab width. Edit reads your desktop dark mode and accent color and
regenerates its theme when you change either.

## Projects

**Open Folder** shows a project's files in the sidebar, next to the documents you
have open. **Search in Project** searches every file in it. Recent folders are
kept in the menu, and **Close Folder** goes back to plain documents.

On Sinty OS, Edit can also open a project that lives in the
[developer shell](/docs/dsh/), and run its builds, language servers and
debuggers with the tools installed there.

## Code intelligence

For the main languages Edit starts a language server and shows errors and
warnings as you type, with completion, go to definition and hover information.
It uses `clangd` for C and C++, `gopls` for Go, `pylsp` for Python,
`rust-analyzer` for Rust, `typescript-language-server` for JavaScript and
TypeScript, and `vala-language-server` for Vala, whenever they are installed.
Syntax highlighting uses tree-sitter where a grammar is available.

## Debugging

Set breakpoints with **Toggle Breakpoint**, then **Start Debugging**. Edit runs
the program under `lldb` or `gdb`, stops on breakpoints and shows variables and
the call stack. Save the file first. When no debugger is installed for the
language, Edit tells you which one to install.

## Plugins

Git, the terminal and the agents are plugins, turned on and off from the Edit
section of the system settings.

- **Git** adds a Source Control panel with the changed files, reverting a change
  and committing everything with a message. For history and conflicts it opens the
  project in the Git app.
- **Terminal** shows a terminal below the editor. It comes from Leafs, and can
  open the project in Leafs or in the developer shell.
- **Agents** is installed but off by default. See below.

## Agents

With the Agents plugin on, a panel lets a coding agent work on the project: Claude
Code, Codex, Gemini CLI, GitHub Copilot, OpenCode with local models through
Ollama, and more agents from the ACP registry. An agent downloaded by Edit is
checked against its checksum before it runs.

Each agent signs in with your account, in a terminal, or with an API key that
Edit keeps in your keyring. Each session has a mode:

| Mode | What the agent may do |
|---|---|
| Plan | read only, no changes and no commands |
| Ask First | asks before every change |
| Auto Edit | edits project files, asks before commands |
| Autopilot | works until done inside the project |

Autopilot makes a restore point first, reads and writes only inside the project,
and stops at a time limit. **Restore the project to before Autopilot** puts every
file back. **Follow the agent in the editor** opens the files as the agent
changes them.

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl+N` / `Ctrl+O` / `Ctrl+S` | New, open, save |
| `Ctrl+W` | Close tab |
| `Ctrl+F` / `Ctrl+H` | Find, find and replace |
| `Ctrl+G` | Go to line |
| `Ctrl+D` | Duplicate line |
| `Ctrl+/` | Toggle comment |
| `Alt+Up` / `Alt+Down` | Move line up or down |
| `Ctrl+P` | Command palette |
| `F9` | Toggle the file browser |
| `Alt+M` | Toggle the minimap |
| `Ctrl+Shift+M` | Toggle Markdown preview |
| `Ctrl+-` / `Ctrl+=` | Fold, unfold (Tree-sitter languages) |
