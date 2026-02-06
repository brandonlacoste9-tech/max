"""Base Guru agent interface and shared data models."""

from __future__ import annotations

import abc
import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class GuruTier(str, Enum):
    """Intelligence tier that a Guru operates on."""

    REFLEX = "reflex"
    LOGIC = "logic"
    WORKER = "worker"
    VISION = "vision"


class GuruConfig(BaseModel):
    """Configuration for a Guru agent."""

    name: str
    tier: GuruTier = GuruTier.LOGIC
    model: str = "deepseek-r1"
    temperature: float = 0.7
    max_tokens: int = 4096
    system_prompt: str = ""
    tools: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)


class GuruResult(BaseModel):
    """Structured output from a Guru execution."""

    guru_id: str
    task_id: str
    output: Any = None
    reasoning: str = ""
    confidence: float = 0.0
    tokens_used: int = 0
    duration_ms: float = 0.0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    error: str | None = None

    @property
    def success(self) -> bool:
        return self.error is None


class Guru(abc.ABC):
    """Abstract base class for all FloGuru agents.

    Every specialised Guru (DeepSeek reasoner, Gemini coder, browser
    automator, etc.) inherits from this and implements ``execute``.
    """

    def __init__(self, config: GuruConfig) -> None:
        self.id = str(uuid.uuid4())
        self.config = config
        self.created_at = datetime.now(timezone.utc)

    @abc.abstractmethod
    async def execute(self, task: Any) -> GuruResult:
        """Run the Guru on a given task and return a structured result."""

    async def health_check(self) -> bool:
        """Return True if the Guru is ready to accept tasks."""
        return True

    def __repr__(self) -> str:
        return f"<{self.__class__.__name__} name={self.config.name!r} tier={self.config.tier.value}>"
