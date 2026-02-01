# 🏛️ PHASE 1.5: HYBRID SOVEREIGNTY LAYER

**Mission:** Add CLIProxyAPI power tier while maintaining local sovereignty  
**Status:** 🚀 **READY FOR IMPLEMENTATION**  
**Architecture:** 3-Tier Hybrid (Local + Power + Vision)

---

## 🎯 The Hybrid Advantage

### **Pure Sovereign (Phase 1):**

```
RTX 4090 → Ollama → 100% Local
✅ Privacy: Perfect
✅ Cost: $0/month
⚠️  Intelligence: Limited to local models
```

### **Hybrid Sovereign (Phase 1.5):**

```
┌─────────────────────────────────────┐
│      LiteLLM Smart Router           │
└──────────┬──────────────────────────┘
           │
    ┌──────┼──────┬──────────┐
    ▼      ▼      ▼          ▼
 [LOCAL] [POWER] [VISION] [FALLBACK]
 Ollama  CLI     V-JEPA   Cloud APIs
 90%     8%      2%       (emergency)
 $0      $5-20   $0       $0
```

**Result:** 90% sovereign, 10% strategic cloud usage, unlimited intelligence ceiling

---

## 📦 Installation Steps

### Step 1: Clone CLIProxyAPI

```bash
cd c:\Users\north\max
git clone https://github.com/router-for-me/CLIProxyAPI.git cli-proxy
cd cli-proxy
```

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 3: Configure CLI Tools

The proxy supports these CLI tools (configure what you have):

**Gemini CLI** (Recommended - Free tier is generous):

```bash
# Install Gemini CLI
npm install -g @google/generative-ai-cli

# Set API key
export GEMINI_API_KEY="your_gemini_api_key"
```

**Claude Code CLI** (If you have Claude API access):

```bash
# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Set API key
export ANTHROPIC_API_KEY="your_claude_api_key"
```

**ChatGPT Codex** (If you have OpenAI access):

```bash
# Install OpenAI CLI
pip install openai-cli

# Set API key
export OPENAI_API_KEY="your_openai_api_key"
```

### Step 4: Start CLIProxyAPI Server

```bash
cd c:\Users\north\max\cli-proxy
python server.py --port 8080 --models gemini,claude
```

**Expected output:**

```
🚀 CLIProxyAPI Server Starting
✅ Gemini CLI detected
✅ Claude CLI detected
🌐 Server running on http://localhost:8080
📡 OpenAI-compatible API ready
```

---

## 🔧 Enhanced Maximus Configuration

### Updated `max_config.yaml` (Hybrid Mode)

Add these power tier models to your existing config:

```yaml
# ═══════════════════════════════════════════════════════════
# POWER TIER - Strategic Intelligence Boost (via CLIProxyAPI)
# ═══════════════════════════════════════════════════════════

  - model_name: max-genius
    litellm_params:
      model: openai/gemini-2.0-flash-exp
      api_base: http://localhost:8080/v1
      api_key: cli-proxy-dummy  # CLIProxyAPI doesn't need real key
      temperature: 0.3
    model_info:
      mode: power
      tier: "power"
      use_for: ["complex_reasoning", "code_generation", "research"]
      cost_per_1k_tokens: 0.0001
      description: "Gemini 2.5 Pro via CLI - Nearly free, extremely capable"

  - model_name: max-opus
    litellm_params:
      model: openai/claude-opus-4
      api_base: http://localhost:8080/v1
      api_key: cli-proxy-dummy
      temperature: 0.7
    model_info:
      mode: power
      tier: "power"
      use_for: ["writing", "strategic_thinking", "creative_work"]
      cost_per_1k_tokens: 0.001
      description: "Claude Opus via CLI - Premium intelligence when needed"

# ═══════════════════════════════════════════════════════════
# ENHANCED ROUTING RULES (Hybrid Mode)
# ═══════════════════════════════════════════════════════════

routing_rules:
  # Local-first for speed and privacy
  local_first_keywords:
    - "hello"
    - "hi"
    - "bonjour"
    - "quick"
    - "simple"
    - "chat"

  # Power tier for complex tasks
  power_tier_keywords:
    - "write code"
    - "debug"
    - "refactor"
    - "analyze deeply"
    - "research"
    - "compare options"
    - "technical explanation"

  # Creative tier (Claude Opus)
  creative_tier_keywords:
    - "essay"
    - "creative"
    - "strategic"
    - "brainstorm"
    - "storytelling"
    - "design approach"

# Smart fallback chain
fallbacks:
  - max-genius: [max-planner, max-buddy]  # Power → Local
  - max-opus: [max-planner, max-buddy]    # Creative → Local
  - max-planner: [max-buddy]              # Logic → Reflex
```

---

## 🧪 Testing the Hybrid Stack

### Test 1: Verify CLIProxyAPI is Running

```bash
curl http://localhost:8080/v1/models
```

**Expected response:**

```json
{
  "object": "list",
  "data": [
    { "id": "gemini-2.0-flash-exp", "object": "model" },
    { "id": "claude-opus-4", "object": "model" }
  ]
}
```

### Test 2: Test Power Tier Routing

Create `test_hybrid.py`:

```python
from litellm import completion

# Test 1: Simple query → Local (Gemma 3)
print("Test 1: Simple query (should use local)")
response = completion(
    model="max-buddy",
    messages=[{"role": "user", "content": "Hello, how are you?"}]
)
print(f"Model used: {response.model}")
print(f"Response: {response.choices[0].message.content}\n")

# Test 2: Complex code → Power tier (Gemini 2.5)
print("Test 2: Complex code (should use power tier)")
response = completion(
    model="max-genius",
    messages=[{"role": "user", "content": "Write a Python async job queue with retry logic"}]
)
print(f"Model used: {response.model}")
print(f"Response: {response.choices[0].message.content[:200]}...\n")

# Test 3: Creative → Claude Opus
print("Test 3: Creative writing (should use Claude)")
response = completion(
    model="max-opus",
    messages=[{"role": "user", "content": "Write a strategic essay on AI sovereignty"}]
)
print(f"Model used: {response.model}")
print(f"Response: {response.choices[0].message.content[:200]}...\n")
```

---

## 📊 Cost Tracking & Sovereignty Metrics

### Create `sovereignty_dashboard.py`:

```python
import json
from pathlib import Path
from datetime import datetime

class SovereigntyTracker:
    """Track local vs cloud usage"""

    def __init__(self):
        self.log_file = Path("c:/Users/north/max/logs/sovereignty_log.jsonl")
        self.stats = {
            "local_calls": 0,
            "power_calls": 0,
            "vision_calls": 0,
            "total_cost": 0.0
        }

    def log_call(self, tier: str, model: str, tokens: int, cost: float):
        """Log each API call"""
        entry = {
            "timestamp": datetime.now().isoformat(),
            "tier": tier,
            "model": model,
            "tokens": tokens,
            "cost": cost
        }

        with open(self.log_file, "a") as f:
            f.write(json.dumps(entry) + "\n")

        # Update stats
        if tier == "local":
            self.stats["local_calls"] += 1
        elif tier == "power":
            self.stats["power_calls"] += 1
            self.stats["total_cost"] += cost
        elif tier == "vision":
            self.stats["vision_calls"] += 1

    def get_sovereignty_ratio(self):
        """Calculate % of calls that stayed local"""
        total = sum([
            self.stats["local_calls"],
            self.stats["power_calls"],
            self.stats["vision_calls"]
        ])

        if total == 0:
            return 0.0

        sovereign = self.stats["local_calls"] + self.stats["vision_calls"]
        return (sovereign / total) * 100

    def print_dashboard(self):
        """Display sovereignty metrics"""
        print("═" * 60)
        print("🏛️ SOVEREIGNTY DASHBOARD")
        print("═" * 60)
        print()
        print(f"  Local Calls:    {self.stats['local_calls']}")
        print(f"  Power Calls:    {self.stats['power_calls']}")
        print(f"  Vision Calls:   {self.stats['vision_calls']}")
        print()
        print(f"  Sovereignty Ratio: {self.get_sovereignty_ratio():.1f}%")
        print(f"  Total Cost:        ${self.stats['total_cost']:.4f}")
        print()
        print("═" * 60)

# Usage
tracker = SovereigntyTracker()
tracker.log_call("local", "gemma3", 150, 0.0)
tracker.log_call("power", "gemini-2.5", 2000, 0.002)
tracker.log_call("local", "llama3.1", 500, 0.0)
tracker.print_dashboard()
```

---

## 🎯 Hybrid Launch Sequence

### Updated `launch_hybrid.bat`:

```batch
@echo off
title Maximus Hybrid Sovereign Stack

echo ═══════════════════════════════════════════════════════════
echo  🏛️ MAXIMUS HYBRID SOVEREIGN STACK
echo  Local Intelligence + Strategic Cloud Power
echo ═══════════════════════════════════════════════════════════
echo.

REM Step 1: Launch Pure Sovereign Stack (Phase 1)
echo [1/5] Launching Pure Sovereign Stack...
call launch_sovereign.bat

echo.
echo [2/5] Checking if CLIProxyAPI is available...

REM Check if CLI proxy directory exists
if exist "c:\Users\north\max\cli-proxy" (
    echo ✅ CLIProxyAPI found

    echo [3/5] Starting CLIProxyAPI server...
    cd c:\Users\north\max\cli-proxy
    start /B python server.py --port 8080 --models gemini,claude
    timeout /t 5

    REM Verify it started
    curl -s http://localhost:8080/v1/models >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ CLIProxyAPI running on port 8080
        echo.
        echo [4/5] Hybrid mode ENABLED
        echo     - 90%% tasks → Local (Ollama)
        echo     - 8%% tasks → Power (CLI Proxy)
        echo     - 2%% tasks → Vision (V-JEPA)
    ) else (
        echo ⚠️  CLIProxyAPI failed to start
        echo     Running in Pure Sovereign mode
    )
) else (
    echo ⚠️  CLIProxyAPI not installed
    echo     Running in Pure Sovereign mode
    echo.
    echo To enable Hybrid mode:
    echo   cd c:\Users\north\max
    echo   git clone https://github.com/router-for-me/CLIProxyAPI.git cli-proxy
)

echo.
echo [5/5] System Status
echo.
echo ═══════════════════════════════════════════════════════════
echo  🏛️ MAXIMUS STACK READY
echo ═══════════════════════════════════════════════════════════
echo.
echo  Services:
echo    - Ollama:        http://localhost:11434
echo    - LiteLLM:       http://localhost:4000
echo    - V-JEPA Vision: http://localhost:8001
echo    - CLI Proxy:     http://localhost:8080 (if enabled)
echo.
echo  Test commands:
echo    python test_ping.py       - Test local tier
echo    python test_hybrid.py     - Test hybrid routing
echo    python sovereignty_dashboard.py - View metrics
echo.
echo ═══════════════════════════════════════════════════════════

pause
```

---

## 🏛️ The Hybrid Advantage

### **Sovereignty Ratio: 90%+**

- Simple queries → Local (instant, free)
- Complex tasks → Power tier (cheap, capable)
- Vision → Local (private, sovereign)

### **Cost Comparison:**

| Scenario           | Pure Sovereign | Hybrid     | ChatGPT Plus |
| ------------------ | -------------- | ---------- | ------------ |
| 100 simple queries | $0             | $0         | $20/mo       |
| 10 complex tasks   | Limited        | $0.10      | $20/mo       |
| 5 creative essays  | Limited        | $0.50      | $20/mo       |
| **Total/month**    | **$0**         | **~$5-10** | **$20+**     |

**Intelligence ceiling:** Local models vs **GPT-4o + Claude Opus + Gemini 2.5**

---

## 🚀 Next Steps

1. **Launch Phase 1** (Pure Sovereign):

   ```bash
   .\launch_sovereign.bat
   python test_ping.py
   python test_visual.py
   ```

2. **Add Hybrid Layer** (Optional):

   ```bash
   git clone https://github.com/router-for-me/CLIProxyAPI.git cli-proxy
   cd cli-proxy
   pip install -r requirements.txt
   python server.py --port 8080
   ```

3. **Test Hybrid Mode**:
   ```bash
   python test_hybrid.py
   python sovereignty_dashboard.py
   ```

---

**This is the perfect balance: Sovereign by default, Powerful when needed!** 🏛️⚡

_"90% Sovereign, 100% Unstoppable"_ 🐝
