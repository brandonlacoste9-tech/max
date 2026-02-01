"""
🏛️ MAXIMUS SOVEREIGN - OLLAMA BRIDGE
Silently manage Ollama server and local models
"""

import subprocess
import requests
import time
import logging
import sys
import os
from typing import List, Optional

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s: %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("c:/Users/north/max/logs/ollama_bridge.log"),
    ],
)
logger = logging.getLogger(__name__)


class OllamaBridge:
    """Ollama Bridge - Manage local model execution"""

    def __init__(self, port: int = 11434):
        self.port = port
        self.base_url = f"http://localhost:{port}"
        self.required_models = [
            "gemma3:4b",  # Reflex - The Buddy
            "llama3.1:8b",  # Logic - The Planner
            "qwen2.5-coder:7b",  # Worker - The Scout
        ]

    def is_running(self) -> bool:
        """Check if Ollama is running"""
        try:
            response = requests.get(f"{self.base_url}/api/tags", timeout=2)
            return response.status_code == 200
        except:
            return False

    def start(self) -> bool:
        """Start Ollama server silently"""
        if self.is_running():
            logger.info("✅ Ollama already running")
            return True

        try:
            logger.info("🚀 Starting Ollama server...")

            # Start Ollama in background (Windows)
            subprocess.Popen(
                ["ollama", "serve"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
            )

            # Wait for startup
            for i in range(10):
                time.sleep(1)
                if self.is_running():
                    logger.info(f"✅ Ollama started on port {self.port}")
                    return True

            logger.error("❌ Ollama failed to start within 10 seconds")
            return False

        except Exception as e:
            logger.error(f"❌ Failed to start Ollama: {e}")
            return False

    def list_models(self) -> List[str]:
        """List installed models"""
        try:
            response = requests.get(f"{self.base_url}/api/tags")
            if response.status_code == 200:
                data = response.json()
                return [model["name"] for model in data.get("models", [])]
            return []
        except:
            return []

    def is_model_installed(self, model_name: str) -> bool:
        """Check if a model is installed"""
        models = self.list_models()
        return model_name in models

    def pull_model(self, model_name: str) -> bool:
        """Pull a model if not present"""
        if self.is_model_installed(model_name):
            logger.info(f"✅ {model_name} already installed")
            return True

        try:
            logger.info(f"📥 Pulling {model_name}...")
            logger.info(f"   This may take several minutes...")

            # Use subprocess to show progress
            result = subprocess.run(
                ["ollama", "pull", model_name], capture_output=True, text=True
            )

            if result.returncode == 0:
                logger.info(f"✅ {model_name} installed successfully")
                return True
            else:
                logger.error(f"❌ Failed to pull {model_name}: {result.stderr}")
                return False

        except Exception as e:
            logger.error(f"❌ Failed to pull {model_name}: {e}")
            return False

    def ensure_models(self) -> bool:
        """Ensure all required models are installed"""
        logger.info("📦 Checking required models...")

        all_installed = True
        for model in self.required_models:
            if not self.pull_model(model):
                all_installed = False

        return all_installed

    def health_check(self) -> dict:
        """Verify Ollama is healthy"""
        try:
            response = requests.get(f"{self.base_url}/api/tags", timeout=5)

            if response.status_code == 200:
                models = self.list_models()
                required_installed = [m for m in self.required_models if m in models]

                return {
                    "status": "healthy",
                    "url": self.base_url,
                    "models_installed": len(models),
                    "required_models": len(self.required_models),
                    "required_installed": len(required_installed),
                    "missing_models": [
                        m for m in self.required_models if m not in models
                    ],
                }
            else:
                return {"status": "unhealthy", "error": f"HTTP {response.status_code}"}

        except Exception as e:
            return {"status": "unreachable", "error": str(e)}

    def test_inference(self, model: str = "gemma3:4b") -> bool:
        """Test inference with a simple prompt"""
        try:
            logger.info(f"🧪 Testing inference with {model}...")

            response = requests.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": model,
                    "prompt": "Say 'Hello from Sovereign Max!' in one sentence.",
                    "stream": False,
                },
                timeout=30,
            )

            if response.status_code == 200:
                data = response.json()
                logger.info(f"✅ Inference test passed")
                logger.info(f"   Response: {data.get('response', '')[:100]}...")
                return True
            else:
                logger.error(f"❌ Inference test failed: HTTP {response.status_code}")
                return False

        except Exception as e:
            logger.error(f"❌ Inference test failed: {e}")
            return False


def main():
    """Main entry point"""
    logger.info("═" * 60)
    logger.info("🏛️ OLLAMA BRIDGE - INITIALIZING")
    logger.info("═" * 60)
    logger.info("")

    bridge = OllamaBridge()

    # Step 1: Start Ollama
    if not bridge.start():
        logger.error("❌ Failed to start Ollama")
        sys.exit(1)

    logger.info("")

    # Step 2: Ensure models
    if not bridge.ensure_models():
        logger.warning("⚠️  Some models failed to install")

    logger.info("")

    # Step 3: Health check
    health = bridge.health_check()
    logger.info("📊 Health Check:")
    for key, value in health.items():
        logger.info(f"   {key}: {value}")

    logger.info("")

    # Step 4: Test inference
    bridge.test_inference()

    logger.info("")
    logger.info("═" * 60)
    logger.info("✅ OLLAMA BRIDGE READY")
    logger.info("═" * 60)


if __name__ == "__main__":
    main()
