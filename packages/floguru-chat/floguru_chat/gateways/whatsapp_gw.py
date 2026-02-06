"""WhatsApp gateway adapter using the WhatsApp Cloud API (webhook-based)."""

from __future__ import annotations

import logging
from typing import Any

import httpx

from floguru_chat.base import ChatGateway, IncomingMessage, OutgoingMessage

logger = logging.getLogger(__name__)

GRAPH_API = "https://graph.facebook.com/v19.0"


class WhatsAppGateway(ChatGateway):
    """Connects FloGuru to WhatsApp via the Meta Cloud API.

    This gateway exposes webhook handlers that should be mounted in
    the FloGuru API server (see ``floguru_api``).  It sends outbound
    messages via the Graph API.
    """

    platform = "whatsapp"

    def __init__(self, phone_number_id: str, access_token: str, verify_token: str = "floguru") -> None:
        self.phone_number_id = phone_number_id
        self.access_token = access_token
        self.verify_token = verify_token
        self._callback: Any = None
        self._http = httpx.AsyncClient(
            base_url=GRAPH_API,
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=30,
        )

    async def start(self) -> None:
        logger.info("WhatsApp gateway ready (webhook mode, phone_number_id=%s)", self.phone_number_id)

    async def stop(self) -> None:
        await self._http.aclose()

    async def send(self, message: OutgoingMessage) -> None:
        payload = {
            "messaging_product": "whatsapp",
            "to": message.chat_id,
            "type": "text",
            "text": {"body": message.text},
        }
        resp = await self._http.post(
            f"/{self.phone_number_id}/messages",
            json=payload,
        )
        resp.raise_for_status()

    def on_message(self, callback: Any) -> None:
        self._callback = callback

    async def handle_webhook(self, body: dict[str, Any]) -> None:
        """Process an incoming WhatsApp webhook payload.

        Mount this in your FastAPI / Flask route that receives the
        ``POST /webhook/whatsapp`` requests from Meta.
        """
        for entry in body.get("entry", []):
            for change in entry.get("changes", []):
                value = change.get("value", {})
                for msg in value.get("messages", []):
                    if msg.get("type") == "text" and self._callback:
                        contact = (value.get("contacts") or [{}])[0]
                        incoming = IncomingMessage(
                            platform="whatsapp",
                            chat_id=msg["from"],
                            user_id=msg["from"],
                            username=contact.get("profile", {}).get("name", ""),
                            text=msg["text"]["body"],
                            raw=msg,
                        )
                        await self._callback(incoming)
