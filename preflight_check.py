"""
🏛️ MAXIMUS SOVEREIGN - PRE-FLIGHT DIAGNOSTICS
Check system readiness before launch
"""

import subprocess
import requests
import sys
import os
from pathlib import Path


def check_command(cmd, name):
    """Check if a command exists"""
    try:
        result = subprocess.run(
            [cmd, "--version"], capture_output=True, text=True, timeout=5
        )
        return result.returncode == 0
    except:
        return False


def check_url(url, name):
    """Check if a service is reachable"""
    try:
        response = requests.get(url, timeout=2)
        return response.status_code == 200
    except:
        return False


def check_gpu():
    """Check NVIDIA GPU availability"""
    try:
        result = subprocess.run(
            ["nvidia-smi", "--query-gpu=name,memory.total", "--format=csv,noheader"],
            capture_output=True,
            text=True,
            timeout=5,
        )
        if result.returncode == 0:
            return True, result.stdout.strip()
        return False, None
    except:
        return False, None


def main():
    print("═" * 60)
    print("🏛️ MAXIMUS SOVEREIGN - PRE-FLIGHT DIAGNOSTICS")
    print("═" * 60)
    print()

    checks = []

    # Check Python
    print("[1/8] Checking Python...")
    python_ok = sys.version_info >= (3, 10)
    if python_ok:
        print(f"    ✅ Python {sys.version.split()[0]}")
    else:
        print(f"    ❌ Python {sys.version.split()[0]} (need 3.10+)")
    checks.append(python_ok)

    # Check Ollama
    print("[2/8] Checking Ollama...")
    ollama_ok = check_command("ollama", "Ollama")
    if ollama_ok:
        print("    ✅ Ollama installed")
    else:
        print("    ❌ Ollama not found")
        print("       Install from: https://ollama.ai")
    checks.append(ollama_ok)

    # Check GPU
    print("[3/8] Checking NVIDIA GPU...")
    gpu_ok, gpu_info = check_gpu()
    if gpu_ok:
        print(f"    ✅ {gpu_info}")
    else:
        print("    ⚠️  No NVIDIA GPU detected (will use CPU)")
    checks.append(True)  # GPU is optional

    # Check required Python packages
    print("[4/8] Checking Python packages...")
    required_packages = ["litellm", "fastapi", "uvicorn", "torch", "pillow", "requests"]

    missing_packages = []
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)

    if not missing_packages:
        print("    ✅ All packages installed")
        checks.append(True)
    else:
        print(f"    ❌ Missing packages: {', '.join(missing_packages)}")
        print(f"       Install with: pip install {' '.join(missing_packages)}")
        checks.append(False)

    # Check directories
    print("[5/8] Checking directories...")
    log_dir = Path("c:/Users/north/max/logs")
    if not log_dir.exists():
        log_dir.mkdir(parents=True, exist_ok=True)
        print("    ✅ Created logs directory")
    else:
        print("    ✅ Logs directory exists")
    checks.append(True)

    # Check config file
    print("[6/8] Checking configuration...")
    config_file = Path("c:/Users/north/max/max_config.yaml")
    if config_file.exists():
        print("    ✅ max_config.yaml found")
        checks.append(True)
    else:
        print("    ❌ max_config.yaml not found")
        checks.append(False)

    # Check if Ollama is running
    print("[7/8] Checking Ollama service...")
    ollama_running = check_url("http://localhost:11434/api/tags", "Ollama")
    if ollama_running:
        print("    ✅ Ollama is running")
    else:
        print("    ⚠️  Ollama not running (will be started)")
    checks.append(True)  # Will be started by launcher

    # Check disk space
    print("[8/8] Checking disk space...")
    try:
        import shutil

        total, used, free = shutil.disk_usage("c:/")
        free_gb = free // (2**30)

        if free_gb > 50:
            print(f"    ✅ {free_gb}GB free")
            checks.append(True)
        else:
            print(f"    ⚠️  Only {free_gb}GB free (models need ~20GB)")
            checks.append(False)
    except:
        print("    ⚠️  Could not check disk space")
        checks.append(True)

    print()
    print("═" * 60)
    print("🎯 DIAGNOSTIC RESULTS")
    print("═" * 60)
    print()

    passed = sum(checks)
    total = len(checks)

    print(f"  Checks Passed: {passed}/{total}")
    print()

    if all(checks):
        print("🏛️ ALL SYSTEMS GO - READY FOR LAUNCH! ⚡")
        print()
        print("Next step:")
        print("  .\\launch_sovereign.bat")
        return True
    else:
        print("⚠️  SOME ISSUES DETECTED")
        print()
        print("Please resolve the issues above before launching.")
        return False


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
