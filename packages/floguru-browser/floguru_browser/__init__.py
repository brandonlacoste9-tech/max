"""FloGuru Browser — headless browser automation for Guru workflows."""

from floguru_browser.automation import BrowserAutomation
from floguru_browser.browser_guru import BrowserGuru
from floguru_browser.actions import PageAction, ActionType

__all__ = [
    "BrowserAutomation",
    "BrowserGuru",
    "PageAction",
    "ActionType",
]
