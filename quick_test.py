"""
🏛️ MAXIMUS QUICK TEST - Direct Ollama Test
No LiteLLM proxy required - tests models directly
"""

import requests
import time

BASE_URL = "http://localhost:11434"


def test_model(model: str, prompt: str, tier: str):
    """Test a single Ollama model"""
    print(f"[{tier}] Testing {model}...")

    try:
        start = time.time()
        response = requests.post(
            f"{BASE_URL}/api/generate",
            json={"model": model, "prompt": prompt, "stream": False},
            timeout=60,
        )
        elapsed = time.time() - start

        if response.status_code == 200:
            data = response.json()
            text = data.get("response", "")[:150]
            print(f"✅ {tier}: {text}...")
            print(f"   Time: {elapsed:.1f}s\n")
            return True
        else:
            print(f"❌ {tier}: HTTP {response.status_code}\n")
            return False

    except Exception as e:
        print(f"❌ {tier}: {e}\n")
        return False


def main():
    print("═" * 60)
    print("🏛️ MAXIMUS SOVEREIGN STACK - QUICK TEST")
    print("═" * 60)
    print()

    results = []

    # Test 1: Reflex (Gemma 3 4B)
    results.append(
        test_model("gemma3:4b", "Say hello in French. Keep it short.", "REFLEX")
    )

    # Test 2: Logic (Llama 3.1 8B)
    results.append(
        test_model(
            "llama3.1:8b",
            "Explain why local AI is better than cloud AI in 2 sentences.",
            "LOGIC",
        )
    )

    # Test 3: Vision check (LLaVA)
    print("[VISION] Checking LLaVA model...")
    try:
        response = requests.get(f"{BASE_URL}/api/tags", timeout=5)
        models = [m["name"] for m in response.json().get("models", [])]
        if any("llava" in m for m in models):
            print("✅ VISION: LLaVA 7B installed and ready\n")
            results.append(True)
        else:
            print("⚠️  VISION: LLaVA not found\n")
            results.append(False)
    except Exception as e:
        print(f"❌ VISION: {e}\n")
        results.append(False)

    # Summary
    print("═" * 60)
    print("🎯 TEST RESULTS")
    print("═" * 60)

    passed = sum(results)
    total = len(results)

    print(f"\n  Passed: {passed}/{total}")
    print(f"  Cost: $0.00 (100% local)")

    if passed == total:
        print("\n🏛️ SOVEREIGN STACK IS OPERATIONAL! ⚡")
    else:
        print("\n⚠️  Some tests failed - check output above")

    print()
    print("═" * 60)


if __name__ == "__main__":
    main()
