#!/usr/bin/env python3
"""FloGuru Demo — End-to-end example of the Guru pipeline.

This script demonstrates:
1. Creating Guru agents (Reasoner + Coder)
2. Routing tasks through the GuruRouter
3. HyperHealing recording and diagnostics
4. The EventBus wiring everything together

Run:
    pip install -e packages/floguru-shared packages/floguru-gurus packages/floguru-healing
    python examples/demo_gurus.py

Note: Requires valid LLM API keys for live execution.
      Without keys, it shows the pipeline structure and catches connection errors gracefully.
"""

from __future__ import annotations

import asyncio
import json

from floguru_shared.events import Event, EventBus
from floguru_shared.task import Task
from floguru_gurus.reasoner import ReasonerGuru
from floguru_gurus.coder import CoderGuru
from floguru_gurus.router import GuruRouter
from floguru_healing.healer import HyperHealer
from floguru_healing.memory import ExecutionMemory


async def main() -> None:
    print("=" * 60)
    print("  FloGuru Demo — Guru Pipeline")
    print("=" * 60)

    # --- Setup ---
    event_bus = EventBus()
    memory = ExecutionMemory(path=".floguru/demo_memory.jsonl")
    healer = HyperHealer(memory=memory, event_bus=event_bus)

    # Log events to console
    async def log_event(event: Event) -> None:
        print(f"  [EVENT] {event.name}: {json.dumps(event.payload, default=str)}")

    event_bus.on("task.started", log_event)
    event_bus.on("task.completed", log_event)
    event_bus.on("task.failed", log_event)

    # --- Register Gurus ---
    router = GuruRouter(event_bus=event_bus)
    reasoner = ReasonerGuru()
    coder = CoderGuru()
    router.register(reasoner)
    router.register(coder)

    print(f"\nRegistered Gurus:")
    print(f"  - {reasoner}")
    print(f"  - {coder}")

    # --- Define Tasks ---
    tasks = [
        Task(
            title="Analyze market trends",
            description="Analyze the current trends in AI-powered automation and identify key opportunities for small businesses in Quebec.",
            tags=["tier:logic"],
        ),
        Task(
            title="Write a Python function",
            description="Implement a Python function that calculates compound interest given principal, rate, time, and compounding frequency.",
            tags=["tier:worker"],
        ),
        Task(
            title="Quick summary",
            description="Summarize the benefits of modular software architecture in two sentences.",
            tags=["tier:reflex"],
        ),
    ]

    # --- Execute ---
    print(f"\nSubmitting {len(tasks)} tasks...\n")
    for task in tasks:
        print(f"--- Task: {task.title} ---")
        print(f"    Tags: {task.tags}")

        result = await router.route(task)

        if result.success:
            output = str(result.output)[:200]
            print(f"    Status: completed")
            print(f"    Confidence: {result.confidence}")
            print(f"    Duration: {result.duration_ms:.0f}ms")
            print(f"    Output: {output}...")
        else:
            print(f"    Status: FAILED")
            print(f"    Error: {result.error}")
        print()

    # --- HyperHealing Diagnostics ---
    print("=" * 60)
    print("  HyperHealing Diagnostics")
    print("=" * 60)
    report = healer.diagnose()
    print(json.dumps(report, indent=2, default=str))

    print(f"\nTotal execution records: {memory.total_records}")
    print(f"Overall success rate: {memory.success_rate():.0%}")
    print("\nDemo complete.")


if __name__ == "__main__":
    asyncio.run(main())
