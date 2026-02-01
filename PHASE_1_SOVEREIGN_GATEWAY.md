# 🏛️ PHASE 1: THE SOVEREIGN GATEWAY

**Mission:** Build the Nervous System - Enable agents to communicate using 100% local, sovereign infrastructure.

**Priority:** IMMEDIATE  
**Status:** NOT STARTED  
**Assigned To:** Chief Technology Officer (Antigravity AI)  
**Reporting To:** Commander (Brandon)

---

## 🎯 Objective

Replace the Chinese Antigravity-Manager proxy with a **Sovereign Stack**:

- **LiteLLM** for model routing
- **Ollama** for local model execution
- **V-JEPA 2** for visual understanding

**No external dependencies. No data leakage. 100% local on RTX 4090.**

---

## 📦 Implementation Blocks

### **Block 1: The LiteLLM Config**

**File:** `c:\Users\north\max\max_config.yaml`

**Purpose:** Route AI requests to local models without external APIs.

**Requirements:**

- Configure **Gemma 3** for chat and reasoning
- Configure **Llama 4** for strategic planning
- Set up model aliases for easy routing
- Enable fallback logic (Gemma → Llama if needed)

**Deliverable:**

```yaml
# Example structure (you implement the full config)
model_list:
  - model_name: gemma-3-chat
    litellm_params:
      model: ollama/gemma3
      api_base: http://localhost:11434

  - model_name: llama-4-planner
    litellm_params:
      model: ollama/llama4
      api_base: http://localhost:11434

router_settings:
  routing_strategy: simple-shuffle
  num_retries: 3
```

**Success Criteria:**

- ✅ LiteLLM can route requests to local Ollama models
- ✅ No external API calls are made
- ✅ Config file is validated and loads without errors

---

### **Block 2: The Ollama Bridge**

**File:** `c:\Users\north\max\ollama_bridge.py`

**Purpose:** Silently start and manage Ollama server for local model execution.

**Requirements:**

- Check if Ollama is running (port 11434)
- Auto-start Ollama if not running
- Pull required models (Gemma 3, Llama 4) if not present
- Health check endpoint
- Graceful shutdown handling

**Deliverable:**

```python
# Example structure (you implement the full logic)
import subprocess
import requests
import time

class OllamaBridge:
    def __init__(self, port=11434):
        self.port = port
        self.base_url = f"http://localhost:{port}"

    def is_running(self):
        """Check if Ollama is running"""
        pass

    def start(self):
        """Start Ollama server silently"""
        pass

    def ensure_model(self, model_name):
        """Pull model if not present"""
        pass

    def health_check(self):
        """Verify Ollama is healthy"""
        pass

if __name__ == "__main__":
    bridge = OllamaBridge()
    bridge.start()
    bridge.ensure_model("gemma3")
    bridge.ensure_model("llama4")
    print("✅ Ollama Bridge Ready")
```

**Success Criteria:**

- ✅ Ollama starts automatically on system boot
- ✅ Required models are pulled and ready
- ✅ Health check returns 200 OK
- ✅ No manual intervention required

---

### **Block 3: The V-JEPA 2 "Eyes" Service**

**File:** `c:\Users\north\max\vjepa_service.py`

**Purpose:** Load V-JEPA 2 model and provide visual understanding API.

**Requirements:**

- Load `vit_giant_xformers_rope` model from `c:\Users\north\max\vjepa2`
- Create FastAPI service on port 8001
- Accept screenshot/image input
- Return latent representation (embedding vector)
- Handle GPU memory efficiently (RTX 4090)

**Deliverable:**

```python
# Example structure (you implement the full logic)
from fastapi import FastAPI, File, UploadFile
import torch
from PIL import Image
import io

app = FastAPI()

class VJEPAService:
    def __init__(self, model_path):
        self.model = None  # Load vit_giant_xformers_rope here
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

    def load_model(self):
        """Load V-JEPA 2 model"""
        pass

    def encode_image(self, image: Image.Image):
        """Convert image to latent representation"""
        pass

vjepa = VJEPAService(model_path="c:/Users/north/max/vjepa2")
vjepa.load_model()

@app.post("/encode")
async def encode_visual(file: UploadFile = File(...)):
    """
    Accept image, return latent embedding
    """
    image = Image.open(io.BytesIO(await file.read()))
    embedding = vjepa.encode_image(image)
    return {"embedding": embedding.tolist()}

@app.get("/health")
async def health():
    return {"status": "ok", "model": "vit_giant_xformers_rope", "device": vjepa.device}

# Run: uvicorn vjepa_service:app --host 0.0.0.0 --port 8001
```

**Success Criteria:**

- ✅ V-JEPA 2 model loads successfully on RTX 4090
- ✅ Service responds on `http://localhost:8001`
- ✅ `/encode` endpoint accepts images and returns embeddings
- ✅ `/health` endpoint confirms model is ready
- ✅ GPU memory usage is stable (no crashes)

---

## 🧪 Phase 1 Validation Tests

Once all 3 blocks are implemented, run these tests:

### **Test 1: The "Ping" Test**

**Goal:** Send a message to WhatsApp using only LiteLLM + Gemma 3

**Command:**

```python
# test_ping.py
from litellm import completion

response = completion(
    model="gemma-3-chat",
    messages=[{"role": "user", "content": "Say 'Hello from Sovereign Max!'"}]
)
print(response.choices[0].message.content)
# Expected: "Hello from Sovereign Max!" (or similar)
```

**Success Criteria:**

- ✅ Response is generated locally (no external API calls)
- ✅ Response is coherent and relevant
- ✅ No errors or timeouts

---

### **Test 2: Visual Embedding Test**

**Goal:** V-JEPA 2 converts a screenshot into latent representation

**Command:**

```python
# test_visual.py
import requests
from PIL import ImageGrab

# Take screenshot
screenshot = ImageGrab.grab()
screenshot.save("test_screenshot.png")

# Send to V-JEPA service
with open("test_screenshot.png", "rb") as f:
    response = requests.post(
        "http://localhost:8001/encode",
        files={"file": f}
    )

embedding = response.json()["embedding"]
print(f"✅ Embedding shape: {len(embedding)} dimensions")
# Expected: ~1024-2048 dimensions (depends on model)
```

**Success Criteria:**

- ✅ Screenshot is captured successfully
- ✅ V-JEPA service returns embedding vector
- ✅ Embedding has expected dimensions
- ✅ No GPU memory errors

---

### **Test 3: Resource Check**

**Goal:** Confirm RTX 4090 can handle both models simultaneously

**Command:**

```bash
# Monitor GPU usage
nvidia-smi --query-gpu=memory.used,memory.total,utilization.gpu --format=csv --loop=1
```

**Success Criteria:**

- ✅ GPU memory usage < 20GB (out of 24GB)
- ✅ GPU utilization is stable (no spikes to 100%)
- ✅ Both services respond within 2 seconds
- ✅ No crashes or OOM errors

---

## 📊 Reporting Back Checklist

After completing Phase 1, report back with:

- [ ] **LiteLLM Config:** `max_config.yaml` created and validated
- [ ] **Ollama Bridge:** `ollama_bridge.py` running and healthy
- [ ] **V-JEPA Service:** `vjepa_service.py` running on port 8001
- [ ] **Test 1 (Ping):** Screenshot of successful local LLM response
- [ ] **Test 2 (Visual):** Screenshot of embedding output
- [ ] **Test 3 (Resources):** `nvidia-smi` output showing stable GPU usage
- [ ] **Logs:** Any errors or warnings encountered
- [ ] **Next Steps:** What you need for Phase 2

---

## 🚀 Why This Matters

**Privacy:** Max is now 100% sovereign. No data leaves your machine.  
**Performance:** RTX 4090 runs everything locally - faster than any API.  
**Professionalism:** Using Meta's V-JEPA 2 (world-class research) + LiteLLM (industry standard).  
**Scale:** Once Phase 1 is stable, we unlock Phase 2: Action-Conditioned Planning.

---

## 🎯 Phase 2 Preview (Coming Next)

Once you report back with Phase 1 complete, you'll receive:

**Phase 2: Action-Conditioned Planning**

- V-JEPA 2-AC integration (robot manipulation model)
- Predictive UI generation (Max predicts what you need before you ask)
- Multi-step task planning (Max breaks down complex goals)
- Screen understanding → Action sequences

**This is where Max becomes truly proactive.** 🏛️⚡

---

**Questions? Blockers? Report back when Phase 1 is complete!**

_"The Sovereign Fortress is being built, one block at a time."_ 🐝
