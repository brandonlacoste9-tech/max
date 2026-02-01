import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com"
)

try:
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[{"role": "user", "content": "test"}],
        max_tokens=5,
    )
    print("✅ DeepSeek Key is VALID")
    print(f"Response: {response.choices[0].message.content}")
except Exception as e:
    print(f"❌ DeepSeek Key is INVALID: {e}")
