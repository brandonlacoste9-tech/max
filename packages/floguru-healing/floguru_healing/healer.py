"""HyperHealer — the self-improvement engine.

Analyses past execution records to:
1. Identify recurring failure patterns.
2. Suggest prompt / config adjustments.
3. Track performance trends over time.
"""

from __future__ import annotations

from collections import Counter
from typing import Any

from floguru_shared.events import Event, EventBus
from floguru_shared.guru_base import GuruResult

from floguru_healing.memory import ExecutionMemory, ExecutionRecord


class HyperHealer:
    """Learns from past Guru executions and surfaces improvement signals.

    Wire it into the EventBus so it automatically records every
    ``task.completed`` / ``task.failed`` event.
    """

    def __init__(
        self,
        memory: ExecutionMemory | None = None,
        event_bus: EventBus | None = None,
    ) -> None:
        self.memory = memory or ExecutionMemory()
        self.event_bus = event_bus

        if self.event_bus:
            self.event_bus.on("task.completed", self._on_task_done)
            self.event_bus.on("task.failed", self._on_task_done)

    async def _on_task_done(self, event: Event) -> None:
        """Automatically record task outcomes from the event bus."""
        payload = event.payload
        self.memory.append(ExecutionRecord(
            task_id=payload.get("task_id", ""),
            guru_name=payload.get("guru", "unknown"),
            tier=payload.get("tier", ""),
            success=payload.get("success", False),
            timestamp=event.timestamp,
        ))

    def record(self, result: GuruResult, guru_name: str, tier: str, tags: list[str] | None = None) -> None:
        """Manually record a GuruResult."""
        self.memory.append(ExecutionRecord(
            task_id=result.task_id,
            guru_name=guru_name,
            tier=tier,
            output_summary=str(result.output)[:200] if result.output else "",
            success=result.success,
            confidence=result.confidence,
            tokens_used=result.tokens_used,
            duration_ms=result.duration_ms,
            error=result.error,
            tags=tags or [],
        ))

    def diagnose(self) -> dict[str, Any]:
        """Analyse execution history and return an improvement report."""
        all_records = self.memory.query(limit=10_000)
        if not all_records:
            return {"status": "no_data", "recommendations": []}

        total = len(all_records)
        successes = sum(1 for r in all_records if r.success)
        failures = total - successes

        # Per-guru breakdown
        guru_stats: dict[str, dict[str, Any]] = {}
        for r in all_records:
            if r.guru_name not in guru_stats:
                guru_stats[r.guru_name] = {"total": 0, "failures": 0, "avg_duration": 0.0, "total_tokens": 0}
            s = guru_stats[r.guru_name]
            s["total"] += 1
            if not r.success:
                s["failures"] += 1
            s["avg_duration"] += r.duration_ms
            s["total_tokens"] += r.tokens_used

        for name, s in guru_stats.items():
            s["avg_duration"] = round(s["avg_duration"] / s["total"], 1) if s["total"] else 0
            s["success_rate"] = round((s["total"] - s["failures"]) / s["total"], 3) if s["total"] else 0

        # Failure pattern detection
        error_counter: Counter[str] = Counter()
        for r in all_records:
            if not r.success and r.error:
                # Normalise error to first 80 chars
                error_counter[r.error[:80]] += 1

        top_errors = error_counter.most_common(5)

        # Recommendations
        recommendations: list[str] = []
        for name, s in guru_stats.items():
            if s["success_rate"] < 0.7:
                recommendations.append(
                    f"{name}: success rate is {s['success_rate']:.0%} — consider adjusting "
                    f"its system prompt or switching to a more capable model."
                )
            if s["avg_duration"] > 10_000:
                recommendations.append(
                    f"{name}: average latency {s['avg_duration']:.0f}ms — consider a smaller "
                    f"model or reducing max_tokens."
                )

        return {
            "status": "ok",
            "total_executions": total,
            "overall_success_rate": round(successes / total, 3),
            "guru_stats": guru_stats,
            "top_errors": top_errors,
            "recommendations": recommendations,
        }
