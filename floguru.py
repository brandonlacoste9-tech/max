"""FloGuru — unified launcher for all platform services.

Usage:
    python floguru.py api          Start the FastAPI backend (port 8420)
    python floguru.py chat         Start all configured chat gateways
    python floguru.py diagnose     Run HyperHealing diagnostics
    python floguru.py              Show help
"""

from __future__ import annotations

import asyncio
import os
import sys


def start_api() -> None:
    """Launch the FastAPI server."""
    import uvicorn
    from floguru_api.app import create_app

    app = create_app()
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("FLOGURU_PORT", "8420")))


def run_diagnostics() -> None:
    """Run HyperHealing diagnostics and print a report."""
    from floguru_healing.healer import HyperHealer
    from floguru_healing.memory import ExecutionMemory
    import json

    memory = ExecutionMemory()
    healer = HyperHealer(memory=memory)
    report = healer.diagnose()

    print("=== FloGuru HyperHealing Diagnostics ===\n")
    print(json.dumps(report, indent=2, default=str))


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(0)

    command = sys.argv[1].lower()

    if command == "api":
        start_api()
    elif command == "diagnose":
        run_diagnostics()
    elif command == "chat":
        print("Chat gateways require platform tokens. Set environment variables:")
        print("  TELEGRAM_TOKEN, DISCORD_TOKEN, WHATSAPP_TOKEN, WHATSAPP_PHONE_ID")
        print("Then start via the API server which mounts webhook endpoints.")
    else:
        print(f"Unknown command: {command}")
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
