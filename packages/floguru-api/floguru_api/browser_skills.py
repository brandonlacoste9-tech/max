"""
Browser skills — safe, high-value tasks for site health checks.

Uses httpx for lightweight checks (no Playwright). For JS-rendered pages,
consider using floguru-browser with full Playwright in the future.
"""

from __future__ import annotations

import re
import time
from typing import Any

import httpx


# Simple regex for extracting title and first H1 from HTML
_TITLE_RE = re.compile(r"<title[^>]*>([^<]*)</title>", re.I | re.DOTALL)
_H1_RE = re.compile(r"<h1[^>]*>([^<]*)</h1>", re.I | re.DOTALL)


def _normalize_url(raw: str) -> str:
    """Ensure URL has a scheme."""
    raw = raw.strip()
    if not raw:
        return ""
    if not raw.startswith(("http://", "https://")):
        return f"https://{raw}"
    return raw


def _extract_text(html: str, pattern: re.Pattern[str]) -> str | None:
    """Extract first match, strip whitespace."""
    m = pattern.search(html)
    if not m:
        return None
    return m.group(1).strip() or None


async def check_site_health(url: str) -> dict[str, Any]:
    """
    Check a URL: status code, title, and first H1.

    Returns dict with: url, status_code, title, h1, duration_ms, error (if any).
    """
    url = _normalize_url(url)
    if not url:
        return {"error": "No URL provided", "url": ""}

    result: dict[str, Any] = {
        "url": url,
        "status_code": None,
        "title": None,
        "h1": None,
        "duration_ms": 0,
    }

    start = time.monotonic()
    try:
        async with httpx.AsyncClient(
            follow_redirects=True,
            timeout=15.0,
            headers={"User-Agent": "FloGuru/0.1"},
        ) as client:
            resp = await client.get(url)
            result["status_code"] = resp.status_code
            result["duration_ms"] = round((time.monotonic() - start) * 1000, 1)

            if resp.status_code == 200:
                html = resp.text
                result["title"] = _extract_text(html, _TITLE_RE)
                result["h1"] = _extract_text(html, _H1_RE)
    except httpx.TimeoutException as e:
        result["duration_ms"] = round((time.monotonic() - start) * 1000, 1)
        result["error"] = f"Timeout: {str(e)}"
    except Exception as e:
        result["duration_ms"] = round((time.monotonic() - start) * 1000, 1)
        result["error"] = str(e)

    return result
