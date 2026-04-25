# YT-Downloader v2 🚀

Welcome to **YT-Downloader v2**, your ultimate, high-performance web app for downloading media from YouTube, Instagram, TikTok, Twitter/X, Twitch, and 1000+ other platforms!

This guide will walk you through everything you need to know to get the most out of this tool, from basic downloads to power-user advanced options.

---

## 🌟 What is YT-Downloader?

YT-Downloader is a modern interface built on top of the powerful `yt-dlp` tool. It takes the complexity out of command-line downloading and provides a beautiful, zero-latency web interface. You can download audio, high-quality video, entire playlists, and manage all your files with ease.

### Features

- 🎨 **Premium dark UI** — glassmorphism, neon gradients, smooth animations
- ⚡ **Zero-latency** — WebSocket streaming, instant feedback
- 📊 **Real-time progress bars** — per-item percentage, speed, ETA
- 🔧 **Fully customizable** — every folder path, theme, accent color editable from Settings
- 🍪 **Smart cookie system** — Auto-detect by URL, browser extract, manual file, or disabled
- 📜 **Download history** — searchable log of all past downloads
- 🌙/☀️ **Dark/Light theme** + custom accent color picker
- 🔄 **One-click yt-dlp updater**
- 🛡️ **SponsorBlock** — auto-remove ads from YouTube
- ⚡ **Parallel fragments** — 4-16x faster downloads
- 🎵 **7 audio formats** — MP3, AAC, FLAC, Opus, WAV, M4A, Vorbis
- 📝 **Subtitle downloads** — any language, embedded or separate
- 🕵️ **Browser impersonation** — bypass anti-bot protections

### Supported Platforms

YouTube · Instagram · TikTok · Twitter/X · Facebook · Vimeo · Twitch · SoundCloud · and [1000+ more](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md)

---

## 📦 Requirements

You need these 3 things installed on your PC before using the app:

| # | Tool | What it does | Install |
|---|------|-------------|---------|
| 1 | [Node.js](https://nodejs.org/) | Runs the app (use LTS version) | Download from website → click Install |
| 2 | [yt-dlp](https://github.com/yt-dlp/yt-dlp) | The download engine | `winget install yt-dlp` in terminal |
| 3 | [FFmpeg](https://ffmpeg.org/) | Converts audio & merges video | `winget install ffmpeg` in terminal |

---

## 🛠️ Installation (Step by Step)

### Step 1: Clone the project
```bash
git clone https://github.com/rohan836/YT-Downloader.git
cd YT-Downloader
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Run the app
**Option A:** Double-click `Start.bat` (Windows — recommended)

**Option B:** Command line
```bash
npm start
```

The app opens automatically at `http://localhost:3131` ✅

---

## 📁 Folder Structure (Default)

All downloads are organized on your D: drive:

```
D:\YT-Downloads\
├── Audio\           ← MP3 / AAC / FLAC downloads
├── Video\           ← 1080p video downloads
├── 4K\              ← 4K video downloads
├── Lists\           ← Playlist text lists
├── Backups\         ← JSON playlist backups
├── Cookies\         ← Cookie files per platform (youtube.txt, instagram.txt)
└── Logs\
    ├── Failed\      ← Error logs
    └── Duplicates\  ← Skip-tracking archives (prevents re-downloading)
```

> All paths are customizable from the ⚙ Settings panel inside the app.

---

## ⚡ Quick Start (How to use it)

1. **Open the App:** Double-click `Start.bat`
2. **Ready:** Browser opens at `http://localhost:3131`
3. **Paste a URL** into the top text box
4. **Pick a mode** (Audio, Video, 4K, etc.)
5. **Hit Start Download** — watch the real-time progress!

---

## 🎨 The Interface Explained

The app is divided into a few key sections:

### 1. Paste URL
This is where the magic starts. Just copy the link of the video or playlist from your browser and paste it into the big text box at the top. The app will automatically detect if it's a YouTube link, Instagram link, etc.

### 2. Download Mode
Choose what you want to extract from the link:
- 🎵 **MP3 Audio:** Extracts the sound and saves it as an MP3 (or your chosen format). Perfect for music!
- 🎬 **1080p Video:** Downloads the video up to 1080p resolution (Standard High Definition).
- 🎥 **4K Video:** Grabs the absolute highest quality video available, up to 4K resolution.
- 📋 **List (Audio) / List (Video):** Doesn't download the media. Instead, it creates a text file listing all the titles in a playlist.
- 💾 **JSON Backup:** Downloads all the metadata (titles, descriptions, upload dates) of a video or playlist and saves it as a JSON file for archival.

### 3. Speed & Cookies
- **Speed:** 
  - **Fast:** Maximum speed.
  - **Medium / Slow:** Adds artificial delays between downloads. Use these if you are downloading massive playlists and want to avoid getting temporarily blocked by sites like YouTube.
- **Cookies:** 
  - Some sites (like Instagram) or age-restricted YouTube videos require you to be logged in. 
  - **Auto-detect:** The app will look in your `Cookies` folder for a text file matching the website name (e.g., `youtube.txt`, `instagram.txt`).
  - **From Browser:** The app will try to extract your active login session directly from your web browser (Chrome, Edge, Safari).
  - **Manual File:** Point exactly to a cookie text file on your PC.

---

## 🚀 Advanced Options (Power User Tools)

Want more control? Click on **🚀 ADVANCED OPTIONS** to reveal a suite of powerful tools:

| Feature | What it does |
|---|---|
| **🎵 Audio Format** | Don't want MP3? Choose AAC, FLAC (Lossless), Opus, WAV, M4A, or Vorbis. |
| **⚡ Parallel Fragments** | Speeds up downloads massively by downloading multiple pieces of the video at once. (Default is 4, higher is faster but riskier for bans). |
| **📋 Playlist Range** | Downloading a 100-video playlist but only want videos 10 to 20? Type `10:20` here. |
| **🔒 Rate Limit** | Cap your download speed (e.g., `5M` for 5 megabytes/sec) so you don't slow down the rest of your home internet. |
| **🛡️ SponsorBlock** | Automatically detects and removes sponsored segments, intros, and outros from YouTube videos! |
| **📝 Download Subtitles** | Downloads the captions for the video. You can type `en` for English, `all` for everything, or `es` for Spanish. |
| **📎 Embed Subtitles** | Bakes the downloaded subtitles directly into the video file so they show up in your media player. |
| **📖 Embed Chapters** | Adds clickable chapter markers to the video file based on the YouTube video's chapters. |
| **🖼️ Save Thumbnail** | Downloads the video's cover art as a separate image file alongside your video/audio. |
| **🔤 ASCII-only Filenames** | Removes emojis and special characters from the file name, making it highly compatible with older devices or car stereos. |
| **🌐 Proxy** | Paste a proxy address here if a video is blocked in your country. |
| **🕵️ Impersonate Browser** | Some sites block bots. Tell the app to pretend to be Chrome or Safari to trick them. |

---

## ⚙️ Settings & Customization

Click the **⚙ Settings** button in the top right to open the drawer.

- **Folder Paths:** You have complete control over where files go. By default, everything is neatly organized on your `D:\YT-Downloads\` drive into subfolders for Audio, Video, 4K, Logs, etc. You can change these to point anywhere on your PC!
- **Theme & Colors:** Toggle between Dark and Light mode, and use the color picker to change the app's accent color (Purple, Blue, Green, etc.).
- **Update yt-dlp:** yt-dlp updates frequently to fix broken sites. Click the **"Update yt-dlp now"** button to download the latest core engine instantly.

---

## 📈 Download History

At the very bottom, you'll see your **Download History**. It keeps a record of everything you've downloaded. You can search through past downloads to quickly find a file name or check if a download failed or succeeded.

---

## 📄 License

MIT

---

*Enjoy building your ultimate media library!* 🎶🎬
