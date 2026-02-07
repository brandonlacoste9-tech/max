"""
FloGuru Health Suite — verify the brain, healing, and Max are all alive.

Run after changing config to confirm the API stack is healthy:
    python floguru.py health

Requires the API to be running (python floguru.py api).

Environment:
    FLOGURU_PORT — API port (default 8420)
    FLOGURU_HOST — API host (default localhost)
"""

from __future__ import annotations

import os
import sys

try:
    import httpx
except ImportError:
    print("Install httpx: pip install httpx")
    sys.exit(2)


def get_base_url() -> str:
    host = os.getenv("FLOGURU_HOST", "localhost")
    port = os.getenv("FLOGURU_PORT", "8420")
    return f"http://{host}:{port}".rstrip("/")


def check(name: str, ok: bool, detail: str = "") -> bool:
    status = "✅" if ok else "❌"
    line = f"  {status} {name}"
    if detail:
        line += f" — {detail}"
    print(line)
    return ok


def main() -> int:
    base = get_base_url()
    print("═" * 60)
    print("FloGuru Health Suite")
    print(f"  Base URL: {base}")
    print("═" * 60)
    print()

    results = []
    timeout = httpx.Timeout(10.0)

    with httpx.Client(timeout=timeout) as client:
        # 1. Health
        try:
            r = client.get(f"{base}/api/health")
            ok = r.status_code == 200 and r.json().get("status") == "ok"
            results.append(check("/api/health", ok, r.json().get("service", "")))
        except Exception as e:
            results.append(check("/api/health", False, str(e)))

        # 2. Gurus
        try:
            r = client.get(f"{base}/api/gurus")
            ok = r.status_code == 200
            data = r.json() if ok else {}
            gurus = data.get("gurus", [])
            detail = f"{len(gurus)} registered" if ok else ""
            results.append(check("/api/gurus", ok, detail))
        except Exception as e:
            results.append(check("/api/gurus", False, str(e)))

        # 3. Diagnostics
        try:
            r = client.get(f"{base}/api/diagnostics")
            ok = r.status_code == 200
            data = r.json() if ok else {}
            status = data.get("status", "")
            detail = f"status={status}" if ok else ""
            results.append(check("/api/diagnostics", ok, detail))
        except Exception as e:
            results.append(check("/api/diagnostics", False, str(e)))

        # 4. Ask Max
        try:
            r = client.post(f"{base}/api/max", json={"message": "help"})
            ok = r.status_code == 200
            data = r.json() if ok else {}
            has_reply = "reply" in data
            results.append(check("/api/max", ok and has_reply, "help → reply" if ok else ""))
        except Exception as e:
            results.append(check("/api/max", False, str(e)))

    print()
    print("═" * 60)
    passed = sum(results)
    total = len(results)
    print(f"  Passed: {passed}/{total}")
    if passed == total:
        print("  All checks OK — brain, healing, and Max are alive.")
    else:
        print("  Some checks failed — review output above.")
    print("═" * 60)

    return 0 if passed == total else 1


if __name__ == "__main__":
    sys.exit(main())
