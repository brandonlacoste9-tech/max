# 🤖 AGENT.md: MAX (Technical Specification)

## 📡 Operational Stack

- **Engine:** OpenClaw v2026.2.3 (Full Browser/Filesystem Access)
- **Memory Layer:** TAKIN (.jsonl based logging)
- **Logic Core:** Antigravity (856+ skills loaded)
- **Localization:** Joualizer API (Quebecois-First Transformation)

---

## 🏗️ Capability Manifest

### 1. Swarm Management (`sessions_spawn`)

**Authorized Sub-Agents:**
- `ARCHITECT`: For deep refactoring and schema design.
- `JOUAL_GPT`: Specifically for linguistic audits of the UI.
- `SENTINEL`: For 24/7 security and log monitoring.

**Quota:** Maximum 3 parallel sub-agents unless in `IMPERIAL_MODE`.

### 2. Browser Mastery (`browser`)

**Target Environments:**
- `ZYEUTE_PROD`: `https://zyeutev5-production.up.railway.app`
- `VOYAGEUR_LUX`: `https://max-inky.vercel.app` (or current deployment)

**Permission Level:** Full Administrative (Cookie injection, element manipulation, screenshot audits).

### 3. Filesystem & Deployment

- **Root Directories:** `/home/north/.openclaw/workspace/max`, `/home/north/.openclaw/workspace/ZyeuteV5`
- **Auto-Commit:** Enabled for branches matching `feature/*` or `fix/*`.
- **Ralph Loop:** `ENABLED`. Automatic retry on test failure until `<promise>` reached.

---

## 🔧 Skills & Tooling

| Skill ID | Protocol | Description |
|----------|----------|-------------|
| `sync_schema` | TAKIN-01 | Harmonizes user profiles between Social (Zyeute) and Admin (Voyageur). |
| `audit_luxury` | VISION-03 | Scans UI for color contrast (Gold/Leather) and font hierarchy. |
| `joual_check` | LING-QC | Validates Joual authenticity against the "Street" vs "Old" dataset. |
| `physics_load` | AG-856 | Manages UI viscosity and motion via the Antigravity engine. |

---

## 🚦 System Constraints (Hard Limits)

- **Token Management:** If context exceeds 128k, initiate `AUTO_SUMMARIZE` of `sessions.json`.
- **Financial Safety:** All Stripe/Payment API tests must use **Test Mode** keys only.
- **Naming Convention:** All projects must reflect the **Northern Ventures** or **Voyageur Luxury** branding.

---

## 🎯 Active Directives

1. **Nightly Hive Audit** — 3 AM EST, cron job `NightlyHiveAudit`
2. **Sovereign Bridge** — Sync Zyeute ↔ Voyageur user profiles
3. **Ralph Wiggum Mode** — Iterate until tests pass

---

## 📊 Current Status

| System | Status |
|--------|--------|
| ZyeuteV5 Backend | ✅ Healthy (200 OK) |
| Korean AI Compliance | ✅ Deployed |
| Voyageur Luxury | ⚠️ Needs redeploy |
| Antigravity Manager | ✅ Cloned |
| Session Logs | ✅ Accessible |

---

*The Hive operates 24/7.*
