#!/usr/bin/env python3
"""FloGuru Demo — Browser automation example.

Shows how to define a browser action sequence and run it through the
BrowserGuru agent.

Run:
    pip install -e packages/floguru-shared packages/floguru-browser
    playwright install chromium
    python examples/demo_browser.py

Note: Requires Playwright browsers installed.
"""

from __future__ import annotations

import asyncio
import json

from floguru_shared.task import Task
from floguru_browser.actions import ActionType, PageAction
from floguru_browser.browser_guru import BrowserGuru


async def main() -> None:
    print("FloGuru — Browser Automation Demo\n")

    guru = BrowserGuru(headless=True)
    print(f"Agent: {guru}")

    # Define a browser workflow
    task = Task(
        title="Check example.com",
        description="Navigate to example.com and extract the heading",
        input_data={
            "actions": [
                {"action": "navigate", "value": "https://example.com"},
                {"action": "screenshot"},
                {"action": "extract", "selector": "h1"},
            ]
        },
    )

    print(f"Task: {task.title}")
    print(f"Actions: {len(task.input_data['actions'])} steps\n")

    result = await guru.execute(task)

    if result.success:
        print(f"Status: completed in {result.duration_ms:.0f}ms")
        for i, step in enumerate(result.output):
            action = step.get("action", "?")
            if action == "screenshot":
                b64 = step.get("screenshot_b64", "")
                print(f"  Step {i+1} [{action}]: captured {len(b64)} chars base64")
            elif action == "extract":
                print(f"  Step {i+1} [{action}]: {step.get('extracted', [])}")
            else:
                print(f"  Step {i+1} [{action}]: {step.get('url', step.get('selector', 'ok'))}")
    else:
        print(f"Status: FAILED — {result.error}")

    print("\nBrowser demo complete.")


if __name__ == "__main__":
    asyncio.run(main())
