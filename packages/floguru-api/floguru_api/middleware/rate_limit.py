"""Simple in-memory rate limiter middleware for FastAPI."""

from __future__ import annotations

import time
from collections import defaultdict
from typing import Callable

from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Token-bucket rate limiter keyed by client IP.

    Parameters:
        rpm: Maximum requests per minute per IP.
        burst: Extra burst capacity above the steady rate.
    """

    def __init__(self, app: Callable, rpm: int = 60, burst: int = 10) -> None:
        super().__init__(app)
        self.rpm = rpm
        self.burst = burst
        self._buckets: dict[str, list[float]] = defaultdict(list)

    def _client_ip(self, request: Request) -> str:
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return request.client.host if request.client else "unknown"

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Skip rate limiting for health checks
        if request.url.path == "/api/health":
            return await call_next(request)

        ip = self._client_ip(request)
        now = time.monotonic()
        window = 60.0  # 1 minute

        # Prune old entries
        self._buckets[ip] = [t for t in self._buckets[ip] if now - t < window]

        if len(self._buckets[ip]) >= self.rpm + self.burst:
            return JSONResponse(
                status_code=429,
                content={
                    "error": "rate_limit_exceeded",
                    "message": f"Too many requests. Limit: {self.rpm}/min.",
                    "retry_after_seconds": int(window - (now - self._buckets[ip][0])) + 1,
                },
                headers={"Retry-After": str(int(window - (now - self._buckets[ip][0])) + 1)},
            )

        self._buckets[ip].append(now)
        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(self.rpm)
        response.headers["X-RateLimit-Remaining"] = str(
            max(0, self.rpm + self.burst - len(self._buckets[ip]))
        )
        return response
