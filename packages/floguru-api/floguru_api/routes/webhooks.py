"""Webhook endpoints for chat platform integrations."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Request, Response, Query

router = APIRouter()


@router.get("/webhook/whatsapp")
async def whatsapp_verify(
    request: Request,
    hub_mode: str = Query(alias="hub.mode", default=""),
    hub_verify_token: str = Query(alias="hub.verify_token", default=""),
    hub_challenge: str = Query(alias="hub.challenge", default=""),
) -> Response:
    """WhatsApp webhook verification (GET)."""
    if hub_mode == "subscribe" and hub_verify_token == "floguru":
        return Response(content=hub_challenge, media_type="text/plain")
    return Response(status_code=403)


@router.post("/webhook/whatsapp")
async def whatsapp_incoming(request: Request) -> dict:
    """Receive incoming WhatsApp messages."""
    body = await request.json()
    # In production, forward to WhatsAppGateway.handle_webhook(body)
    return {"status": "received"}


@router.post("/webhook/telegram")
async def telegram_incoming(request: Request) -> dict:
    """Receive Telegram webhook updates (alternative to polling)."""
    body = await request.json()
    return {"status": "received"}
