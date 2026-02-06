"""BrowserGuru — AI-directed browser automation agent."""

from __future__ import annotations

import json
import time
from typing import Any

from floguru_shared.guru_base import Guru, GuruConfig, GuruResult, GuruTier
from floguru_shared.task import Task

from floguru_browser.actions import ActionType, PageAction
from floguru_browser.automation import BrowserAutomation

BROWSER_SYSTEM = (
    "You are a Browser Guru. You receive a task description and must output a JSON "
    "array of browser actions to accomplish it. Each action is an object with fields: "
    "action (navigate|click|type|screenshot|wait|scroll|select|extract|evaluate), "
    "selector (CSS selector), value (URL or text), timeout_ms (int)."
)


class BrowserGuru(Guru):
    """Guru that translates natural-language tasks into browser action sequences.

    In autonomous mode, an LLM plans the actions. Alternatively, callers can
    supply a pre-built action list via ``task.input_data["actions"]``.
    """

    def __init__(
        self,
        config: GuruConfig | None = None,
        headless: bool = True,
    ) -> None:
        config = config or GuruConfig(
            name="Browser",
            tier=GuruTier.WORKER,
            model="gemini/gemini-2.5-pro",
            system_prompt=BROWSER_SYSTEM,
        )
        super().__init__(config)
        self.automation = BrowserAutomation(headless=headless)

    async def execute(self, task: Any) -> GuruResult:
        if isinstance(task, Task):
            task_id = task.id
            raw_actions = task.input_data.get("actions")
        else:
            task_id = "inline"
            raw_actions = task if isinstance(task, list) else None

        if raw_actions is None:
            return GuruResult(
                guru_id=self.id,
                task_id=task_id,
                error="No actions provided. Supply task.input_data['actions'] as a list.",
            )

        actions = [
            PageAction(**a) if isinstance(a, dict) else a
            for a in raw_actions
        ]

        start = time.monotonic()
        try:
            await self.automation.start()
            results = await self.automation.run_sequence(actions)
            duration = (time.monotonic() - start) * 1000
            return GuruResult(
                guru_id=self.id,
                task_id=task_id,
                output=results,
                confidence=1.0,
                duration_ms=duration,
            )
        except Exception as exc:
            duration = (time.monotonic() - start) * 1000
            return GuruResult(
                guru_id=self.id,
                task_id=task_id,
                duration_ms=duration,
                error=str(exc),
            )
        finally:
            await self.automation.stop()
