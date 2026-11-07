---
title: Sinty AI
description: Ask an AI model of your choice to use the desktop for you, decide how much it may do on its own, and see every step it took.
---

Sinty AI lets a model open apps, run the actions they offer, read what is on
screen and change settings for you. It is off until you turn it on and choose a
model. Without a model, nothing on the computer uses AI.

## Setting it up

Open **Settings, Sinty AI**, turn on **Use AI** and pick a provider:

| Provider | What it needs |
|---|---|
| `claude-code` | the Claude Code program, signed in with your own account |
| `codex` | the Codex program, signed in with your own account |
| `claude-api` | an API key |
| `ollama` | a model running on an Ollama server, local or on your network; set **Server Address** if it is not on this computer |

**Model Name** picks the model when the provider offers more than one. API keys
are kept in the keyring, never in a settings file.

## Asking

Press **Super + A**, type what you need and press Enter: "open my notes from
yesterday", "put the browser on the right screen", "turn on dark style". The
answer appears below the field, with a card for each action it ran.

The selector next to the field sets how much Sinty AI may do without asking:

| Mode | What it does on its own |
|---|---|
| Plan | only reads; it tells you what it would do |
| Ask | anything that can be undone; it asks before the rest |
| Auto | everything, but asks before anything that cannot be undone once it has read content from outside, such as a web page or a message |
| Autopilot | everything, without asking |

A change counts as one that cannot be undone when the app that offers it says so,
or says nothing. Sending a message and deleting a file are examples.

When a phone is driving Sinty AI, an indicator in the panel names it. Click it
to stop. A stopped agent refuses every request until you resume it with
`sinty-agent resume`.

## Talking

The microphone next to the field, or **Super + Shift + A**, offers two ways to
talk:

- **Voice Message**: say your request; it is sent when you stop talking, or
  when you press the microphone again.
- **Continuous Conversation**: Sinty AI reads each answer aloud and listens
  again, so you can go back and forth. Press the microphone to hang up.

Speech is recognized on the computer with the engine chosen in **Settings,
Keyboard, Dictation**, in the dictation language. The microphone turns the
accent colour while it listens.

## From a phone

In **Settings, Connected Devices**, turn on Sinty AI for a paired phone. The
phone can then send requests and answer the questions Sinty AI asks, with the
same limits as on the desktop. Away from home the connection passes through a relay, inside the same
encrypted link the phone uses on your network, so the relay cannot read it.

## From other AI tools

Sinty AI speaks MCP, so an AI tool that supports MCP servers can use the desktop
through it:

```bash
sinty-agent mcp
```

Add that command as an MCP server in the tool. Requests from programs other than the
desktop itself are confirmed on screen whatever mode is set, except listing apps,
listing their actions and reading the agent's status.

The same command line controls the agent:

```bash
sinty-agent status            # mode and state
sinty-agent mode ask          # plan, ask, auto or autopilot
sinty-agent stop              # refuse every request
sinty-agent resume
sinty-agent allow 12          # answer an open question
sinty-agent deny 12
```

## What it did

Every request, with its result and whether you confirmed it, is written to
`~/.local/state/sinty-agent/receipts.jsonl`. The file stays on the computer.
