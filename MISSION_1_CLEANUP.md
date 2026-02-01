# 🛡️ MISSION 1: IMPERIAL CLEANUP PROTOCOL

**Status:** CRITICAL - 156 MB Free Space
**Objective:** Reclaim storage and prepare for 7th Seal deployment
**Priority:** IMMEDIATE

---

## 📱 FIRST COMMAND (Send via WhatsApp after "Setup Complete")

```
MAXIMUS: Initialization complete.

CRITICAL: Disk space at 156 MB. Execute cleanup protocol:

1. Run: npm cache clean --force
2. Clear: C:\Windows\Temp
3. Scan for folders > 2GB and report
4. Target: Reclaim 5GB minimum
5. Once clear: Clone 7th Seal (CopilotKit)

Clear the path for the Empire.
```

---

## 🔧 CLEANUP COMMANDS (For Maximus to Execute)

### Phase 1: NPM Cache Cleanup

```powershell
npm cache clean --force
npm cache verify
```

**Expected Recovery:** 2-10 GB

### Phase 2: Windows Temp Cleanup

```powershell
Remove-Item -Path "C:\Windows\Temp\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:TEMP\*" -Recurse -Force -ErrorAction SilentlyContinue
```

**Expected Recovery:** 1-5 GB

### Phase 3: Find Large Directories

```powershell
Get-ChildItem C:\ -Directory -Recurse -ErrorAction SilentlyContinue |
  Where-Object { (Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue |
  Measure-Object -Property Length -Sum).Sum -gt 2GB } |
  Select-Object FullName, @{Name="SizeGB";Expression={[math]::Round((Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue |
  Measure-Object -Property Length -Sum).Sum / 1GB, 2)}} |
  Sort-Object SizeGB -Descending
```

**Purpose:** Identify storage hogs

### Phase 4: Node Modules Cleanup (If Safe)

```powershell
# Find all node_modules folders
Get-ChildItem C:\Users -Directory -Recurse -Filter "node_modules" -ErrorAction SilentlyContinue |
  Select-Object FullName, @{Name="SizeGB";Expression={[math]::Round((Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue |
  Measure-Object -Property Length -Sum).Sum / 1GB, 2)}}
```

**Expected Recovery:** 10-50 GB (if old projects exist)

### Phase 5: Docker Cleanup (If Installed)

```powershell
docker system prune -a --volumes -f
```

**Expected Recovery:** 5-20 GB

---

## 🎯 TARGET METRICS

| Metric     | Current   | Target    | Status      |
| ---------- | --------- | --------- | ----------- |
| Free Space | 156 MB    | 5 GB+     | 🔴 CRITICAL |
| NPM Cache  | Unknown   | 0 MB      | ⏳ PENDING  |
| Temp Files | Unknown   | 0 MB      | ⏳ PENDING  |
| CopilotKit | ❌ Failed | ✅ Cloned | ⏳ PENDING  |

---

## 🏛️ POST-CLEANUP: DEPLOY 7TH SEAL

Once we have 5GB+ free:

```bash
cd c:\Users\north\max
git clone --depth 1 https://github.com/CopilotKit/CopilotKit.git
```

**Then verify all 7 Seals:**

```bash
ls c:\Users\north\max
```

Expected output:

- ✅ browser-use
- ✅ antigravity-awesome-skills
- ✅ planning-with-files
- ✅ Antigravity-Manager
- ✅ ui-ux-pro-max-skill
- ✅ antigravity-workspace-template
- ✅ CopilotKit

---

## 🚀 NEXT MISSION: IMPERIAL THEME

After cleanup is complete:

```
MAXIMUS: Storage secured. Begin Mission 2.

Use ui-ux-pro-max-skill to generate:
1. Imperial theme CSS (Red #8B0000, Gold #C9A34F, White #F8F2E8)
2. 3D spinning Fleur-de-lys shield component
3. Gladiator Sidebar interface mockup

The Colony builds while we sleep.
```

---

## 📊 DISK SPACE ANALYSIS

**Total Disk:** 476 GB
**Used:** 475.8 GB (99.96%)
**Free:** 156 MB (0.04%)

**Critical Areas to Investigate:**

1. `C:\Users\north\AppData\Local\npm-cache` - Often 10-20 GB
2. `C:\Windows\Temp` - Can be 5-10 GB
3. Old `node_modules` folders - 10-50 GB potential
4. Docker images/volumes - 5-20 GB if installed
5. Windows Update cache - 5-10 GB

---

**The Gladiator will handle this. You just give the order.** ⚔️
