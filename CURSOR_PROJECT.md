# Cursor Master Blueprint — Max / FloGuru

This file defines Cursor's core roles, standing rules, task templates, and scope principles for the max (FloGuru / Maximus Empire) repository.

---

## 1. Core Roles

Cursor adopts three roles in this repo:

### Guardian
Keep FloGuru healthy:
- Run `python floguru.py health` when config or packages change
- Run `python floguru.py diagnose` for HyperHealing reports
- Use `debug_env.py`, `preflight_check.py`, `quick_test.py` for env/LLM checks

### Builder
Implement small backend/frontend changes:
- Add or modify API routes in `packages/floguru-api`
- Add or modify Ask Max commands in `packages/floguru-api/floguru_api/routes/max.py`
- Add or modify browser skills in `packages/floguru-api/floguru_api/browser_skills.py`
- Update Voyageur UI in `voyageur-luxury/src`

### Integrator
Wire chat/web and external toolkits into FloGuru flows:
- Connect Telegram, WhatsApp, OpenClaw webhooks to FloGuru logic
- Use browser-use, antigravity-awesome-skills, ui-ux-pro-max-skill when asked
- Reference sibling repos via paths in `imperial-config.json`

---

## 2. Standing Rules

(See `.cursor/rules/floguru-conventions.mdc` for the rules Cursor applies automatically.)

Summary:
- After changes in `packages/floguru-*`, `floguru.config.yaml`, `.env`, or `max-config.json` → run `python floguru.py health` and report failing checks
- Before changing routes in `floguru-api` → read `README.md` API section; keep naming/paths consistent
- Before changing Voyageur UI → scan `AskMaxPanel.jsx`, `GuruDashboard.jsx`, `floguru-web` so UX stays coherent
- When adding new behavior → add/update API endpoint, expose via Ask Max or UI, add one example in README or QUICKSTART

---

## 3. Task Templates

Use these patterns when asking Cursor:

| Pattern | Example |
|---------|---------|
| Add Ask Max command | "Add a new Ask Max command that does X, wired to existing Y in floguru-api." |
| Browser task + endpoint | "Create a FloGuru task + API endpoint that calls browser-use or a browser skill to do X on a URL." |
| Wire chat webhook | "Wire Telegram/WhatsApp webhook messages with intent Z to the same flow used by Ask Max command Y." |
| Design system update | "Use ui-ux-pro-max design system to improve component A in Voyageur, keeping the theme from design-system/voyageur-luxury." |

---

## 4. Scope Principle

**One Cursor task = one small, testable change.**

Examples:
- "Add command X" (not "Add commands X, Y, Z")
- "Add endpoint Y" (not "Add endpoints Y and Z and wire them")
- "Add panel section Z" (not "Redesign the whole dashboard")

After each change, run `python floguru.py health` and confirm no regressions.
