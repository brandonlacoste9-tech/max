"""API Key authentication middleware."""

from __future__ import annotations

import os
from typing import Optional

from fastapi import Header, HTTPException, Request


async def verify_api_key(
    request: Request,
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
) -> str:
    """Verify API key from header or query param. Returns the key or raises 401."""
    
    # Allow if no API key configured (dev mode)
    configured_key = os.getenv("FLOGURU_API_KEY")
    if not configured_key:
        return "dev"
    
    # Check header
    if x_api_key and x_api_key == configured_key:
        return x_api_key
    
    # Check query param
    query_key = request.query_params.get("api_key")
    if query_key and query_key == configured_key:
        return query_key
    
    raise HTTPException(status_code=401, detail="Invalid or missing API key")


async def verify_api_key_optional(
    request: Request,
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
) -> Optional[str]:
    """Optional API key verification - returns key if provided, None otherwise."""
    
    if not x_api_key:
        return None
    
    configured_key = os.getenv("FLOGURU_API_KEY")
    if not configured_key:
        return x_api_key  # No configured key, allow anything
    
    if x_api_key == configured_key:
        return x_api_key
    
    raise HTTPException(status_code=401, detail="Invalid API key")
