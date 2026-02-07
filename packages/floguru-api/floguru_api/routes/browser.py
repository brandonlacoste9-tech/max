"""Browser skills — named tasks for site health and automation."""

from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

from floguru_api.browser_skills import check_site_health

router = APIRouter()


class CheckSiteBody(BaseModel):
    url: str


@router.post("/browser/check-site")
async def browser_check_site(body: CheckSiteBody) -> dict:
    """
    Check a URL: status code, title, and first H1.

    Example: POST {"url": "https://max-inky.vercel.app"}
    """
    result = await check_site_health(body.url)
    return result
