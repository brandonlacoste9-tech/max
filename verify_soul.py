import requests
import json
import time


def check_soul():
    # Try 127.0.0.1 to avoid ipv6/localhost resolution issues
    url = "http://127.0.0.1:4000/v1/chat/completions"
    headers = {"Content-Type": "application/json"}

    # Testing Maximus Reflex (Gemma 2 2B)
    payload = {
        "model": "maximus-reflex",
        "messages": [{"role": "user", "content": "Identifie-toi. Es-tu prêt?"}],
    }

    print(f"🔮 Summoning the Imperial Architect (Reflex/Gemma2) on {url}...")

    for i in range(5):
        try:
            print(f"   Attempt {i+1}...", end="")
            response = requests.post(url, headers=headers, json=payload, timeout=60)

            if response.status_code == 200:
                print(" SUCCESS!")
                result = response.json()
                content = result["choices"][0]["message"]["content"]
                print("\n👑 THE SOUL SPEAKS:")
                print("════════════════════════════════════")
                print(content)
                print("════════════════════════════════════")
                return
            else:
                print(f" FAILED Status {response.status_code}")
                try:
                    # Print first 200 chars of error to avoid spam
                    print(response.text[:500])
                except:
                    pass

        except Exception as e:
            print(f" ERROR: connection failed, retrying...")
            time.sleep(3)

    print("❌ All attempts failed.")


if __name__ == "__main__":
    check_soul()
