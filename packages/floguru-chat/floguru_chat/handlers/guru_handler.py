"""GuruMessageHandler — routes incoming chat messages through the Guru engine.

This bridges the chat layer to the AI layer: every message becomes a Task,
gets dispatched by the GuruRouter, and the result is returned as the reply.
"""

from __future__ import annotations

from floguru_shared.task import Task
from floguru_gurus.router import GuruRouter
from floguru_healing.healer import HyperHealer

from floguru_chat.base import IncomingMessage


class GuruMessageHandler:
    """Stateless handler that converts chat messages to Guru tasks.

    Usage::

        handler = GuruMessageHandler(guru_router=router, healer=healer)
        dispatcher.set_handler(handler)
    """

    def __init__(
        self,
        guru_router: GuruRouter,
        healer: HyperHealer | None = None,
    ) -> None:
        self.guru_router = guru_router
        self.healer = healer

    async def __call__(self, message: IncomingMessage) -> str:
        """Process an incoming chat message and return a text reply."""
        task = Task(
            title=message.text[:120],
            description=message.text,
            tags=[f"platform:{message.platform}", f"user:{message.user_id}"],
            metadata={
                "chat_id": message.chat_id,
                "username": message.username,
                "platform": message.platform,
            },
        )

        result = await self.guru_router.route(task)

        if self.healer and result:
            self.healer.record(
                result=result,
                guru_name=result.guru_id,
                tier="auto-routed",
                tags=[f"platform:{message.platform}"],
            )

        if result.success:
            output = result.output
            if isinstance(output, str):
                return output
            return str(output)[:4000]
        else:
            return f"I couldn't process that request. Error: {result.error}"
