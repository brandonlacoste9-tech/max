import yaml
import os
from litellm.integrations.custom_logger import CustomLogger


class ImperialInjector(CustomLogger):
    def __init__(self):
        self.prompt_content = ""
        self.load_prompt()

    def load_prompt(self):
        try:
            # Look in CWD for the prompt file
            path = os.path.join(os.getcwd(), "system_prompts.yaml")
            if os.path.exists(path):
                with open(path, "r", encoding="utf-8") as f:
                    data = yaml.safe_load(f)
                    # Extract content safely
                    self.prompt_content = data.get("imperial_architect", {}).get(
                        "content", ""
                    )
                    print(f"👑 Imperial Persona Loaded from {path}")
            else:
                print(f"⚠️ system_prompts.yaml not found at {path}")
        except Exception as e:
            print(f"❌ Failed to load system_prompts.yaml: {e}")

    def log_pre_api_call(self, model, messages, kwargs):
        if self.prompt_content:
            # Check if system prompt is already the first message
            # to avoid duplication on retries or continued chat
            if messages and messages[0].get("role") == "system":
                # If specifically our persona, do nothing
                if messages[0].get("content") == self.prompt_content:
                    return

            # Prepend the persona to the conversation history
            messages.insert(0, {"role": "system", "content": self.prompt_content})
            # print("👑 Persona Injected")


# Initialize instance for LiteLLM to pick up
imperial_injector = ImperialInjector()
