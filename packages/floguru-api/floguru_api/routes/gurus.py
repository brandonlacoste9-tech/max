"""Guru management endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Request

router = APIRouter()


@router.get("/gurus")
async def list_gurus(request: Request) -> dict:
    """List all registered Gurus and their tiers."""
    guru_router = request.app.state.guru_router
    gurus = []
    for tier, tier_gurus in guru_router._gurus.items():
        for g in tier_gurus:
            gurus.append({
                "id": g.id,
                "name": g.config.name,
                "tier": tier.value,
                "model": g.config.model,
            })
    return {"gurus": gurus}


@router.get("/gurus/stats")
async def guru_stats(request: Request) -> dict:
    """Return per-guru execution statistics from HyperHealing memory."""
    healer = request.app.state.healer
    report = healer.diagnose()
    return {
        "overall_success_rate": report.get("overall_success_rate", 0),
        "total_executions": report.get("total_executions", 0),
        "guru_stats": report.get("guru_stats", {}),
        "recommendations": report.get("recommendations", []),
    }
