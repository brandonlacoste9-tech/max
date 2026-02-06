"""Lightweight in-process event bus for decoupled communication."""

from __future__ import annotations

import asyncio
from collections import defaultdict
from datetime import datetime, timezone
from typing import Any, Callable, Coroutine

from pydantic import BaseModel, Field


class Event(BaseModel):
    """An event emitted by any FloGuru component."""

    name: str
    payload: dict[str, Any] = Field(default_factory=dict)
    source: str = ""
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Type alias for async event handlers
Handler = Callable[[Event], Coroutine[Any, Any, None]]


class EventBus:
    """Async publish/subscribe event bus.

    Usage::

        bus = EventBus()
        bus.on("task.completed", my_handler)
        await bus.emit(Event(name="task.completed", payload={...}))
    """

    def __init__(self) -> None:
        self._handlers: dict[str, list[Handler]] = defaultdict(list)

    def on(self, event_name: str, handler: Handler) -> None:
        """Register a handler for an event name."""
        self._handlers[event_name].append(handler)

    def off(self, event_name: str, handler: Handler) -> None:
        """Remove a previously registered handler."""
        self._handlers[event_name] = [
            h for h in self._handlers[event_name] if h is not handler
        ]

    async def emit(self, event: Event) -> None:
        """Dispatch an event to all registered handlers concurrently."""
        handlers = self._handlers.get(event.name, [])
        if handlers:
            await asyncio.gather(*(h(event) for h in handlers))
