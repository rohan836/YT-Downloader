# YT-Downloader v2

A modern, fully-customizable media downloader with a premium dark UI — powered by [yt-dlp](https://github.com/yt-dlp/yt-dlp).

![Dark glassmorphism UI with real-time progress](https://img.shields.io/badge/UI-Modern%20Web%20App-7c3aed?style=for-the-badge)

## Features

- 🎨 **Premium dark UI** — glassmorphism, neon gradients, smooth animations
- ⚡ **Zero-latency** — WebSocket streaming, instant feedback
- 📊 **Real-time progress bars** — per-item percentage, speed, ETA
- 🔧 **Fully customizable** — every folder path, theme, accent color editable from Settings
- 🍪 **Smart cookie system** — Auto-detect by URL, browser extract, manual file, or disabled
- 📜 **Download history** — searchable log of all past downloads
- 🌙/☀️ **Dark/Light theme** + custom accent color picker
- 🔄 **One-click yt-dlp updater**

## Supported Platforms

YouTube · Instagram · TikTok · Twitter/X · Facebook · Vimeo · Twitch · SoundCloud · and [1000+ more](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md)

## Download Modes

| Mode | Description |
|------|-------------|
| 🎵 MP3 Audio | 320kbps MP3 with metadata & thumbnail |
| 🎬 1080p Video | Best quality up to 1080p MP4 |
| 🎥 4K Video | Best quality up to 2160p MP4 |
| 📋 Playlist List | Export playlist titles to text file |
| 💾 JSON Backup | Full playlist metadata backup |

## Requirements

- [Node.js](https://nodejs.org/) (LTS recommended)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- [FFmpeg](https://ffmpeg.org/) (for audio conversion & video merging)

## Installation

```bash
git clone https://github.com/YOUR_USERNAME/YT-Downloader.git
cd YT-Downloader
npm install
```

## Usage

**Option 1:** Double-click `Start.bat` (Windows)

**Option 2:** Command line
```bash
npm start
```

Opens automatically at `http://localhost:3131`

## Folder Structure (Default)

```
D:\YT-Downloads\
├── Audio\           ← MP3 downloads
├── Video\           ← 1080p video downloads
├── 4K\              ← 4K video downloads
├── Lists\           ← Playlist text lists
├── Backups\         ← JSON playlist backups
├── Cookies\         ← Cookie files per platform
└── Logs\
    ├── Failed\      ← Error logs
    └── Duplicates\  ← Skip-tracking archives
```

All paths are customizable from the Settings panel.

## License

MIT
