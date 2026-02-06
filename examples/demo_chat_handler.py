#!/usr/bin/env python3
"""FloGuru Demo — Chat-to-Guru message handler.

Shows how an incoming chat message flows through:
  IncomingMessage → GuruMessageHandler → GuruRouter → Guru → reply

Run:
    pip install -e packages/floguru-shared packages/floguru-gurus \
                   packages/floguru-healing packages/floguru-chat
    python examples/demo_chat_handler.py
"""

from __future__ import annotations

import asyncio

from floguru_shared.events import EventBus
from floguru_gurus.reasoner import ReasonerGuru
from floguru_gurus.coder import CoderGuru
from floguru_gurus.router import GuruRouter
from floguru_healing.healer import HyperHealer
from floguru_healing.memory import ExecutionMemory
from floguru_chat.base import IncomingMessage
from floguru_chat.handlers.guru_handler import GuruMessageHandler


async def main() -> None:
    print("FloGuru — Chat Handler Demo\n")

    # Wire up the system
    event_bus = EventBus()
    memory = ExecutionMemory(path=".floguru/chat_demo_memory.jsonl")
    healer = HyperHealer(memory=memory, event_bus=event_bus)
    router = GuruRouter(event_bus=event_bus)
    router.register(ReasonerGuru())
    router.register(CoderGuru())

    handler = GuruMessageHandler(guru_router=router, healer=healer)

    # Simulate incoming messages from different platforms
    messages = [
        IncomingMessage(
            platform="telegram",
            chat_id="12345",
            user_id="user_42",
            username="max_ruler",
            text="Analyze the pros and cons of microservices vs monolith architecture",
        ),
        IncomingMessage(
            platform="discord",
            chat_id="67890",
            user_id="user_99",
            username="code_warrior",
            text="Write a Python decorator that retries a function up to 3 times on failure",
        ),
        IncomingMessage(
            platform="whatsapp",
            chat_id="+15145550123",
            user_id="+15145550123",
            username="Quebec Business",
            text="Summarize what FloGuru can do for my business",
        ),
    ]

    for msg in messages:
        print(f"[{msg.platform.upper()}] @{msg.username}: {msg.text[:60]}...")
        reply = await handler(msg)
        print(f"  → Reply: {reply[:150]}...")
        print()

    print("Chat handler demo complete.")


if __name__ == "__main__":
    asyncio.run(main())
