"""ChatDispatcher — routes incoming chat messages to Guru tasks."""

from __future__ import annotations

from typing import Any, Callable, Coroutine

from floguru_shared.events import Event, EventBus
from floguru_shared.task import Task

from floguru_chat.base import ChatGateway, IncomingMessage, OutgoingMessage

MessageHandler = Callable[[IncomingMessage], Coroutine[Any, Any, str]]


class ChatDispatcher:
    """Central dispatcher that bridges chat gateways and Guru processing.

    Usage::

        dispatcher = ChatDispatcher(event_bus=bus)
        dispatcher.add_gateway(telegram_gw)
        dispatcher.add_gateway(discord_gw)
        dispatcher.set_handler(my_guru_handler)
        await dispatcher.start_all()
    """

    def __init__(self, event_bus: EventBus | None = None) -> None:
        self._gateways: list[ChatGateway] = []
        self._handler: MessageHandler | None = None
        self.event_bus = event_bus or EventBus()

    def add_gateway(self, gateway: ChatGateway) -> None:
        """Register a chat platform gateway."""
        gateway.on_message(self._on_message)
        self._gateways.append(gateway)

    def set_handler(self, handler: MessageHandler) -> None:
        """Set the function that processes incoming messages and returns a reply."""
        self._handler = handler

    async def _on_message(self, msg: IncomingMessage) -> None:
        """Internal callback — invoked by gateways on new messages."""
        await self.event_bus.emit(Event(
            name="chat.message_received",
            payload={"platform": msg.platform, "user": msg.username, "text": msg.text[:200]},
            source="chat_dispatcher",
        ))

        if self._handler is None:
            return

        reply_text = await self._handler(msg)

        # Find the originating gateway and reply
        for gw in self._gateways:
            if gw.platform == msg.platform:
                await gw.send(OutgoingMessage(chat_id=msg.chat_id, text=reply_text))
                break

        await self.event_bus.emit(Event(
            name="chat.reply_sent",
            payload={"platform": msg.platform, "user": msg.username},
            source="chat_dispatcher",
        ))

    async def start_all(self) -> None:
        """Start all registered gateways."""
        for gw in self._gateways:
            await gw.start()

    async def stop_all(self) -> None:
        """Stop all registered gateways."""
        for gw in self._gateways:
            await gw.stop()
