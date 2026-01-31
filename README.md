# maxOpenClaw is a personal AI assistant you run on your own devices. It answers you on the channels you already use (WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, Microsoft Teams, WebChat), plus extension channels like BlueBubbles, Matrix, Zalo, and Zalo Personal. It can speak and listen on macOS/iOS/Android, and can render a live Canvas you control. The Gateway is just the control plane — the product is the assistant.

If you want a personal, single-user assistant that feels local, fast, and always-on, this is it.

Website · Docs · DeepWiki · Getting Started · Updating · Showcase · FAQ · Wizard · Nix · Docker · Discord

Preferred setup: run the onboarding wizard (openclaw onboard). It walks through gateway, workspace, channels, and skills. The CLI wizard is the recommended path and works on macOS, Linux, and Windows (via WSL2; strongly recommended). Works with npm, pnpm, or bun. New install? Start here: Getting started

Subscriptions (OAuth):

Anthropic (Claude Pro/Max)
OpenAI (ChatGPT/Codex)
Model note: while any model is supported, I strongly recommend Anthropic Pro/Max (100/200) + Opus 4.5 for long‑context strength and better prompt‑injection resistance. See Onboarding.

Models (selection + auth)
Models config + CLI: Models
Auth profile rotation (OAuth vs API keys) + fallbacks: Model failover
Install (recommended)
Runtime: Node ≥22.

npm install -g openclaw@latest
# or: pnpm add -g openclaw@latest

openclaw onboard --install-daemon
The wizard installs the Gateway daemon (launchd/systemd user service) so it stays running.

Quick start (TL;DR)
Runtime: Node ≥22.

Full beginner guide (auth, pairing, channels): Getting started

openclaw onboard --install-daemon

openclaw gateway --port 18789 --verbose

# Send a message
openclaw message send --to +1234567890 --message "Hello from OpenClaw"

# Talk to the assistant (optionally deliver back to any connected channel: WhatsApp/Telegram/Slack/Discord/Google Chat/Signal/iMessage/BlueBubbles/Microsoft Teams/Matrix/Zalo/Zalo Personal/WebChat)
openclaw agent --message "Ship checklist" --thinking high
Upgrading? Updating guide (and run openclaw doctor).

Development channels
stable: tagged releases (vYYYY.M.D or vYYYY.M.D-<patch>), npm dist-tag latest.
beta: prerelease tags (vYYYY.M.D-beta.N), npm dist-tag beta (macOS app may be missing).
dev: moving head of main, npm dist-tag dev (when published).
Switch channels (git + npm): openclaw update --channel stable|beta|dev. Details: Development channels.

From source (development)
Prefer pnpm for builds from source. Bun is optional for running TypeScript directly.

git clone https://github.com/openclaw/openclaw.git
cd openclaw

pnpm install
pnpm ui:build # auto-installs UI deps on first run
pnpm build

pnpm openclaw onboard --install-daemon

# Dev loop (auto-reload on TS changes)
pnpm gateway:watch
Note: pnpm openclaw ... runs TypeScript directly (via tsx). pnpm build produces dist/ for running via Node / the packaged openclaw binary.

Security defaults (DM access)
OpenClaw connects to real messaging surfaces. Treat inbound DMs as untrusted input.

Full security guide: Security

Default behavior on Telegram/WhatsApp/Signal/iMessage/Microsoft Teams/Discord/Google Chat/Slack:

DM pairing (dmPolicy="pairing" / channels.discord.dm.policy="pairing" / channels.slack.dm.policy="pairing"): unknown senders receive a short pairing code and the bot does not process their message.
Approve with: openclaw pairing approve <channel> <code> (then the sender is added to a local allowlist store).
Public inbound DMs require an explicit opt-in: set dmPolicy="open" and include "*" in the channel allowlist (allowFrom / channels.discord.dm.allowFrom / channels.slack.dm.allowFrom).
Run openclaw doctor to surface risky/misconfigured DM policies.

Highlights
Local-first Gateway — single control plane for sessions, channels, tools, and events.
Multi-channel inbox — WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, BlueBubbles, Microsoft Teams, Matrix, Zalo, Zalo Personal, WebChat, macOS, iOS/Android.
Multi-agent routing — route inbound channels/accounts/peers to isolated agents (workspaces + per-agent sessions).
Voice Wake + Talk Mode — always-on speech for macOS/iOS/Android with ElevenLabs.
Live Canvas — agent-driven visual workspace with A2UI.
First-class tools — browser, canvas, nodes, cron, sessions, and Discord/Slack actions.
Companion apps — macOS menu bar app + iOS/Android nodes.
Onboarding + skills — wizard-driven setup with bundled/managed/workspace skills.
