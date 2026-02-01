"""
🏛️ MAXIMUS ROUTER - PRODUCTION READY
Week 3 implementation - Smart intelligence dispatcher
"""

import requests
import re
import base64
from typing import Dict, Optional, Literal
from pathlib import Path


class MaximusRouter:
    """
    Four-tier intelligence routing:
    - Reflex: Quick responses (Gemma 3 4B)
    - Logic: Complex reasoning (Llama 3.1 8B)
    - Worker: Code generation (Qwen 2.5 7B)
    - Vision: Image understanding (LLaVA 7B)
    """

    def __init__(self, base_url: str = "http://localhost:4000"):
        self.base = base_url
        self.stats = {
            "reflex": 0,
            "logic": 0,
            "worker": 0,
            "vision": 0,
            "total_tokens": 0,
        }

    def chat(self, message: str, image_path: Optional[str] = None) -> Dict:
        """
        Main entry point - intelligently routes to the right model

        Args:
            message: User's message
            image_path: Optional path to image for vision tasks

        Returns:
            Dict with response, tier, and model info
        """

        # Vision task?
        if image_path:
            return self._vision(message, image_path)

        # Code task?
        if self._is_code_task(message):
            return self._worker(message)

        # Complex reasoning?
        if self._is_complex(message):
            return self._logic(message)

        # Default: Quick reflex
        return self._reflex(message)

    def _is_code_task(self, msg: str) -> bool:
        """Detect code-related tasks"""
        patterns = [
            r"write.*code",
            r"write.*function",
            r"write.*class",
            r"debug",
            r"refactor",
            r"implement",
            r"code.*for",
            r"python.*script",
        ]
        return any(re.search(p, msg.lower()) for p in patterns)

    def _is_complex(self, msg: str) -> bool:
        """Detect complex reasoning tasks"""
        patterns = [
            r"analyze",
            r"explain.*why",
            r"compare",
            r"strategy",
            r"plan.*for",
            r"evaluate",
            r"assess",
            r"reasoning",
        ]
        return any(re.search(p, msg.lower()) for p in patterns)

    def _reflex(self, msg: str) -> Dict:
        """Quick responses - Gemma 2B"""
        self.stats["reflex"] += 1
        return self._call("maximus-reflex", msg, tier="reflex")

    def _logic(self, msg: str) -> Dict:
        """Complex reasoning - Llama 3.1 8B"""
        self.stats["logic"] += 1
        return self._call("maximus-logic", msg, tier="logic")

    def _worker(self, msg: str) -> Dict:
        """Code generation - Qwen 2.5 7B"""
        self.stats["worker"] += 1
        return self._call("maximus-worker", msg, tier="worker")

    def _vision(self, msg: str, img_path: str) -> Dict:
        """Image understanding - LLaVA 7B"""
        self.stats["vision"] += 1

        # Load and encode image
        img_data = Path(img_path).read_bytes()
        img_b64 = base64.b64encode(img_data).decode()

        return self._call(
            "maximus-vision",
            msg,
            tier="vision",
            image=f"data:image/png;base64,{img_b64}",
        )

    def _call(
        self, model: str, msg: str, tier: str, image: Optional[str] = None
    ) -> Dict:
        """Make API call to LiteLLM"""

        # Build message content
        if image:
            content = [
                {"type": "text", "text": msg},
                {"type": "image_url", "image_url": {"url": image}},
            ]
        else:
            content = msg

        try:
            resp = requests.post(
                f"{self.base}/chat/completions",
                json={
                    "model": model,
                    "messages": [{"role": "user", "content": content}],
                },
                timeout=30,
            )

            resp.raise_for_status()
            data = resp.json()

            # Track tokens
            if "usage" in data:
                self.stats["total_tokens"] += data["usage"].get("total_tokens", 0)

            return {
                "response": data["choices"][0]["message"]["content"],
                "tier": tier,
                "model": model,
                "success": True,
            }

        except Exception as e:
            return {
                "response": f"Error: {str(e)}",
                "tier": tier,
                "model": model,
                "success": False,
                "error": str(e),
            }

    def get_stats(self) -> Dict:
        """Get usage statistics"""
        total_calls = sum(
            [
                self.stats["reflex"],
                self.stats["logic"],
                self.stats["worker"],
                self.stats["vision"],
            ]
        )

        return {
            **self.stats,
            "total_calls": total_calls,
            "reflex_pct": (
                f"{(self.stats['reflex'] / total_calls * 100):.1f}%"
                if total_calls > 0
                else "0%"
            ),
            "logic_pct": (
                f"{(self.stats['logic'] / total_calls * 100):.1f}%"
                if total_calls > 0
                else "0%"
            ),
            "worker_pct": (
                f"{(self.stats['worker'] / total_calls * 100):.1f}%"
                if total_calls > 0
                else "0%"
            ),
            "vision_pct": (
                f"{(self.stats['vision'] / total_calls * 100):.1f}%"
                if total_calls > 0
                else "0%"
            ),
        }

    def print_stats(self):
        """Print usage statistics"""
        stats = self.get_stats()

        print("═" * 60)
        print("🏛️ MAXIMUS ROUTER STATISTICS")
        print("═" * 60)
        print()
        print(f"  Total Calls:    {stats['total_calls']}")
        print(f"  Reflex (Gemma): {stats['reflex']} ({stats['reflex_pct']})")
        print(f"  Logic (Llama):  {stats['logic']} ({stats['logic_pct']})")
        print(f"  Worker (Qwen):  {stats['worker']} ({stats['worker_pct']})")
        print(f"  Vision (LLaVA): {stats['vision']} ({stats['vision_pct']})")
        print()
        print(f"  Total Tokens:   {stats['total_tokens']}")
        print(f"  Cost:           $0.00 (100% local)")
        print()
        print("═" * 60)


# ═══════════════════════════════════════════════════════════
# USAGE EXAMPLES
# ═══════════════════════════════════════════════════════════

if __name__ == "__main__":
    router = MaximusRouter()

    print("🏛️ MAXIMUS ROUTER - TESTING ALL TIERS\n")

    # Test 1: Reflex (casual chat)
    print("[1/4] Testing REFLEX tier (Gemma 2B)...")
    result = router.chat("Hey Maximus, how are you?")
    print(f"✅ {result['tier'].upper()}: {result['response'][:100]}...\n")

    # Test 2: Logic (complex reasoning)
    print("[2/4] Testing LOGIC tier (Llama 3.1 8B)...")
    result = router.chat("Analyze the benefits of local AI vs cloud AI")
    print(f"✅ {result['tier'].upper()}: {result['response'][:100]}...\n")

    # Test 3: Worker (code generation)
    print("[3/4] Testing WORKER tier (Qwen 2.5 7B)...")
    result = router.chat("Write a Python function to calculate factorial")
    print(f"✅ {result['tier'].upper()}: {result['response'][:100]}...\n")

    # Test 4: Vision (if screenshot exists)
    print("[4/4] Testing VISION tier (LLaVA 7B)...")
    print("⏭️  Skipped (requires screenshot.png)\n")

    # Print stats
    router.print_stats()
