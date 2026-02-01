# Max Quick Start Guide 🚀

## Step-by-Step Setup

### 1. Install Dependencies (Currently Running)

```bash
cd openclaw
pnpm install
```

### 2. Build the UI

```bash
pnpm ui:build
```

### 3. Build Max

```bash
pnpm build
```

### 4. Configure Max

You'll need to set up authentication for your AI model. Max supports:

- **Anthropic Claude** (Recommended: Claude Opus 4.5)
- **OpenAI** (ChatGPT/Codex)

#### Option A: Use the Wizard (Recommended)

```bash
pnpm openclaw onboard --install-daemon
```

The wizard will guide you through:

- Choosing your AI model
- Setting up authentication (API keys or OAuth)
- Configuring channels (WhatsApp, Telegram, Discord, etc.)
- Installing the background service

#### Option B: Manual Configuration

Create `~/.openclaw/openclaw.json`:

```json
{
  "agent": {
    "model": "anthropic/claude-opus-4-5"
  }
}
```

Then set your API key:

```bash
# For Anthropic
export ANTHROPIC_API_KEY="your-api-key-here"

# For OpenAI
export OPENAI_API_KEY="your-api-key-here"
```

### 5. Start Max

#### Foreground (for testing):

```bash
pnpm openclaw gateway --port 18789 --verbose
```

#### Background (daemon):

```bash
pnpm openclaw gateway start
```

### 6. Access the Dashboard

Open your browser to: **http://127.0.0.1:18789/**

You can chat with Max directly in the web interface!

### 7. Connect Channels (Optional)

#### WhatsApp

```bash
pnpm openclaw channels login
```

Scan the QR code with WhatsApp → Settings → Linked Devices

#### Telegram

1. Create a bot with [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Add it during onboarding or manually to config

#### Discord

1. Create a Discord application at [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a bot and get the token
3. Add it during onboarding or manually to config

### 8. Test Max

Send a message through any connected channel or the web dashboard:

```
"Hello Max! Tell me about yourself."
```

## Useful Commands

### Status & Health

```bash
pnpm openclaw status          # Check Max's status
pnpm openclaw health          # Health check
pnpm openclaw doctor          # Diagnose issues
```

### Gateway Control

```bash
pnpm openclaw gateway start   # Start the gateway
pnpm openclaw gateway stop    # Stop the gateway
pnpm openclaw gateway restart # Restart the gateway
pnpm openclaw gateway status  # Check gateway status
```

### Pairing (DM Security)

```bash
pnpm openclaw pairing list whatsapp      # List pending pairings
pnpm openclaw pairing approve whatsapp <code>  # Approve a pairing
```

### Channels

```bash
pnpm openclaw channels list   # List configured channels
pnpm openclaw channels login  # Login to WhatsApp
```

## Troubleshooting

### Max won't respond

1. Check if the gateway is running: `pnpm openclaw gateway status`
2. Verify authentication: `pnpm openclaw health`
3. Check logs: `pnpm openclaw gateway logs`

### DM not working

- You may need to approve the pairing code
- Check: `pnpm openclaw pairing list <channel>`
- Approve: `pnpm openclaw pairing approve <channel> <code>`

### Build errors

- Ensure Node >= 22: `node --version`
- Clear cache: `pnpm store prune`
- Reinstall: `rm -rf node_modules && pnpm install`

## Next Steps

1. ✅ Install dependencies
2. ✅ Build Max
3. ✅ Configure authentication
4. ✅ Start the gateway
5. ✅ Access the dashboard
6. 🎯 Connect your first channel
7. 🎯 Chat with Max!
8. 🎯 Explore skills and customization

## Resources

- **Full Documentation**: `openclaw/docs/`
- **Online Docs**: https://docs.openclaw.ai
- **Discord Community**: https://discord.gg/clawd
- **GitHub**: https://github.com/openclaw/openclaw

---

Welcome to Max! 🦞
