"""CoderGuru — code generation and refactoring agent."""

from __future__ import annotations

import time
from typing import Any

from floguru_shared.guru_base import Guru, GuruConfig, GuruResult, GuruTier
from floguru_shared.task import Task

from floguru_gurus.llm_client import LLMClient

DEFAULT_SYSTEM = (
    "You are a Coder Guru — an expert software engineer. "
    "Write clean, well-structured code. Follow the language's idioms and best practices. "
    "Include brief inline comments only where the logic is non-obvious."
)


class CoderGuru(Guru):
    """Guru specialised in code generation, review, and refactoring."""

    def __init__(
        self,
        config: GuruConfig | None = None,
        llm: LLMClient | None = None,
    ) -> None:
        config = config or GuruConfig(
            name="Coder",
            tier=GuruTier.WORKER,
            model="gemini/gemini-2.5-pro",
            system_prompt=DEFAULT_SYSTEM,
            temperature=0.3,
        )
        super().__init__(config)
        self.llm = llm or LLMClient(default_model=config.model)

    async def execute(self, task: Any) -> GuruResult:
        if isinstance(task, Task):
            task_id = task.id
            prompt = task.description or task.title
            language = task.input_data.get("language", "")
            existing_code = task.input_data.get("code", "")
        else:
            task_id = "inline"
            prompt = str(task)
            language = ""
            existing_code = ""

        messages = [{"role": "system", "content": self.config.system_prompt}]
        if existing_code:
            messages.append({
                "role": "user",
                "content": f"Existing code ({language}):\n```{language}\n{existing_code}\n```",
            })
        messages.append({"role": "user", "content": prompt})

        start = time.monotonic()
        try:
            resp = await self.llm.complete(
                messages=messages,
                model=self.config.model,
                temperature=self.config.temperature,
                max_tokens=self.config.max_tokens,
            )
            duration = (time.monotonic() - start) * 1000
            return GuruResult(
                guru_id=self.id,
                task_id=task_id,
                output=resp["content"],
                reasoning="",
                confidence=0.9,
                tokens_used=resp["tokens_used"],
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
