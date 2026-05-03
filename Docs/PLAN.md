# 📋 YT-Downloads — Master Reference for AI Assistants

> **YOU (the AI) MUST read this file first before doing ANY work in this workspace.**
> This file explains everything about the user's setup so you can help immediately.
> 
> 🚨 **CRITICAL RULE: NEVER change ANYTHING without the user's explicit permission. This includes modifying files, changing folder structures, or altering the text and rules within this PLAN.md file itself. Always ask first.**

---

## Who is the User?

- A person who collects classic old Hindi (Bollywood) songs
- Downloads videos and audio from YouTube using a custom web app
- Keeps a curated, numbered collection of songs with strict naming rules
- Uses Windows, PowerShell, Node.js, Git, and GitHub
- GitHub username: **rohan836**

---

## What is This Workspace?

`D:\YT-Downloads\` is the user's central hub for everything related to downloading and collecting media.

```
D:\YT-Downloads\
│
├── Docs\                       ← All documentation lives here
│   ├── PLAN.md                 ← THIS FILE — master reference, read first
│   ├── SESSION_LOG.md          ← What the last AI session did — read second
│   ├── CHANGELOG.md            ← Full history of all changes
│   └── WISHLIST.txt            ← URLs the user wants to download later
│
├── App\                        ← YT-Downloader web app (Node.js)
│   ├── PLAN.md                 ← Detailed app reference (features, code, how to edit)
│   ├── Start.bat               ← Double-click to launch the app
│   ├── server.js               ← Backend
│   ├── public\                 ← Frontend (HTML/CSS/JS)
│   └── ...
│
├── My Old Songs\               ← The user's permanent song collection (VERY IMPORTANT)
│   ├── PLAN.md                 ← Detailed collection reference (rules, naming, workflow)
│   ├── Video (Main)\           ← 456 numbered MP4 files
│   ├── Audio (Main)\           ← 456 numbered MP3 files
│   ├── Docs\
│   │   ├── SONGS.csv           ← Song database (number, title, singer, movie, year)
│   │   ├── AUDIO_SONGS.txt     ← List of all MP3s
│   │   └── VIDEO_SONGS.txt     ← List of all MP4s
│   └── ...
│
├── New Video\                  ← Where the app downloads new videos
├── New Audio\                  ← Where the app downloads new audio
├── 4K\                         ← 4K video downloads
├── Lists\                      ← Playlist text exports
├── Backups\                    ← JSON metadata backups
├── Cookies\                    ← Cookie files for authenticated downloads
└── Logs\                       ← Error logs and duplicate tracking
```

---

## What the User Might Ask You To Do

### Task 1: "Add songs" / "Move songs to main" / "Process new downloads"
**What this means:** New files are sitting in `New Video\` and `New Audio\`. The user wants you to clean the filenames, number them, and move them into the permanent collection.

**Read:** `My Old Songs\PLAN.md` — it has the exact step-by-step process.

**Key things you MUST do:**
- Clean YouTube junk from filenames (remove singer names, actor names, movie names, HD/4K tags, emojis)
- **Hindi text** — some filenames will be in Hindi/Devanagari script. You must transliterate them to English. Example: "मुझे ऐसा मिला मोती" → "Mujhe Aisa Mila Moti"
- Number each song starting from the next available number
- Move both the .mp4 AND .mp3 to the Main folders
- Verify counts match after moving
- Update the song list files
- Push to GitHub

---

### Task 2: "Download this song/video"
**What this means:** The user wants to download from a URL.

**Option A:** Start the YT-Downloader app and use it through the browser.
**Option B:** Run yt-dlp directly from the command line.

**Read:** `App\PLAN.md` for how to start the server.

---

### Task 3: "Fix the app" / "Add feature to the app"
**What this means:** The user wants to modify the YT-Downloader web application.

**Read:** `App\PLAN.md` — it has the architecture, key files, code sections, and step-by-step for adding features.

---

### Task 4: "Check my collection" / "Verify songs"
**What this means:** Run a verification to make sure Video and Audio counts match and no files are missing.

**Read:** `My Old Songs\PLAN.md` — it has the exact PowerShell script for this.

---

### Task 5: "Push to GitHub" / "Update repo"
**What this means:** Commit and push changes to GitHub.

There are **two separate repos:**
| Repo | Local Path | GitHub |
|------|-----------|--------|
| YT-Downloader app | `D:\YT-Downloads\App\` | https://github.com/rohan836/YT-Downloader |
| Song collection | `D:\YT-Downloads\My Old Songs\` | https://github.com/rohan836/my-old-songs |

Push to whichever one changed. If both changed, push both.

---

## Critical Rules for ANY AI Working Here

1. **Read the specific PLAN.md** before doing anything. `App\PLAN.md` for app work, `My Old Songs\PLAN.md` for song work.
2. **Never delete files from Video (Main) or Audio (Main)** unless the user explicitly says "delete".
3. **Always use `-LiteralPath`** in PowerShell — many filenames have special characters.
4. **Always verify counts** after file operations. If Video and Audio counts don't match, STOP and tell the user.
5. **Hindi text must be transliterated** to English — this is why the user needs an AI, not a script.
6. **Push to GitHub** after every change.
7. **Update the PLAN.md files** if you change something important (like adding songs changes the count).

---

## ⚠️ MANDATORY: After EVERY Task Checklist

**You MUST do ALL of these after completing ANY task. No exceptions.**

### If you changed song files:
- [ ] Update `My Old Songs\Docs\PLAN.md` → "Current State" table (total count, next number, missing numbers)
- [ ] Update `My Old Songs\README.md` → Total songs and numbering range
- [ ] Regenerate `My Old Songs\Docs\VIDEO_SONGS.txt` and `AUDIO_SONGS.txt`
- [ ] Update `My Old Songs\Docs\SONGS.csv`
- [ ] Update THIS file (`App\Docs\PLAN.md`) → The folder map counts at the top
- [ ] Update `App\Docs\SESSION_LOG.md` and `CHANGELOG.md` with what you did
- [ ] Push BOTH `My Old Songs` repo AND `App` repo to GitHub

### If you changed the app:
- [ ] Update `App\PLAN.md` → feature list, code line numbers, or architecture if changed
- [ ] Push `App` repo to GitHub

### If you changed folders, paths, or structure:
- [ ] Update ALL three PLAN.md files with new paths/names
- [ ] Update `server.js` DEFAULT_CONFIG if download folder paths changed
- [ ] Push ALL affected repos to GitHub

### If you added anything new (files, folders, features):
- [ ] Document it in the relevant PLAN.md
- [ ] Push to GitHub

### ALWAYS do these (every session, no matter what):
- [ ] Update `Docs\SESSION_LOG.md` — write what you did, current state, anything pending
- [ ] Update `Docs\CHANGELOG.md` — add a dated entry for what changed
- [ ] If the user mentioned songs to download later → add URLs to `Docs\WISHLIST.txt`

### Why this matters:
The PLAN.md files are the **single source of truth**. The next AI that reads them will use the information to do things automatically. If the plans are outdated (wrong paths, wrong counts, wrong folder names), the next AI will break things. **YOU are responsible for keeping them accurate.**

---

## System Info

| Thing | Value |
|-------|-------|
| OS | Windows |
| Shell | PowerShell |
| Node.js | Installed |
| yt-dlp | Installed (via winget) |
| FFmpeg | Installed (via winget) |
| Git | Installed |
| GitHub CLI (gh) | Installed |
| GitHub user | rohan836 |
| App URL | http://localhost:3131 |
| App launch | Double-click `D:\YT-Downloads\App\Start.bat` |

---

*Last updated: 2026-05-01*

