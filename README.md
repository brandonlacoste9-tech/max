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
```

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | System health check |
| GET | `/api/gurus` | List registered Gurus |
| GET | `/api/gurus/stats` | Per-guru execution statistics |
| GET | `/api/diagnostics` | HyperHealing diagnosis report |
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
