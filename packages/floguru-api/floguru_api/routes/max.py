"""Ask Max — conversational API for status and demo flows."""

from __future__ import annotations

import re
from typing import Any

from fastapi import APIRouter, Request
from pydantic import BaseModel

from floguru_api.browser_skills import check_site_health

router = APIRouter()


class MaxMessage(BaseModel):
    message: str


def _diagnostics_summary(report: dict[str, Any]) -> str:
    """Turn HyperHealing diagnostics into a short text summary."""
    if report.get("status") == "no_data":
        return "No execution data yet. Submit tasks to build diagnostics."
    lines = []
    total = report.get("total_executions", 0)
    rate = report.get("overall_success_rate", 0)
    lines.append(f"Total executions: {total}. Success rate: {rate:.0%}.")
    guru_stats = report.get("guru_stats", {})
    for name, s in guru_stats.items():
        lines.append(
            f"  {name}: {s.get('total', 0)} runs, "
            f"{s.get('success_rate', 0):.0%} success, "
            f"avg {s.get('avg_duration', 0):.0f}ms"
        )
    recs = report.get("recommendations", [])
    if recs:
        lines.append("Recommendations: " + "; ".join(recs[:3]))
    return "\n".join(lines)


async def _run_demo_task(request: Request) -> dict:
    """Run a safe demo task via the GuruRouter (same as POST /api/tasks)."""
    from floguru_shared.task import Task

    task = Task(
        title="Quick summary",
        description="Summarize the benefits of modular software architecture in two sentences.",
        tags=["tier:reflex"],
    )
    guru_router = request.app.state.guru_router
    result = await guru_router.route(task)
    return {
        "task_id": task.id,
        "status": task.status.value,
        "guru": result.guru_id,
        "output": result.output,
        "confidence": result.confidence,
        "tokens_used": result.tokens_used,
        "duration_ms": result.duration_ms,
        "error": result.error,
    }


@router.post("/max")
async def ask_max(body: MaxMessage, request: Request) -> dict:
    """
    Ask Max v1: status, run demo, or get a short intro.
    """
    msg = (body.message or "").strip().lower()

    if "status" in msg:
        healer = request.app.state.healer
        report = healer.diagnose()
        summary = _diagnostics_summary(report)
        return {"reply": summary}

    if "help" in msg:
        return {
            "reply": (
                "Max v1 can help with:\n"
                "  • status — show system diagnostics (executions, success rate, guru stats)\n"
                "  • run demo — execute a safe Guru task\n"
                "  • check <url> — check a site (status code, title, H1)\n"
                "  • help — show this list"
            )
        }

    # check <url> — e.g. "check max-inky.vercel.app" or "check site https://example.com"
    check_match = re.search(
        r"check\s+(?:site\s+)?(.+)",
        (body.message or "").strip(),
        re.I,
    )
    if check_match:
        url_candidate = check_match.group(1).strip()
        # Require something that looks like a URL (has . or starts with http)
        looks_like_url = "." in url_candidate or url_candidate.startswith(("http://", "https://"))
        if url_candidate and len(url_candidate) < 500 and looks_like_url:
            try:
                result = await check_site_health(url_candidate)
                if result.get("error"):
                    return {
                        "reply": f"Check failed for {result.get('url', url_candidate)}: {result['error']}"
                    }
                lines = [
                    f"Site: {result.get('url')}",
                    f"Status: {result.get('status_code')}",
                    f"Title: {result.get('title') or '(none)'}",
                    f"H1: {result.get('h1') or '(none)'}",
                    f"Duration: {result.get('duration_ms', 0):.0f}ms",
                ]
                return {"reply": "\n".join(lines)}
            except Exception as e:
                return {"reply": f"Check failed: {str(e)}"}

    if "run demo" in msg:
        try:
            demo_result = await _run_demo_task(request)
            if demo_result.get("error"):
                return {
                    "reply": f"Demo ran but had an error: {demo_result['error']}. "
                    "Check your LLM API keys (DEEPSEEK_API_KEY, GEMINI_API_KEY)."
                }
            output_preview = str(demo_result.get("output", ""))[:300]
            return {
                "reply": (
                    f"Demo completed. Guru: {demo_result.get('guru')}. "
                    f"Duration: {demo_result.get('duration_ms', 0):.0f}ms. "
                    f"Output preview: {output_preview}..."
                )
            }
        except Exception as e:
            return {
                "reply": f"Demo failed: {str(e)}. Ensure LLM API keys are set."
            }

    return {
        "reply": "Hi, I'm Max v1. I can show status or run the demo flow."
    }
