"""Webhook endpoints for chat platform integrations."""

from __future__ import annotations

import os
from typing import Any

from fastapi import APIRouter, Request, Response, Query

from floguru_chat.gateways import WhatsAppGateway, TelegramGateway, DiscordGateway

router = APIRouter()

# Gateway instances (initialized in create_app)
_whatsapp_gw: WhatsAppGateway | None = None
_telegram_gw: TelegramGateway | None = None
_discord_gw: DiscordGateway | None = None


def init_gateways() -> None:
    """Initialize chat gateways from environment variables."""
    global _whatsapp_gw, _telegram_gw, _discord_gw
    
    # WhatsApp
    whatsapp_token = os.getenv("WHATSAPP_TOKEN")
    whatsapp_phone_id = os.getenv("WHATSAPP_PHONE_ID")
    if whatsapp_token and whatsapp_phone_id:
        _whatsapp_gw = WhatsAppGateway(
            phone_number_id=whatsapp_phone_id,
            access_token=whatsapp_token,
            verify_token=os.getenv("WHATSAPP_VERIFY_TOKEN", "floguru"),
        )
    
    # Telegram
    telegram_token = os.getenv("TELEGRAM_TOKEN")
    if telegram_token:
        _telegram_gw = TelegramGateway(bot_token=telegram_token)
    
    # Discord
    discord_token = os.getenv("DISCORD_TOKEN")
    if discord_token:
        _discord_gw = DiscordGateway(token=discord_token)


def get_whatsapp_gateway() -> WhatsAppGateway | None:
    return _whatsapp_gw


def get_telegram_gateway() -> TelegramGateway | None:
    return _telegram_gw


def get_discord_gateway() -> DiscordGateway | None:
    return _discord_gw


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
    if not _whatsapp_gw:
        return {"error": "WhatsApp gateway not configured"}
    
    body = await request.json()
    await _whatsapp_gw.handle_webhook(body)
    return {"status": "received"}


@router.post("/webhook/telegram")
async def telegram_incoming(request: Request) -> dict:
    """Receive Telegram webhook updates."""
    if not _telegram_gw:
        return {"error": "Telegram gateway not configured"}
    
    body = await request.json()
    await _telegram_gw.handle_webhook(body)
    return {"status": "received"}


@router.post("/webhook/discord")
async def discord_incoming(request: Request) -> dict:
    """Receive Discord webhook interactions."""
    if not _discord_gw:
        return {"error": "Discord gateway not configured"}
    
    body = await request.json()
    await _discord_gw.handle_webhook(body)
    return {"status": "received"}
