import sys
import os
import traceback

# Explicitly add CWD to path to ensuring custom modules are found
sys.path.append(os.getcwd())

print(f"🔧 Starting LiteLLM Python Wrapper")
print(f"   CWD: {os.getcwd()}")
# print(f"   Python Path: {sys.path}")

# Pre-verify imports
try:
    import custom_prompt

    print(f"✅ SUCCESS: custom_prompt loaded. Injector ready.")
except ImportError as e:
    print(f"❌ CRITICAL FAILURE: Could not import custom_prompt: {e}")
    traceback.print_exc()
    sys.exit(1)

# Import and run LiteLLM CLI
try:
    from litellm.proxy.proxy_cli import run_server as run

    if __name__ == "__main__":
        print("🚀 Invoking litellm.proxy.proxy_cli.run_server()...")
        # Ensure sys.argv is correct
        print(f"   Args: {sys.argv}")
        run()
except SystemExit as e:
    if e.code != 0:
        print(f"⚠️ LiteLLM exited with code {e.code}")
    else:
        print("✅ LiteLLM exited cleanly")
except Exception as e:
    print(f"❌ Failed to launch LiteLLM Exception: {e}")
    traceback.print_exc()
    sys.exit(1)
