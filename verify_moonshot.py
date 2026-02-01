import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("MOONSHOT_API_KEY"), base_url="https://api.moonshot.cn/v1"
)

try:
    response = client.chat.completions.create(
        model="moonshot-v1-8k",
        messages=[{"role": "user", "content": "hello"}],
        max_tokens=5,
    )
    print("✅ Moonshot Key is VALID")
    print(f"Response: {response.choices[0].message.content}")
except Exception as e:
    print(f"❌ Moonshot Key is INVALID: {e}")
