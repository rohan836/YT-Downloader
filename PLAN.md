# 🚀 YT-Downloader — App Plan

> **READ THIS FIRST** before doing any work on the YT-Downloader app.
> When the user says "fix the app", "add feature", "update the app" — follow these instructions.

---

## Overview

| Info | Value |
|------|-------|
| **Location** | `D:\YT-Downloads\App\` |
| **Launch** | Double-click `Start.bat` → `http://localhost:3131` |
| **GitHub** | https://github.com/rohan836/YT-Downloader |
| **Tech** | Node.js + Express + WebSocket + Vanilla HTML/CSS/JS |
| **Engine** | yt-dlp (spawned via child_process) |

---

## Strict Rules

1. **Always read the current file** before editing — don't assume file contents from memory.
2. **Test after every change** — restart the server and verify in browser.
3. **Never break existing features** — all 36 features must keep working.
4. **Push to GitHub** after every successful change.
5. **Update this PLAN.md** if adding new features or changing architecture.
6. **Keep the UI premium** — glassmorphism, dark theme, gradients, micro-animations. No plain/boring UI.
7. **WebSocket-first** — all real-time data flows through WebSocket, not HTTP polling.
8. **Config persistence** — every user setting must save to config.json and load on startup.
9. **Use `-LiteralPath`** in PowerShell when touching files in this directory.

---

## Key Files

| File | Purpose | When to edit |
|------|---------|-------------|
| `server.js` | Backend — Express, WebSocket, yt-dlp spawner | Adding backend features, fixing download bugs |
| `public/index.html` | UI layout — sections, controls, modals | Adding UI controls, changing layout |
| `public/js/app.js` | Frontend logic — WebSocket, queue, progress | Adding frontend features, fixing UI bugs |
| `public/css/styles.css` | Design system — theme, animations | Styling changes, new components |
| `config.json` | User settings (auto-created) | Never edit directly — app manages it |
| `history.json` | Download log (auto-created) | Never edit directly |
| `profiles.json` | Saved presets | Never edit directly |
| `Start.bat` | Launcher script | Only if startup process changes |
| `GUIDE.md` | User documentation | When adding features users need to know about |
| `README.md` | Project docs for GitHub | When adding major features |

---

## Architecture

```
Browser (localhost:3131)
    │
    ├── index.html + styles.css (UI)
    │
    └── app.js (frontend logic)
         │
         │ WebSocket (ws://localhost:3131)
         ▼
    server.js (backend)
         │
         ├── config.json / history.json / profiles.json
         │
         └── spawn("yt-dlp", args)
              │
              ├── stdout → parse progress → WS → progress bar
              └── stderr → error log → WS → error toast
```

---

## Important Code Sections

### `server.js` — `buildArgs(config, url, mode, speed, overrides)` (~line 148)
The core function. Translates UI settings into yt-dlp command-line flags.
- **To add a new yt-dlp feature:** Add the flag here + add default to `DEFAULT_CONFIG`.

### `server.js` — WebSocket `startDownload` handler (~line 308)
Spawns yt-dlp process, parses stdout for progress, streams events to client.
- **To change download behavior:** Edit here.

### `server.js` — `DEFAULT_CONFIG` (~line 36)
All default settings. Every new option MUST have a default here.

### `app.js` — `getAdvancedOverrides()` (~line 179)
Reads all advanced option values from UI inputs.
- **To add a new UI option:** Add the read here + add the HTML control in index.html.

### `app.js` — `applyConfig(cfg)` (~line 42)
Populates all UI fields from config on load.
- **To add a new setting:** Add the field population here.

### `app.js` — `onDownloadEnd()` (~line 329)
Handles completion — queue processing, notifications, status update.

### `app.js` — `applyProfileOverrides(data)` (~line 568)
Loads saved profile values into UI.
- **To add a new option:** Also add it here for profile support.

---

## Action: "Add a new feature"

### Step 1 — Backend (server.js)
1. Add default value to `DEFAULT_CONFIG`
2. Add the yt-dlp flag to `buildArgs()` with a condition
3. If it needs a new WebSocket message type, add a case in the `switch(msg.type)`

### Step 2 — Frontend HTML (index.html)
1. Add the UI control (checkbox, input, select, slider) in the Advanced Options section
2. Give it a unique `id`

### Step 3 — Frontend JS (app.js)
1. Add reading the value in `getAdvancedOverrides()`
2. Add populating the value in `applyConfig(cfg)`
3. Add loading from profile in `applyProfileOverrides(data)`
4. Add any event listeners if needed

### Step 4 — Test
1. Restart server: kill old process, run `node server.js` from `D:\YT-Downloads\App`
2. Open browser, verify the new control appears
3. Test a download with the feature on/off

### Step 5 — Document
1. Update `GUIDE.md` with usage instructions
2. Update this `PLAN.md` feature list

### Step 6 — Push
```powershell
cd "D:\YT-Downloads\App"
git add .
git commit -m "Add feature: {description}"
git push
```

---

## Action: "Fix a bug"

1. Read the relevant file first (server.js or app.js)
2. Identify the issue
3. Fix it
4. Restart server and test
5. Push to GitHub

---

## Action: "Start/restart the server"

```powershell
# Kill any existing server on port 3131
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3131 -ErrorAction SilentlyContinue).OwningProcess -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

# Start fresh
$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")
Set-Location "D:\YT-Downloads\App"
node server.js
```

---

## Action: "Update yt-dlp"

Either click the button in Settings UI, or run:
```powershell
yt-dlp -U
```

---

## Download Folders

| Mode | Saves to | Failed log |
|------|----------|------------|
| MP3 Audio | `D:\YT-Downloads\New Audio\` | `Logs\Failed\failed_audio.txt` |
| 1080p Video | `D:\YT-Downloads\New Video\` | `Logs\Failed\failed_video.txt` |
| 4K Video | `D:\YT-Downloads\4K\` | `Logs\Failed\failed_4k.txt` |
| List | `D:\YT-Downloads\Lists\` | — |
| Backup | `D:\YT-Downloads\Backups\` | — |

---

## All 36 Features (Completed ✅)

### Core (1–8)
1. URL Input + platform auto-detect
2. Download modes: MP3, 1080p, 4K, List Audio, List Video, JSON Backup
3. Speed control (Fast/Medium/Slow)
4. Cookie system (Auto/Browser/Manual/None)
5. Real-time WebSocket progress
6. Configurable output folders
7. Duplicate tracking
8. Error logging

### Enhanced (9–17)
9. Download history (searchable)
10. Queue system (multi-URL)
11. Settings persistence
12. Theme + accent color
13. Desktop notifications
14. Drag & drop
15. Batch URL input
16. List Formats modal
17. One-click yt-dlp updater

### Advanced (18–36)
18. SponsorBlock
19. Concurrent fragments (1–16x)
20. Audio format picker (7 formats)
21. Subtitle download
22. Embed subtitles
23. Embed chapters
24. Save thumbnail
25. ASCII filenames
26. Proxy support
27. Browser impersonation
28. Output templates (4 presets)
29. Config profiles
30. Format sort
31. Split chapters
32. Date filter
33. Duration filter
34. Download sections (clip)
35. Convert thumbnails to JPG
36. Rate limiting

---

## Not Yet Built

| Feature | Effort |
|---------|--------|
| Thumbnail preview before download | Medium |
| Electron / System Tray | High |
| Retry button on failed | Easy |
| Download speed graph | Medium |
| Scheduled downloads | Medium |
| Mobile-responsive UI | Medium |
| Keyboard shortcuts | Easy |

---

## System Dependencies

| Tool | Install command |
|------|----------------|
| Node.js | Download from nodejs.org |
| yt-dlp | `winget install yt-dlp` |
| FFmpeg | `winget install ffmpeg` |
| Git | Installed |
| GitHub CLI | Installed |
| GitHub user | rohan836 |

---

*Last updated: 2026-05-01*
