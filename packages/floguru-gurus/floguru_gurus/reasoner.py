"""ReasonerGuru — deep-thinking agent for complex analysis tasks."""

from __future__ import annotations

import os
import time
from typing import Any

from floguru_shared.guru_base import Guru, GuruConfig, GuruResult, GuruTier
from floguru_shared.task import Task

from floguru_gurus.llm_client import LLMClient

DEFAULT_SYSTEM = (
    "You are a Reasoning Guru — an expert analyst. "
    "Think step-by-step, show your reasoning chain, and provide a clear conclusion. "
    "If uncertain, state your confidence level explicitly."
)


class ReasonerGuru(Guru):
    """Guru specialised in multi-step reasoning and analysis.

    Uses chain-of-thought prompting to break problems down, evaluate
    evidence, and deliver structured conclusions.
    """

    def __init__(
        self,
        config: GuruConfig | None = None,
        llm: LLMClient | None = None,
    ) -> None:
        # Use environment variable or default to Ollama
        model = os.getenv("DEFAULT_MODEL", "ollama/llama3.1")
        api_base = os.getenv("OLLAMA_API_BASE", "http://localhost:11434")
        
        config = config or GuruConfig(
            name="Reasoner",
            tier=GuruTier.LOGIC,
            model=model,
            system_prompt=DEFAULT_SYSTEM,
        )
        super().__init__(config)
        self.llm = llm or LLMClient(default_model=config.model, api_base=api_base)

    async def execute(self, task: Any) -> GuruResult:
        if isinstance(task, Task):
            task_id = task.id
            prompt = task.description or task.title
            context = task.input_data.get("context", "")
        else:
            task_id = "inline"
            prompt = str(task)
            context = ""

        messages = [{"role": "system", "content": self.config.system_prompt}]
        if context:
            messages.append({"role": "user", "content": f"Context:\n{context}"})
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
                reasoning=resp["content"],
                confidence=0.85,
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
