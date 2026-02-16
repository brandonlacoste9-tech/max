# MAX — The Guru on Floguru.com

**MAX** is the AI assistant and guru on Floguru.com. MAX greets visitors in their language and helps them with whatever they need.

### MAX Features

- **Multi-language Greeting** — English, Quebec French, Spanish, Brazilian Portuguese
- **Adaptive Help** — Lawyer, Plumber, Therapist, Diet/Fitness, Life Coach, Advertiser — anyone
- **Never Pushy** — Calm, patient, friendly
- **Never Forget** — Remembers everything about each user
- **Multi-channel** — WhatsApp, Telegram, Website, SMS, Voice
- **Voice** — ElevenLabs TTS for speaking

### Greetings

| Language | Greeting |
|----------|----------|
| English | "Hello! What may I help you with today?" |
| Quebec French | "Bonjour! Qu'est-ce que je peux vous aider?" |
| Spanish | "¡Hola! ¿En qué puedo ayudarte?" |
| Brazilian Portuguese | "Olá! Em que posso ajudá-lo?" |

---

# MAXIMUS EMPIRE: The Sovereign Stack

**Status:** ACTIVE (Phase 2 — FloGuru Platform)
**Brain:** Gemini 2.5 Pro (Cloud) + Ollama Bridge (Local) + DeepSeek R1 (Reasoning)
**Interface:** FloGuru.com (Web) + OpenClaw (WhatsApp) + Telegram + Discord

---

## FloGuru — AI-Powered Automation Platform

FloGuru is the modular automation core of the Maximus Empire. It provides specialised AI "Guru" agents that handle reasoning, code generation, browser automation, and multi-channel chat — all wired together with a self-improving HyperHealing engine.

### Core Features

- **AI Reasoning Gurus** — Specialised agents (ReasonerGuru, CoderGuru, BrowserGuru) that use advanced LLMs (DeepSeek, Gemini) to understand and automate complex tasks.
- **Intelligent Routing** — Tasks are automatically dispatched to the right Guru tier (Reflex / Logic / Worker / Vision) based on content analysis.
- **Browser Automation** — Playwright-based headless control for end-to-end browser workflows, directed by AI.
- **HyperHealing** — Self-improvement engine that records execution history, detects failure patterns, and recommends prompt/model adjustments.
- **Chat Integrations** — Out-of-the-box gateways for Telegram, WhatsApp, and Discord with a unified message model.
- **Modular Architecture** — Six decoupled packages for independent development and deployment.

---

## Project Structure

```
max/
├── packages/
│   ├── floguru-shared/      Shared types, base Guru class, event bus, task model
│   ├── floguru-gurus/       AI reasoning agents (Reasoner, Coder) + LLM client + Router
│   ├── floguru-browser/     Browser automation engine (Playwright) + BrowserGuru
│   ├── floguru-healing/     HyperHealing self-improvement (execution memory + diagnostics)
│   ├── floguru-chat/        Chat gateway framework + Telegram/Discord/WhatsApp adapters
│   └── floguru-api/         FastAPI backend (tasks, gurus, health, webhooks)
├── voyageur-luxury/         React/Vite frontend with FloGuru dashboard
├── floguru.py               Unified CLI launcher
├── pyproject.toml            Root project config
├── maximus_router.py        Legacy 4-tier intelligence router
├── ollama_bridge.py         Ollama local model orchestration
└── max-config.json          Gateway configuration
```

### Package Dependency Graph

```
floguru-shared  (base — no internal deps)
    ├── floguru-gurus     (shared + litellm)
    ├── floguru-browser   (shared + playwright)
    ├── floguru-healing   (shared)
    ├── floguru-chat      (shared + httpx)
    └── floguru-api       (shared + gurus + healing + chat + fastapi)
```

---

## Quick Start

```bash
# 1. Install all packages (editable mode)
pip install -e packages/floguru-shared
pip install -e packages/floguru-gurus
pip install -e packages/floguru-browser
pip install -e packages/floguru-healing
pip install -e "packages/floguru-chat[all]"
pip install -e packages/floguru-api

# 2. Start the FloGuru API server
python floguru.py api

# 3. Start the Voyageur Luxury frontend
cd voyageur-luxury && npm install && npm run dev

# 4. Run HyperHealing diagnostics
python floguru.py diagnose

# 5. Run health suite (API must be running)
python floguru.py health
```

### Ask Max

Ask Max is a conversational API and UI for quick status checks and demo flows. Use it from the fixed panel at the bottom-right of the Voyageur dashboard, or via REST:

```bash
# Status (HyperHealing diagnostics summary)
curl -X POST http://localhost:8420/api/max -H "Content-Type: application/json" -d '{"message":"status"}'

# Run demo flow (submits a safe Guru task)
curl -X POST http://localhost:8420/api/max -H "Content-Type: application/json" -d '{"message":"run demo"}'

# Check site health (status, title, H1)
curl -X POST http://localhost:8420/api/max -H "Content-Type: application/json" -d '{"message":"check max-inky.vercel.app"}'
curl -X POST http://localhost:8420/api/browser/check-site -H "Content-Type: application/json" -d '{"url":"https://max-inky.vercel.app"}'
```

Supported messages: `"status"` → diagnostics summary; `"run demo"` → runs the demo Guru task; `"check <url>"` → site health (status code, title, H1); `"help"` → list of commands.

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | System health check |
| GET | `/api/gurus` | List registered Gurus |
| GET | `/api/gurus/stats` | Per-guru execution statistics |
| GET | `/api/diagnostics` | HyperHealing diagnosis report |
| POST | `/api/max` | Natural language helper for status and demo tasks |
| POST | `/api/browser/check-site` | Check a URL (status code, title, H1) |
| POST | `/api/tasks` | Submit a task to the Guru router |
| POST | `/api/tasks/batch` | Submit multiple tasks |
| POST | `/api/webhook/whatsapp` | WhatsApp incoming webhook |
| POST | `/api/webhook/telegram` | Telegram incoming webhook |

---

## Architecture Overview

```
                     ┌─────────────────────────┐
                     │   Voyageur Luxury (React)│
                     │   + FloGuru Dashboard    │
                     └──────────┬──────────────┘
                                │ HTTP
                     ┌──────────▼──────────────┐
                     │   FloGuru API (FastAPI)  │
                     │   /api/tasks, /api/gurus │
                     └──────────┬──────────────┘
                                │
                     ┌──────────▼──────────────┐
                     │      GuruRouter          │
                     │  (tier detection + dispatch)
                     └───┬────┬────┬────┬──────┘
                         │    │    │    │
               ┌─────────┘    │    │    └─────────┐
               ▼              ▼    ▼              ▼
         ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
         │ Reflex   │  │  Logic   │  │  Worker  │  │  Vision  │
         │ (Gemma)  │  │(DeepSeek)│  │ (Gemini) │  │ (LLaVA)  │
         └──────────┘  └──────────┘  └──────────┘  └──────────┘
                                │
                     ┌──────────▼──────────────┐
                     │     HyperHealer         │
                     │  (record → diagnose →   │
                     │   recommend → improve)  │
                     └─────────────────────────┘
```

---

## Current Missions

1. **Sovereign Gateway** — Stabilize local/cloud brain bridge. (ACCOMPLISHED)
2. **Quebecois First** — Launch Voyageur Luxury with Bill 96 compliance. (IN PROGRESS)
3. **YOLO Website** — Deploy FloGuru branding. (ACCOMPLISHED)
4. **FloGuru Platform** — Modular AI automation with Guru agents. (IN PROGRESS)

---

## Chat Gateway Setup

```bash
# Telegram
export TELEGRAM_TOKEN="your-bot-token"

# Discord
export DISCORD_TOKEN="your-bot-token"

# WhatsApp (Cloud API)
export WHATSAPP_TOKEN="your-access-token"
export WHATSAPP_PHONE_ID="your-phone-number-id"
```

Gateways are started automatically when the API server boots, or can be configured individually via the webhook endpoints.
