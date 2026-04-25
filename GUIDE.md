# 📖 YT-Downloader v2 — Full Feature Guide

> Every feature explained with real examples. Bookmark this file!

---

## Table of Contents

1. [Starting the App](#1-starting-the-app)
2. [Pasting a URL](#2-pasting-a-url)
3. [Queue Mode — Multiple URLs](#3-queue-mode--multiple-urls)
4. [Drag & Drop](#4-drag--drop)
5. [Download Modes](#5-download-modes)
6. [Speed Control](#6-speed-control)
7. [Cookie Options](#7-cookie-options)
8. [Advanced Options — Full Breakdown](#8-advanced-options--full-breakdown)
   - [Audio Format](#-audio-format)
   - [Parallel Fragments](#-parallel-fragments)
   - [Playlist Range](#-playlist-range)
   - [Rate Limit](#-rate-limit)
   - [SponsorBlock](#-sponsorblock)
   - [Subtitles](#-subtitles)
   - [Embed Subtitles](#-embed-subtitles)
   - [Embed Chapters](#-embed-chapters)
   - [Save Thumbnail](#-save-thumbnail)
   - [ASCII Filenames](#-ascii-filenames)
   - [Proxy](#-proxy)
   - [Impersonate Browser](#-impersonate-browser)
   - [Output Template](#-output-template)
   - [Format Sort](#-format-sort)
   - [Split Chapters](#-split-chapters)
   - [Date Filter](#-date-filter)
   - [Duration Filter](#-duration-filter)
   - [Download Sections (Clip)](#-download-sections-clip)
9. [List Formats](#9-list-formats)
10. [Config Profiles](#10-config-profiles)
11. [Settings Panel](#11-settings-panel)
12. [Download History](#12-download-history)
13. [Desktop Notifications](#13-desktop-notifications)
14. [Update yt-dlp](#14-update-yt-dlp)
15. [Common Examples](#15-common-examples)
16. [Troubleshooting](#16-troubleshooting)

---

## 1. Starting the App

**Double-click** `Start.bat` inside the `YT-Downloader` folder.

```
d:\IDE\Antigravity\Projects\YT-Downloader\Start.bat
```

- A black terminal window opens — **don't close it**. It runs the server.
- Your browser automatically opens at `http://localhost:3131`.
- If browser doesn't open, type `http://localhost:3131` manually.

> **Tip:** You can minimize (not close) the terminal window and leave it running in the background.

---

## 2. Pasting a URL

1. Go to the video/playlist you want on YouTube, Instagram, TikTok, etc.
2. Copy the link from your browser's address bar (`Ctrl+C`).
3. Click the big text box at the top of the app.
4. Paste it (`Ctrl+V`).

The icon on the left of the box will automatically change to show the platform:

| Icon | Platform |
|------|----------|
| ▶️ | YouTube |
| 📸 | Instagram |
| 🎵 | TikTok |
| 🐦 | Twitter / X |
| 👤 | Facebook |
| 🎞️ | Vimeo |
| 🎮 | Twitch |
| 🎧 | SoundCloud |

---

## 3. Queue Mode — Multiple URLs

Download several videos one after another automatically.

**How to use:**
1. Click the **📋 Queue** button below the URL box.
2. A text area appears — paste **one URL per line**.

```
https://youtube.com/watch?v=AAA
https://youtube.com/watch?v=BBB
https://youtube.com/watch?v=CCC
```

3. Pick a mode and hit **Start Download**.
4. The app downloads them in order automatically. You'll see a toast showing how many are left.

**Drag a .txt file:** You can drag a `.txt` file full of URLs straight onto the URL box — it loads them all into the queue instantly.

---

## 4. Drag & Drop

Instead of copying and pasting, you can **drag a URL directly** from your browser onto the URL input box.

- Drag the tab's address bar text into the URL box → it fills in.
- Drag a `.txt` file full of URLs → it automatically loads into **Queue Mode**.

---

## 5. Download Modes

Click the big chips to choose what to download:

### 🎵 MP3 Audio
Downloads only the sound. Saves as an audio file (MP3 by default, changeable in Advanced).

- **Use for:** Music, podcasts, lectures, anything you want to listen to.
- **Saves to:** `D:\YT-Downloads\Audio\`
- **Skips duplicates:** Won't re-download a file you already have.

---

### 🎬 1080p Video
Downloads the video in Full HD (up to 1080p). Saves as MP4.

- **Use for:** Standard quality videos, movies, shows.
- **Saves to:** `D:\YT-Downloads\Video\`
- **Note:** If 1080p isn't available, it picks the best quality below it.

---

### 🎥 4K Video
Downloads the best available resolution, up to 4K (2160p). Saves as MP4.

- **Use for:** High-quality videos you want on a big screen.
- **Saves to:** `D:\YT-Downloads\4K\`
- **Warning:** 4K files are very large (2–10GB per video).

---

### 📋 List (Audio) / List (Video)
Does **NOT** download any media. Just creates a text file listing all video titles in a playlist.

- **Use for:** Seeing what's in a playlist before downloading, archiving titles.
- **Saves to:** `D:\YT-Downloads\Lists\list_TIMESTAMP.txt`
- **Example output in the file:**
  ```
  001 - Never Gonna Give You Up
  002 - Bohemian Rhapsody
  003 - Shape of You
  ```

---

### 💾 JSON Backup
Downloads all **metadata** (title, description, upload date, views, etc.) of a video or entire playlist — no media file.

- **Use for:** Archiving playlist data, backing up video info in case it gets deleted.
- **Saves to:** `D:\YT-Downloads\Backups\backup_TIMESTAMP.json`

---

## 6. Speed Control

Controls how fast the app sends requests to the server (not your raw download bandwidth).

| Speed | Behaviour | When to use |
|-------|-----------|-------------|
| **Fast** | No delays between requests | Single videos, personal use |
| **Medium** | 10–20 second pause between items | Long playlists (50–200 videos) |
| **Slow** | 25–55 second pause between items | Very long playlists, Instagram (strict limits) |

> **Why not always use Fast?** Sites like YouTube may temporarily block you if you send too many requests too quickly. Medium/Slow keeps you safe for big batch downloads.

---

## 7. Cookie Options

Some content requires you to be logged in — age-restricted videos, private playlists, Instagram stories, etc. Cookies let the app prove your identity.

### Auto-detect (Recommended)
Automatically looks in `D:\YT-Downloads\Cookies\` for a file named after the website:

| Website | Cookie file it looks for |
|---------|--------------------------|
| YouTube | `youtube.txt` |
| Instagram | `instagram.txt` |
| Twitter/X | `twitter.txt` |
| Facebook | `facebook.txt` |
| TikTok | `tiktok.txt` |
| Twitch | `twitch.txt` |

**How to create a cookie file:**
1. Install the **"Get cookies.txt LOCALLY"** browser extension.
2. Log in to the website.
3. Click the extension → Export cookies → Save as `youtube.txt`.
4. Move the file to `D:\YT-Downloads\Cookies\youtube.txt`.

---

### From Browser
Extracts your login session directly from Chrome, Edge, or Firefox.

1. Select **"From Browser"**.
2. Type your browser name in the box: `chrome`, `edge`, or `firefox`.
3. Make sure you're logged into the website in that browser.

> **Note:** This may not work if the browser is open/locked. Close it first if it fails.

---

### Manual File
Point directly to a specific cookie file anywhere on your PC.

1. Select **"Manual File"**.
2. Type the full path: `D:\YT-Downloads\Cookies\youtube.txt`

---

### Disabled
No cookies sent. Use for public videos that don't require login.

---

## 8. Advanced Options — Full Breakdown

Click **🚀 ADVANCED OPTIONS** to expand this section.

---

### 🎵 Audio Format

**What it does:** Changes the audio file format when using **MP3 Audio** mode.

| Format | Quality | File Size | Best For |
|--------|---------|-----------|----------|
| **mp3** | Good | Medium | Universal, works everywhere |
| **aac** | Good | Medium | Apple devices, iTunes |
| **flac** | Lossless (best) | Very Large | Audiophiles, archiving |
| **opus** | Excellent | Small | Streaming, Discord |
| **wav** | Lossless | Huge | Music production / editing |
| **m4a** | Good | Medium | Apple ecosystem |
| **vorbis** | Good | Small | Open-source alternative |

**Example:** Set to `flac` → download a song → you get a perfect lossless copy.

---

### ⚡ Parallel Fragments

**What it does:** Downloads multiple pieces of the same video simultaneously — makes downloads much faster.

- **Slider range:** 1 to 16
- **Default:** 4 (4 pieces at once)
- **Recommended:** 4–8 for most people

| Value | Speed | Risk |
|-------|-------|------|
| 1 | Normal | None |
| 4 | ~3–4× faster | Low |
| 8 | ~6–8× faster | Medium |
| 16 | Maximum | Higher (may get throttled) |

> **Tip:** Set to 8 for fast personal downloads. Keep at 4 for large playlists to stay safe.

---

### 📋 Playlist Range

**What it does:** Download only a specific slice of a playlist instead of everything.

**Format:** `start:end` or just `start:` or `:end`

| Input | What downloads |
|-------|----------------|
| `1:10` | First 10 videos |
| `5:15` | Videos 5 to 15 |
| `50:` | From video 50 to the end |
| `:20` | First 20 videos |
| `-5:` | Last 5 videos |

**Example:** Playlist has 200 songs. You only want songs 10–20. Type `10:20`.

---

### 🔒 Rate Limit

**What it does:** Caps your download speed so other apps/devices still have bandwidth.

**Format:** Number + unit

| Input | Speed Cap |
|-------|-----------|
| `5M` | 5 MB/second |
| `10M` | 10 MB/second |
| `500K` | 500 KB/second |
| `1G` | 1 GB/second (no practical limit) |

**Example:** You're downloading in the background while watching Netflix. Set to `3M` so Netflix doesn't buffer.

> Leave **blank** for unlimited speed (default).

---

### 🛡️ SponsorBlock

**What it does:** Automatically skips/removes sponsored segments, intros, outros, and self-promotions from YouTube videos.

- Toggle **ON** → yt-dlp uses the [SponsorBlock](https://sponsor.ajay.app/) community database to cut those parts out.
- Works only on **YouTube** videos.
- The segments are community-submitted — very accurate for popular videos.

**Example:** A 10-minute video has a 2-minute sponsor ad in the middle. With SponsorBlock ON, you get an 8-minute file with the ad completely removed.

---

### 📝 Subtitles

**What it does:** Downloads caption/subtitle files alongside the video.

1. Toggle **ON**.
2. The language box appears. Type the language code:

| Code | Language |
|------|----------|
| `en` | English |
| `hi` | Hindi |
| `es` | Spanish |
| `fr` | French |
| `de` | German |
| `ja` | Japanese |
| `all` | Every available language |
| `en,hi` | English AND Hindi |

**Output:** A `.vtt` or `.srt` file saved next to the video.

> **Tip:** Use `all` to grab every available subtitle, then keep what you need.

---

### 📎 Embed Subtitles

**What it does:** Instead of a separate `.srt` file, bakes the subtitles directly **inside** the `.mp4` file.

- Toggle **ON** (requires Subtitles to also be ON).
- The subtitles will appear in VLC, media players, and smart TVs automatically.
- Works with `.mp4` and `.mkv` formats.

---

### 📖 Embed Chapters

**What it does:** Adds chapter markers inside the video file, based on the YouTube video's chapters.

- Toggle **ON** (it's ON by default).
- In VLC or any modern media player, you can jump between chapters.
- If the video has no chapters, this does nothing.

**Example:** A 3-hour tutorial has chapters: "Intro", "Setup", "Building", "Testing". With this ON, you can jump directly to any section.

---

### 🖼️ Save Thumbnail

**What it does:** Downloads the video's cover image (thumbnail) as a separate image file.

- Toggle **ON** → saves a `.jpg` or `.webp` file next to your download.
- Great for keeping album art with your music files.

---

### 🔤 ASCII Filenames

**What it does:** Converts the filename to ASCII-only characters — removes emojis, accents, and special symbols.

- Toggle **ON** → `"Héllo Wörld 🎵.mp3"` becomes `"Hllo_Wrld_.mp3"`
- **Use when:** Copying to USB drives, old car stereos, or devices that don't handle special characters.

> Keep this **OFF** for normal use — you'll lose some info from the title.

---

### 🌐 Proxy

**What it does:** Routes the download through a proxy server — useful for geo-blocked content.

**Format:** Full proxy URL

```
socks5://127.0.0.1:1080       ← SOCKS5 proxy (e.g., VPN)
http://user:pass@host:port    ← HTTP proxy with auth
socks5://user:pass@host:port  ← SOCKS5 with auth
```

**Example:** A video is blocked in India. You have a SOCKS5 VPN running on port 1080. Type: `socks5://127.0.0.1:1080`.

> Leave **blank** if you don't need a proxy.

---

### 🕵️ Impersonate Browser

**What it does:** Makes yt-dlp pretend to be a real browser to bypass bot-detection systems.

**Options to type:**

| Value | Pretends to be |
|-------|----------------|
| `chrome` | Google Chrome (latest) |
| `chrome-116` | Chrome version 116 |
| `safari` | Apple Safari |
| `edge` | Microsoft Edge |
| `firefox` | Mozilla Firefox |

**Use when:** You get errors like "Sign in to confirm you're not a bot" or "HTTP Error 403".

**Example:** Instagram blocks your download. Type `chrome` → it thinks you're a real browser.

> Leave **blank** normally. Only use if you hit blocks.

---

### 📄 Output Template

**What it does:** Controls the format of the downloaded filename.

| Option | Example Filename |
|--------|-----------------|
| **clean** *(default)* | `Never Gonna Give You Up.mp3` |
| **withUploader** | `Rick Astley - Never Gonna Give You Up.mp3` |
| **withDate** | `1987-07-27 - Never Gonna Give You Up.mp3` |
| **numbered** | `001 - Never Gonna Give You Up.mp3` |

**Tip:** Use **numbered** for playlists so files sort in order. Use **withUploader** for music libraries.

---

### 🔀 Format Sort

**What it does:** Tells yt-dlp how to rank and pick between available video formats.

**Common values:**

| Input | Effect |
|-------|--------|
| `+size` | Prefer smaller file size |
| `-size` | Prefer larger file (better quality) |
| `res:1080` | Prefer exactly 1080p |
| `res:720` | Prefer 720p |
| `vcodec:h264` | Prefer H.264 video codec |
| `acodec:aac` | Prefer AAC audio |

**Example:** You want the smallest 1080p file. Type: `res:1080,+size`

> Leave **blank** to use the app's smart default (best quality).

---

### ✂️ Split Chapters

**What it does:** Splits a long video into **separate files** — one per chapter.

- Toggle **ON** → a 3-hour video with 10 chapters saves as 10 separate files.
- The files are named after each chapter.
- **Use for:** Albums, long tutorials, podcasts with chapters.

**Example:** Download an album upload on YouTube. Each song becomes its own `.mp3` file automatically.

---

### 📅 Date Filter

**What it does:** Only download videos **uploaded within a date range**.

**Format:** `YYYYMMDD`

| Field | Effect |
|-------|--------|
| **After date** | Only videos uploaded AFTER this date |
| **Before date** | Only videos uploaded BEFORE this date |

**Examples:**

| After | Before | Result |
|-------|--------|--------|
| `20240101` | *(blank)* | Only 2024+ videos |
| *(blank)* | `20231231` | Only videos before 2024 |
| `20230101` | `20231231` | Only 2023 videos |

**Use case:** A channel with 500 videos — you only want the ones from this year. Type `20260101` in "After".

---

### ⏱️ Duration Filter

**What it does:** Skip videos that are too short or too long.

| Field | Format | Example |
|-------|--------|---------|
| **Min Duration** | seconds | `60` = minimum 1 minute |
| **Max Duration** | seconds | `600` = maximum 10 minutes |

**Common conversions:**

| Duration | Seconds |
|----------|---------|
| 30 seconds | `30` |
| 1 minute | `60` |
| 5 minutes | `300` |
| 10 minutes | `600` |
| 1 hour | `3600` |

**Example:** You're downloading a playlist but want to skip YouTube Shorts (under 60 seconds). Set Min Duration to `61`.

---

### ✂️ Download Sections (Clip)

**What it does:** Download only a specific time range from a video — clips it automatically.

**Format:** `*START-END` (in `HH:MM:SS` or seconds)

| Input | What you get |
|-------|--------------|
| `*00:01:00-00:05:00` | Minutes 1 to 5 |
| `*0:30-1:00` | 30 seconds to 1 minute |
| `*120-300` | 2 minutes to 5 minutes (in seconds) |
| `*00:00:00-00:03:30` | First 3 minutes 30 seconds |

**Example:** You want just the chorus of a song (1:00–1:30). Type: `*00:01:00-00:01:30`

> **Requires FFmpeg** to be installed (it usually is — the app installs it automatically).

---

## 9. List Formats

**What it does:** Shows you every available quality/format for a URL before you download.

**How to use:**
1. Paste a URL in the URL box.
2. Click **📊 List Formats** (button below the URL box).
3. A popup appears showing every format:

```
ID  EXT   RESOLUTION  FPS  SIZE      CODEC
137 mp4   1920x1080   30   450.23MiB h264
248 webm  1920x1080   30   380.12MiB vp9
140 m4a   audio only       6.12MiB   mp4a
251 webm  audio only       4.45MiB   opus
```

**Use for:** Knowing exactly what quality is available before deciding what to download. You can also use a Format ID with the Format Sort field.

---

## 10. Config Profiles

**What it does:** Save your current Advanced Options settings as a named profile, and load them instantly later.

**Use case:** You have two setups:
- **"Music Mode"** → FLAC, SponsorBlock ON, embed chapters ON
- **"Video Mode"** → MP4, subtitles ON, embed chapters ON, numbered filenames

**How to save a profile:**
1. Set all your Advanced Options as you like.
2. Click **💾 Save Profile**.
3. Type a name (e.g., `Music Mode`) → click OK.

**How to load a profile:**
1. Click the dropdown → select your profile.
2. Click **📂 Load** → all your settings snap into place instantly.

**How to delete a profile:**
1. Select it in the dropdown.
2. Click **🗑️ Delete**.

---

## 11. Settings Panel

Click **⚙ Settings** in the top-right corner.

### Folder Paths
Every destination folder is fully customizable:

| Setting | Default | Purpose |
|---------|---------|---------|
| Audio Folder | `D:\YT-Downloads\Audio` | Where MP3/FLAC/etc. save |
| Video Folder | `D:\YT-Downloads\Video` | Where 1080p saves |
| 4K Folder | `D:\YT-Downloads\4K` | Where 4K saves |
| Lists Folder | `D:\YT-Downloads\Lists` | Where playlist text files save |
| Backups Folder | `D:\YT-Downloads\Backups` | Where JSON backups save |
| Cookies Dir | `D:\YT-Downloads\Cookies` | Where your cookie files live |
| Failed Logs | `D:\YT-Downloads\Logs\Failed` | Where error logs write |
| Duplicates | `D:\YT-Downloads\Logs\Duplicates` | Skip-tracking archive |

**To change:** Click the field → type the new path → click **Save Settings**.

---

### Theme & Colors

| Control | What it does |
|---------|-------------|
| **☀️/🌙 Toggle** (top right) | Switches between Dark and Light mode instantly |
| **Dark / Light radio** | Same toggle in settings |
| **Color picker** | Change the app's accent color (purple, blue, green, etc.) |
| **Reset Color** | Goes back to the default purple |

---

### yt-dlp Path

If you have a custom installation of yt-dlp, type the full path here instead of just `yt-dlp`.

**Example:** `C:\MyTools\yt-dlp.exe`

---

### Port

Default: `3131`. Change it if another app is using that port. Requires app restart.

---

## 12. Download History

At the bottom of the app, every download is logged automatically.

**What it shows:**
- The URL downloaded
- Mode (Audio, Video, 4K, etc.)
- Speed setting used
- Date & time
- Status (✅ done / ❌ error / cancelled)

**How to search:**
- Type in the **Search...** box → filters history in real-time.

**How to clear:**
- Click **Clear** → confirms → wipes all history.

> History is saved to `history.json` in the app folder. It keeps the last 500 downloads.

---

## 13. Desktop Notifications

When a download finishes (or the whole queue completes), a Windows notification pops up saying **"Download complete! 🎉"**.

- The browser will ask for permission the first time — click **Allow**.
- Works even if the browser window is minimized or hidden.
- If you denied permission, reset it in your browser's site settings for `localhost`.

---

## 14. Update yt-dlp

yt-dlp gets updates very frequently — broken sites get fixed within hours.

**How to update:**
1. Click **⚙ Settings**.
2. Click **🔄 Update yt-dlp now**.
3. You'll see toast messages showing the update progress.
4. Done — no terminal needed.

> **When to update:** If a site that worked before suddenly fails, update yt-dlp first. That fixes 90% of issues.

---

## 15. Common Examples

### Download a single YouTube song as MP3
1. Paste: `https://youtube.com/watch?v=XXXXXXX`
2. Mode: **MP3 Audio**
3. Speed: **Medium**
4. Hit **Start Download**

---

### Download a playlist (first 20 songs only)
1. Paste playlist URL
2. Mode: **MP3 Audio**
3. Advanced → Playlist Range: `1:20`
4. Speed: **Slow** (for large batches)
5. Hit **Start Download**

---

### Download a YouTube video without ads/sponsors
1. Paste URL
2. Mode: **1080p Video**
3. Advanced → SponsorBlock: **ON**
4. Hit **Start Download**

---

### Clip just the first 2 minutes of a video
1. Paste URL
2. Mode: **1080p Video**
3. Advanced → Download Sections: `*00:00:00-00:02:00`
4. Hit **Start Download**

---

### Download a music album, split into individual songs
1. Paste the YouTube video URL (full album with chapters)
2. Mode: **MP3 Audio**
3. Advanced → Split Chapters: **ON**
4. Hit **Start Download** → you get one file per song!

---

### Download FLAC lossless audio
1. Paste URL
2. Mode: **MP3 Audio** (mode doesn't change, format does)
3. Advanced → Audio Format: **flac**
4. Hit **Start Download**

---

### Batch download from a text file
1. Click **📋 Queue**
2. Drag your `.txt` file (one URL per line) onto the URL box
3. Pick mode and settings
4. Hit **Start Download** — downloads all in sequence

---

## 16. Troubleshooting

### ❌ "Failed to start yt-dlp: ENOENT"
**Cause:** yt-dlp not found.
**Fix:** Run `winget install yt-dlp` in terminal, then restart the app.

---

### ❌ Download starts but immediately fails
**Cause 1:** The video is age-restricted or private.
**Fix:** Add a cookie file for that site (see [Cookie Options](#7-cookie-options)).

**Cause 2:** yt-dlp is outdated.
**Fix:** Click Settings → Update yt-dlp.

---

### ❌ "HTTP Error 403: Forbidden"
**Cause:** Site is blocking the bot.
**Fix:** Advanced → Impersonate Browser → type `chrome`.

---

### ❌ Audio only, no video (or vice versa)
**Cause:** FFmpeg not installed.
**Fix:** Run `winget install ffmpeg` in terminal, then restart the app.

---

### ❌ Browser doesn't open when I click Start.bat
**Fix:** Manually open `http://localhost:3131` in your browser.

---

### ❌ Port already in use
**Fix:** Settings → Port → change to `3132` or another number → Save → restart app.

---

### ⚠️ Download is slow even on Fast mode
**Note:** Speed mode controls delays between requests, not raw bandwidth. Actual download speed depends on:
- Your internet connection
- The source server's speed
- Try: Advanced → Parallel Fragments → increase to 8

---

*That's everything! 🎉 If something's missing or unclear, open an issue on [GitHub](https://github.com/rohan836/YT-Downloader).*
