# 🏛️ WEEK 1: FOUNDATION - EXECUTION GUIDE

**Mission:** Get the core Ollama + LiteLLM stack working TODAY  
**Time:** 30-60 minutes  
**Status:** ⚡ **EXECUTE NOW**

---

## 🎯 THE EXECUTION SEQUENCE

### **Step 1: Install Ollama (5 minutes)**

**Windows:**

```bash
winget install Ollama.Ollama
```

**OR download manually:**

- Go to: https://ollama.com/download/windows
- Run installer
- Restart terminal

**Verify installation:**

```bash
ollama --version
```

Expected: `ollama version 0.x.x`

---

### **Step 2: Pull Models (15-30 minutes)**

**Open terminal and run:**

```bash
# Tier 1: Reflex (2GB download)
ollama pull gemma2:2b

# Tier 2: Logic (4.7GB download)
ollama pull llama3.1:8b

# Tier 3: Worker (4.4GB download)
ollama pull qwen2.5:7b

# Tier 4: Vision (4.7GB download)
ollama pull llava:7b
```

**Total download:** ~16GB  
**Disk space needed:** ~20GB

**Verify models:**

```bash
ollama list
```

Expected output:

```
NAME              ID              SIZE
gemma2:2b         ...             1.6 GB
llama3.1:8b       ...             4.7 GB
qwen2.5:7b        ...             4.4 GB
llava:7b          ...             4.7 GB
```

---

### **Step 3: Install Python Dependencies (2 minutes)**

```bash
pip install litellm requests pillow
```

**Verify:**

```bash
python -c "import litellm; print('LiteLLM installed')"
```

---

### **Step 4: Start LiteLLM Server (1 minute)**

**In terminal 1:**

```bash
cd c:\Users\north\max
litellm --config max_config.yaml --port 4000
```

**Expected output:**

```
INFO: Started server process
INFO: Waiting for application startup.
INFO: Application startup complete.
INFO: Uvicorn running on http://0.0.0.0:4000
```

**Keep this terminal open!**

---

### **Step 5: Test the Stack (5 minutes)**

**Open terminal 2:**

**Quick test:**

```bash
python -c "import requests; r = requests.post('http://localhost:4000/chat/completions', json={'model': 'maximus-reflex', 'messages': [{'role': 'user', 'content': 'Hello Maximus!'}]}); print(r.json()['choices'][0]['message']['content'])"
```

**Expected:** A friendly response from Gemma 2B

**Full test:**

```bash
cd c:\Users\north\max
python maximus_router.py
```

**Expected output:**

```
🏛️ MAXIMUS ROUTER - TESTING ALL TIERS

[1/4] Testing REFLEX tier (Gemma 2B)...
✅ REFLEX: Hello! I'm doing well, thank you for asking...

[2/4] Testing LOGIC tier (Llama 3.1 8B)...
✅ LOGIC: Local AI offers several key benefits...

[3/4] Testing WORKER tier (Qwen 2.5 7B)...
✅ WORKER: def factorial(n):...

[4/4] Testing VISION tier (LLaVA 7B)...
⏭️  Skipped (requires screenshot.png)

═══════════════════════════════════════════════════════════
🏛️ MAXIMUS ROUTER STATISTICS
═══════════════════════════════════════════════════════════

  Total Calls:    3
  Reflex (Gemma): 1 (33.3%)
  Logic (Llama):  1 (33.3%)
  Worker (Qwen):  1 (33.3%)
  Vision (LLaVA): 0 (0.0%)

  Total Tokens:   XXX
  Cost:           $0.00 (100% local)

═══════════════════════════════════════════════════════════
```

---

## ✅ SUCCESS CRITERIA

**Week 1 is COMPLETE when:**

- [ ] Ollama installed and running
- [ ] All 4 models pulled (gemma2, llama3.1, qwen2.5, llava)
- [ ] LiteLLM server running on port 4000
- [ ] `maximus_router.py` test passes
- [ ] All 3 tiers respond correctly (Reflex, Logic, Worker)

---

## 🐝 TROUBLESHOOTING

### **Issue: "ollama: command not found"**

**Fix:** Restart terminal after installation, or add to PATH manually

### **Issue: "Model not found"**

**Fix:** Run `ollama pull <model>` again, check internet connection

### **Issue: "Connection refused on port 4000"**

**Fix:** Make sure LiteLLM server is running in terminal 1

### **Issue: "Out of memory"**

**Fix:** Close other applications, or use smaller models:

```bash
ollama pull gemma2:2b  # Keep this
ollama pull llama3.1:8b  # Keep this
ollama pull qwen2.5-coder:1.5b  # Smaller worker
ollama pull llava:7b  # Keep this
```

---

## 🎯 WHEN WEEK 1 WORKS

**Report back with:**

1. Screenshot of `maximus_router.py` output
2. Output of `ollama list`
3. Any errors encountered

**Then we move to Week 2:**

- Test vision with actual screenshots
- Add image analysis capabilities
- Build screen context awareness

---

## ⚡ THE DISCIPLINE

**DO NOT:**

- ❌ Start building UI yet
- ❌ Add CLIProxyAPI yet
- ❌ Integrate CopilotKit yet
- ❌ Deploy to cloud yet

**DO:**

- ✅ Get Week 1 working 100%
- ✅ Test all 3 tiers thoroughly
- ✅ Verify zero external API calls
- ✅ Confirm $0 cost

**One layer at a time. One victory at a time.** 🏛️

---

## 🏛️ EXECUTE NOW

```bash
# Copy-paste this entire block:

# 1. Install Ollama
winget install Ollama.Ollama

# 2. Pull models (in new terminal)
ollama pull gemma2:2b
ollama pull llama3.1:8b
ollama pull qwen2.5:7b
ollama pull llava:7b

# 3. Install Python deps
pip install litellm requests pillow

# 4. Start LiteLLM (keep terminal open)
cd c:\Users\north\max
litellm --config max_config.yaml --port 4000

# 5. Test (in new terminal)
cd c:\Users\north\max
python maximus_router.py
```

**GO! ⚡**
