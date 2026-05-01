# 🚀 YT-Downloader — App Reference for AI Assistants

> **YOU (the AI) MUST read this before modifying the YT-Downloader app.**

---

## What is This?

A modern web app that wraps `yt-dlp` with a premium UI. The user downloads media from YouTube and other sites through a browser interface at `http://localhost:3131`.

| Info | Value |
|------|-------|
| **Location** | `D:\YT-Downloads\App\` |
| **Launch** | Double-click `Start.bat` → opens `http://localhost:3131` |
| **GitHub** | https://github.com/rohan836/YT-Downloader |
| **Tech** | Node.js + Express + WebSocket + Vanilla HTML/CSS/JS |
| **Engine** | yt-dlp (spawned via child_process) |

---

## Strict Rules

1. **Read the actual file** before editing — don't assume contents from memory.
2. **Test after every change** — restart server, verify in browser.
3. **Never break existing features** — all 36 must keep working.
4. **Push to GitHub** after every successful change.
5. **Keep the UI premium** — glassmorphism, dark theme, gradients, animations. No plain/boring designs.
6. **WebSocket-first** — real-time data through WebSocket, not HTTP polling.
7. **Config persistence** — every user setting saves to config.json and loads on startup.
8. **Use `-LiteralPath`** in PowerShell when working with this directory.
9. **Update this PLAN.md** if you add features or change architecture.

---

## Key Files — What Each One Does

| File | What it is | When to edit |
|------|-----------|--------------|
| `server.js` | Backend — Express server, WebSocket handler, yt-dlp process spawner | Adding backend features, fixing download bugs |
| `public/index.html` | UI structure — all sections, inputs, buttons, modals | Adding new controls, changing layout |
| `public/js/app.js` | Frontend logic — WebSocket client, download queue, progress, settings | Adding frontend features, fixing UI bugs |
| `public/css/styles.css` | Styling — glassmorphism dark theme, animations, layout | Visual changes, new component styles |
| `config.json` | User settings (auto-created on first save) | NEVER edit directly — the app manages it |
| `history.json` | Download log — last 500 entries (auto-created) | NEVER edit directly |
| `profiles.json` | Saved advanced option presets | NEVER edit directly |
| `Start.bat` | Windows launcher script | Only if startup process needs changing |
| `GUIDE.md` | User-facing feature documentation | Update when adding features |
| `README.md` | GitHub project page | Update for major features |
| `package.json` | Node.js manifest (deps: express, ws) | When adding npm packages |

---

## Architecture

```
Browser (localhost:3131)
    │
    ├── index.html + styles.css (UI)
    │
    └── app.js (frontend logic)
         │
         │ WebSocket (real-time, bidirectional)
         ▼
    server.js (backend)
         │
         ├── Reads/writes: config.json, history.json, profiles.json
         │
         └── spawn("yt-dlp", [...flags]) ← child process
              │
              ├── stdout → parse "[download] 72.3%" → send to browser → progress bar
              └── stderr → log errors → send to browser → error toast
```

---

## Important Code Locations

### `server.js`

| Section | ~Line | What it does |
|---------|-------|-------------|
| `DEFAULT_CONFIG` | 36 | All default settings — every new option MUST have a default here |
| `buildArgs()` | 148 | Translates UI settings into yt-dlp command-line flags — THE core function |
| `startDownload` handler | 308 | Spawns yt-dlp, parses progress, streams events to browser |
| `cancelDownload` | 406 | Kills the running yt-dlp process |
| `listFormats` | 425 | Runs `yt-dlp -F` and sends format list to browser |
| Profile handlers | 437 | Save/load/delete config profiles |

### `app.js`

| Section | ~Line | What it does |
|---------|-------|-------------|
| `applyConfig()` | 42 | Populates ALL UI fields from config on page load |
| `getAdvancedOverrides()` | 179 | Reads all advanced option values from the UI to send with downloads |
| `startSingleDownload()` | 218 | Initiates a download via WebSocket |
| `onDownloadEnd()` | 329 | Handles completion — processes next in queue, shows notifications |
| `applyProfileOverrides()` | 568 | Loads saved profile values into UI |

---

## Task: "Add a new feature"

### Step 1 — Backend (`server.js`)
1. Add a default value to `DEFAULT_CONFIG` object
2. Add the yt-dlp flag logic to `buildArgs()` function
3. If it needs a new WebSocket message type, add a `case` in the `switch(msg.type)`

### Step 2 — Frontend HTML (`public/index.html`)
1. Add the UI control (checkbox, input, select, slider) in the Advanced Options section
2. Give it a unique `id` attribute

### Step 3 — Frontend JS (`public/js/app.js`)
1. Read the value in `getAdvancedOverrides()` — add a new property
2. Populate it in `applyConfig(cfg)` — so it loads from saved settings
3. Load from profile in `applyProfileOverrides(data)` — so profiles work
4. Add event listeners if the control needs interactivity

### Step 4 — Test
```powershell
# Kill existing server
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3131 -ErrorAction SilentlyContinue).OwningProcess -Force -ErrorAction SilentlyContinue
Start-Sleep 1

# Restart
$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")
Set-Location "D:\YT-Downloads\App"
node server.js
```
Then open browser and verify.

### Step 5 — Document
1. Add to `GUIDE.md` with usage instructions
2. Add to the feature list in this PLAN.md

### Step 6 — Push
```powershell
Set-Location "D:\YT-Downloads\App"
git add .
git commit -m "Add feature: {description}"
git push
```

---

## Task: "Fix a bug"

1. Read the relevant file first (`server.js` or `app.js`) — don't guess
2. Identify the issue
3. Fix it
4. Restart server and test
5. Push to GitHub

---

## Task: "Start/restart the server"

```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3131 -ErrorAction SilentlyContinue).OwningProcess -Force -ErrorAction SilentlyContinue
Start-Sleep 1
$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")
Set-Location "D:\YT-Downloads\App"
node server.js
```

---

## Download Folders

| Mode | Downloads to | Duplicate archive |
|------|-------------|-------------------|
| MP3 Audio | `D:\YT-Downloads\New Audio\` | `Logs\Duplicates\duplicate_audio.txt` |
| 1080p Video | `D:\YT-Downloads\New Video\` | `Logs\Duplicates\duplicate_video.txt` |
| 4K Video | `D:\YT-Downloads\4K\` | `Logs\Duplicates\duplicate_4k.txt` |
| List export | `D:\YT-Downloads\Lists\` | — |
| JSON backup | `D:\YT-Downloads\Backups\` | — |

---

## All 36 Features

1. URL Input + platform auto-detect (YouTube, Instagram, TikTok, Twitter, Facebook, Vimeo, Twitch, SoundCloud)
2. Download modes: MP3, 1080p, 4K, List Audio, List Video, JSON Backup
3. Speed control (Fast/Medium/Slow)
4. Cookie system (Auto/Browser/Manual/None)
5. Real-time WebSocket progress (%, speed, ETA)
6. Configurable output folders (8 paths)
7. Duplicate tracking (archive-based)
8. Error logging (inline + file)
9. Download history (searchable, clearable, last 500)
10. Queue system (multi-URL sequential)
11. Settings persistence (config.json)
12. Dark/Light theme + accent color picker
13. Desktop notifications
14. Drag & drop (URLs + .txt files)
15. Batch URL input (queue textarea)
16. List Formats modal (yt-dlp -F)
17. One-click yt-dlp updater
18. SponsorBlock (remove YouTube ads)
19. Concurrent fragments (1–16x parallel)
20. Audio format picker (MP3, AAC, FLAC, Opus, WAV, M4A, Vorbis)
21. Subtitle download + language selector
22. Embed subtitles into video
23. Embed chapters
24. Save thumbnail to disk
25. ASCII-only filenames
26. Proxy support (HTTP, SOCKS5)
27. Browser impersonation
28. Output templates (clean, withUploader, withDate, numbered)
29. Config profiles (save/load/delete)
30. Format sort
31. Split chapters (album → individual files)
32. Date filter (after/before)
33. Duration filter (min/max seconds)
34. Download sections (clip by time range)
35. Convert thumbnails to JPG
36. Rate limiting

---

## System Dependencies

| Tool | How to install |
|------|---------------|
| Node.js | Download from nodejs.org |
| yt-dlp | `winget install yt-dlp` |
| FFmpeg | `winget install ffmpeg` |
| Git | Already installed |
| GitHub CLI (gh) | Already installed |

---

## User Preferences

- **Zero-latency feel** — WebSocket, instant feedback, no loading spinners
- **Customization** — everything configurable through the GUI
- **Premium design** — glassmorphism, gradients, micro-animations
- **Safety** — never lose data, persistent config, GitHub backups

---

*Last updated: 2026-05-01*
