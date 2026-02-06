"""Browser action primitives."""

from __future__ import annotations

from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class ActionType(str, Enum):
    NAVIGATE = "navigate"
    CLICK = "click"
    TYPE = "type"
    SCREENSHOT = "screenshot"
    WAIT = "wait"
    SCROLL = "scroll"
    SELECT = "select"
    EXTRACT = "extract"
    EVALUATE = "evaluate"


class PageAction(BaseModel):
    """A single browser action to execute."""

    action: ActionType
    selector: str = ""
    value: str = ""
    timeout_ms: int = 30_000
    metadata: dict[str, Any] = Field(default_factory=dict)
