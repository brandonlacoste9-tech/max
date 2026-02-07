# Security Triage — Dependabot Alerts

## Applied fixes

### High severity (fixed)

1. **rollup** (GHSA-gcx4-mw62-g8wm) — DOM Clobbering leading to XSS  
   - Bumped `rollup` and `@rollup/rollup-win32-x64-msvc` from ^4.13.0 to ^4.22.4

2. **@modelcontextprotocol/sdk** (GHSA-345p-7cg4-v4c7) — Cross-client data leak  
   - Added `overrides` in package.json to force ^1.26.0

### Next steps

```bash
cd voyageur-luxury
npm install
npm audit
```

If `npm audit` still reports issues, run `npm audit fix` for any remaining auto-fixable items.

---

## Moderate severity (deferred)

Moderate vulnerabilities remain in **transitive dependencies** of CopilotKit:

- **lodash-es** — Prototype pollution (via chevrotain/langium/mermaid/streamdown)
- **prismjs** — DOM Clobbering (via refractor/react-syntax-highlighter)
- **chevrotain, langium, mermaid, streamdown** — Chain from CopilotKit

Fixing these would require `npm audit fix --force`, which downgrades CopilotKit to 1.10.6 / 0.2.0 — a **breaking change** that may affect the Copilot sidebar. Defer until CopilotKit releases patched versions.

---

## New-user flow checklist

Manual QA for max-inky → Voyageur → Ask Max:

1. Land on **max-inky.vercel.app** (or your deployed URL)
2. Click through to **Voyageur Luxury** (dashboard link)
3. Open **Ask Max** (message icon bottom-right)
4. Try: **help** → should list commands
5. Try: **status** → should show diagnostics (or "no data" if fresh)
6. Try: **run demo** → should run Guru task (requires LLM keys)
7. Try: **check max-inky.vercel.app** → should return status, title, H1

Ensure API is running: `python floguru.py api` and dashboard proxy points to it.
