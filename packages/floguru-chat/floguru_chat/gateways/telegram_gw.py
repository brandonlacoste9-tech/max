"""Telegram gateway adapter using python-telegram-bot."""

from __future__ import annotations

import logging
from typing import Any

from floguru_chat.base import ChatGateway, IncomingMessage, OutgoingMessage

logger = logging.getLogger(__name__)


class TelegramGateway(ChatGateway):
    """Connects FloGuru to Telegram via the Bot API.

    Requires ``python-telegram-bot`` (install with ``pip install floguru-chat[telegram]``).
    """

    platform = "telegram"

    def __init__(self, bot_token: str) -> None:
        self.token = bot_token
        self._app: Any = None
        self._callback: Any = None

    async def start(self) -> None:
        from telegram.ext import ApplicationBuilder, MessageHandler, filters

        self._app = ApplicationBuilder().token(self.token).build()

        async def _handle(update: Any, context: Any) -> None:
            if update.message and update.message.text and self._callback:
                msg = IncomingMessage(
                    platform="telegram",
                    chat_id=str(update.message.chat_id),
                    user_id=str(update.message.from_user.id),
                    username=update.message.from_user.username or "",
                    text=update.message.text,
                    raw={"update_id": update.update_id},
                )
                await self._callback(msg)

        self._app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, _handle))
        logger.info("Telegram gateway starting (polling)…")
        await self._app.initialize()
        await self._app.start()
        await self._app.updater.start_polling()

    async def stop(self) -> None:
        if self._app:
            await self._app.updater.stop()
            await self._app.stop()
            await self._app.shutdown()

    async def send(self, message: OutgoingMessage) -> None:
        if self._app:
            await self._app.bot.send_message(
                chat_id=message.chat_id,
                text=message.text,
                reply_to_message_id=int(message.reply_to) if message.reply_to else None,
            )

    def on_message(self, callback: Any) -> None:
        self._callback = callback

    async def handle_webhook(self, body: dict[str, Any]) -> None:
        """Process an incoming Telegram webhook payload."""
        from telegram import Update
        from telegram.ext import ContextTypes
        
        if not self._app:
            return
            
        update = Update.de_json(body, self._app.bot)
        if update and update.message and update.message.text and self._callback:
            msg = IncomingMessage(
                platform="telegram",
                chat_id=str(update.message.chat_id),
                user_id=str(update.message.from_user.id),
                username=update.message.from_user.username or "",
                text=update.message.text,
                raw={"update_id": update.update_id},
            )
            await self._callback(msg)
