"""Discord gateway adapter using discord.py."""

from __future__ import annotations

import asyncio
import logging
from typing import Any

from floguru_chat.base import ChatGateway, IncomingMessage, OutgoingMessage

logger = logging.getLogger(__name__)


class DiscordGateway(ChatGateway):
    """Connects FloGuru to Discord via a bot account.

    Requires ``discord.py`` (install with ``pip install floguru-chat[discord]``).
    """

    platform = "discord"

    def __init__(self, token: str) -> None:
        self.token = token
        self._client: Any = None
        self._callback: Any = None
        self._task: asyncio.Task[None] | None = None

    async def start(self) -> None:
        import discord

        intents = discord.Intents.default()
        intents.message_content = True
        self._client = discord.Client(intents=intents)

        callback = self._callback

        @self._client.event
        async def on_ready() -> None:
            logger.info("Discord gateway connected as %s", self._client.user)

        @self._client.event
        async def on_message(message: Any) -> None:
            if message.author == self._client.user:
                return
            if callback:
                msg = IncomingMessage(
                    platform="discord",
                    chat_id=str(message.channel.id),
                    user_id=str(message.author.id),
                    username=str(message.author),
                    text=message.content,
                    raw={"guild_id": str(message.guild.id) if message.guild else ""},
                )
                await callback(msg)

        self._task = asyncio.create_task(self._client.start(self.token))

    async def stop(self) -> None:
        if self._client:
            await self._client.close()
        if self._task:
            self._task.cancel()

    async def send(self, message: OutgoingMessage) -> None:
        if self._client:
            channel = self._client.get_channel(int(message.chat_id))
            if channel:
                await channel.send(message.text)

    def on_message(self, callback: Any) -> None:
        self._callback = callback
