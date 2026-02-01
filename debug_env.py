import os
from dotenv import load_dotenv

load_dotenv()


def mask(s):
    if not s:
        return "None"
    return s[:4] + "..." + s[-4:] if len(s) > 8 else "****"


print(f"DEEPSEEK: {mask(os.getenv('DEEPSEEK_API_KEY'))}")
print(f"OPENAI: {mask(os.getenv('OPENAI_API_KEY'))}")
print(f"MOONSHOT: {mask(os.getenv('MOONSHOT_API_KEY'))}")
