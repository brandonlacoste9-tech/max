"""GuruRouter — intelligent task-to-Guru dispatcher."""

from __future__ import annotations

import asyncio
import re
from typing import Any

from floguru_shared.guru_base import Guru, GuruResult, GuruTier
from floguru_shared.task import Task
from floguru_shared.events import Event, EventBus


# Simple keyword heuristics for tier routing
_TIER_KEYWORDS: dict[GuruTier, list[str]] = {
    GuruTier.REFLEX: ["quick", "simple", "translate", "summarize", "lookup"],
    GuruTier.LOGIC: ["analyze", "reason", "compare", "evaluate", "plan", "explain"],
    GuruTier.WORKER: ["code", "implement", "refactor", "build", "script", "deploy"],
    GuruTier.VISION: ["image", "screenshot", "visual", "photo", "diagram", "ui"],
}

# Default timeout for guru execution (seconds)
DEFAULT_TIMEOUT = 60


class GuruRouter:
    """Routes incoming tasks to the most appropriate registered Guru.

    Routing strategy:
    1. Explicit ``task.tags`` override (e.g. ``["tier:worker"]``).
    2. Keyword-based heuristic on task description.
    3. Fallback to LOGIC tier.
    """

    def __init__(self, event_bus: EventBus | None = None) -> None:
        self._gurus: dict[GuruTier, list[Guru]] = {t: [] for t in GuruTier}
        self.event_bus = event_bus or EventBus()

    def register(self, guru: Guru) -> None:
        """Register a Guru under its configured tier."""
        self._gurus[guru.config.tier].append(guru)

    def _detect_tier(self, task: Task) -> GuruTier:
        """Determine the best tier for a task."""
        # Check explicit tag overrides
        for tag in task.tags:
            if tag.startswith("tier:"):
                tier_name = tag.split(":", 1)[1].upper()
                try:
                    return GuruTier(tier_name.lower())
                except ValueError:
                    pass

        # Keyword matching
        text = f"{task.title} {task.description}".lower()
        scores: dict[GuruTier, int] = {t: 0 for t in GuruTier}
        for tier, keywords in _TIER_KEYWORDS.items():
            for kw in keywords:
                scores[tier] += len(re.findall(rf"\b{kw}\b", text))

        best = max(scores, key=lambda t: scores[t])
        if scores[best] > 0:
            return best
        return GuruTier.LOGIC  # sensible default

    def _pick_guru(self, tier: GuruTier) -> Guru | None:
        """Pick the first available Guru for a tier (round-robin could be added)."""
        candidates = self._gurus.get(tier, [])
        return candidates[0] if candidates else None

    async def route(self, task: Task, timeout: float = DEFAULT_TIMEOUT) -> GuruResult:
        """Route a task to the appropriate Guru and return the result."""
        tier = self._detect_tier(task)
        guru = self._pick_guru(tier)

        if guru is None:
            # Fall back across tiers
            for fallback_tier in GuruTier:
                guru = self._pick_guru(fallback_tier)
                if guru is not None:
                    break

        if guru is None:
            return GuruResult(
                guru_id="none",
                task_id=task.id,
                error="No Gurus registered to handle this task.",
            )

        task.mark_running(guru.id)
        await self.event_bus.emit(Event(
            name="task.started",
            payload={"task_id": task.id, "guru": guru.config.name, "tier": tier.value},
            source="router",
        ))

        # Execute with timeout
        try:
            result = await asyncio.wait_for(guru.execute(task), timeout=timeout)
        except asyncio.TimeoutError:
            result = GuruResult(
                guru_id=guru.id,
                task_id=task.id,
                error=f"Task timed out after {timeout}s",
            )

        if result.success:
            task.mark_completed({"output": result.output})
        else:
            task.mark_failed(result.error or "Unknown error")

        await self.event_bus.emit(Event(
            name="task.completed" if result.success else "task.failed",
            payload={"task_id": task.id, "guru": guru.config.name, "success": result.success},
            source="router",
        ))

        return result
