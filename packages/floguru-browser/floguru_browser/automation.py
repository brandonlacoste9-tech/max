"""Core browser automation engine using Playwright."""

from __future__ import annotations

import base64
from typing import Any

from floguru_browser.actions import ActionType, PageAction


class BrowserAutomation:
    """Headless browser controller powered by Playwright.

    Provides a high-level API for navigating pages, interacting with
    elements, taking screenshots, and extracting data.
    """

    def __init__(self, headless: bool = True) -> None:
        self.headless = headless
        self._browser: Any = None
        self._context: Any = None
        self._page: Any = None

    async def start(self) -> None:
        """Launch the browser and create a default page."""
        from playwright.async_api import async_playwright

        self._pw = await async_playwright().start()
        self._browser = await self._pw.chromium.launch(headless=self.headless)
        self._context = await self._browser.new_context(
            viewport={"width": 1280, "height": 720},
            user_agent=(
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 FloGuru/0.1"
            ),
        )
        self._page = await self._context.new_page()

    async def stop(self) -> None:
        """Close the browser and release resources."""
        if self._browser:
            await self._browser.close()
        if hasattr(self, "_pw") and self._pw:
            await self._pw.stop()
        self._browser = None
        self._context = None
        self._page = None

    async def run_action(self, action: PageAction) -> dict[str, Any]:
        """Execute a single PageAction and return the result."""
        if self._page is None:
            raise RuntimeError("Browser not started. Call start() first.")

        result: dict[str, Any] = {"action": action.action.value, "success": True}

        match action.action:
            case ActionType.NAVIGATE:
                resp = await self._page.goto(
                    action.value, timeout=action.timeout_ms, wait_until="domcontentloaded"
                )
                result["status"] = resp.status if resp else None
                result["url"] = self._page.url

            case ActionType.CLICK:
                await self._page.click(action.selector, timeout=action.timeout_ms)
                result["selector"] = action.selector

            case ActionType.TYPE:
                await self._page.fill(action.selector, action.value, timeout=action.timeout_ms)
                result["selector"] = action.selector

            case ActionType.SCREENSHOT:
                raw = await self._page.screenshot(full_page=bool(action.metadata.get("full_page")))
                result["screenshot_b64"] = base64.b64encode(raw).decode()

            case ActionType.WAIT:
                if action.selector:
                    await self._page.wait_for_selector(action.selector, timeout=action.timeout_ms)
                else:
                    await self._page.wait_for_timeout(action.timeout_ms)

            case ActionType.SCROLL:
                delta = int(action.value) if action.value else 500
                await self._page.mouse.wheel(0, delta)

            case ActionType.SELECT:
                await self._page.select_option(action.selector, action.value, timeout=action.timeout_ms)

            case ActionType.EXTRACT:
                elements = await self._page.query_selector_all(action.selector)
                texts = [await el.inner_text() for el in elements]
                result["extracted"] = texts

            case ActionType.EVALUATE:
                js_result = await self._page.evaluate(action.value)
                result["js_result"] = js_result

        return result

    async def run_sequence(self, actions: list[PageAction]) -> list[dict[str, Any]]:
        """Execute a list of actions in order and return all results."""
        results: list[dict[str, Any]] = []
        for action in actions:
            try:
                res = await self.run_action(action)
                results.append(res)
            except Exception as exc:
                results.append({
                    "action": action.action.value,
                    "success": False,
                    "error": str(exc),
                })
                break  # stop on first failure
        return results
