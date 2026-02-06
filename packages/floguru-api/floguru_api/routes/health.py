"""Health and diagnostics endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Request

router = APIRouter()


@router.get("/health")
async def health_check() -> dict:
    return {"status": "ok", "service": "floguru"}


@router.get("/diagnostics")
async def diagnostics(request: Request) -> dict:
    """Return HyperHealing diagnosis report."""
    healer = request.app.state.healer
    return healer.diagnose()
