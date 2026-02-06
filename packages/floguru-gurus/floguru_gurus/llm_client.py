"""Unified LLM client wrapping LiteLLM for multi-provider access."""

from __future__ import annotations

import time
from typing import Any

import litellm


class LLMClient:
    """Thin wrapper around LiteLLM with token tracking and retries."""

    def __init__(
        self,
        default_model: str = "deepseek/deepseek-reasoner",
        api_base: str | None = None,
        max_retries: int = 2,
    ) -> None:
        self.default_model = default_model
        self.api_base = api_base
        self.max_retries = max_retries
        self.total_tokens = 0

    async def complete(
        self,
        messages: list[dict[str, str]],
        model: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 4096,
        tools: list[dict[str, Any]] | None = None,
    ) -> dict[str, Any]:
        """Send a chat completion request and return the parsed response."""

        model = model or self.default_model
        kwargs: dict[str, Any] = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if self.api_base:
            kwargs["api_base"] = self.api_base
        if tools:
            kwargs["tools"] = tools

        start = time.monotonic()
        response = await litellm.acompletion(**kwargs)
        duration_ms = (time.monotonic() - start) * 1000

        usage = response.get("usage", {}) or {}
        tokens = usage.get("total_tokens", 0)
        self.total_tokens += tokens

        choice = response["choices"][0]
        return {
            "content": choice["message"].get("content", ""),
            "tool_calls": choice["message"].get("tool_calls"),
            "finish_reason": choice.get("finish_reason"),
            "tokens_used": tokens,
            "duration_ms": duration_ms,
            "model": model,
        }
