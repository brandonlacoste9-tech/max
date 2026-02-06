"""Base classes for chat platform gateways."""

from __future__ import annotations

import abc
from datetime import datetime, timezone
from typing import Any

from pydantic import BaseModel, Field


class IncomingMessage(BaseModel):
    """Normalised inbound message from any chat platform."""

    platform: str  # "telegram" | "whatsapp" | "discord"
    chat_id: str
    user_id: str
    username: str = ""
    text: str = ""
    attachments: list[str] = Field(default_factory=list)
    raw: dict[str, Any] = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class OutgoingMessage(BaseModel):
    """Normalised outbound message to send on any platform."""

    chat_id: str
    text: str = ""
    attachments: list[str] = Field(default_factory=list)
    reply_to: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class ChatGateway(abc.ABC):
    """Abstract gateway interface that each platform adapter implements."""

    platform: str = "unknown"

    @abc.abstractmethod
    async def start(self) -> None:
        """Connect to the platform and begin listening for messages."""

    @abc.abstractmethod
    async def stop(self) -> None:
        """Disconnect and clean up."""

    @abc.abstractmethod
    async def send(self, message: OutgoingMessage) -> None:
        """Send a message on the platform."""

    @abc.abstractmethod
    def on_message(self, callback: Any) -> None:
        """Register a callback for incoming messages."""
