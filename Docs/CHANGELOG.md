# 📝 Changelog

All changes to the YT-Downloads workspace, logged by session.

---

## 2026-05-04 (Session 3)

### YT-Downloader App
- **New Feature: Clip / Trim UI**: Added a visual time-range selector with a toggle switch in the "Advanced Options" panel.
- **Bug Fix (Trimming Accuracy)**: Added `--force-keyframes-at-cuts` to ensure videos cut exactly at the specified start time.
- **Bug Fix (Audio Truncation)**: Forced AAC re-encoding for clips to prevent audio cutting off early due to stream copy misalignment.
- **Bug Fix (Duplicate Tabs)**: Removed redundant `start` command in `Start.bat` that caused the browser to open twice.
- **Download Optimization**: Updated format preference to native MP4/M4A to prevent FFmpeg merge errors.
- **App Update**: Set default download speed to **Fast** (Max Speed).

### Songs Collection
- **Title Verification (1-20)**: Completed web-search verification for the first 20 songs. Fixed 4 titles and filled missing metadata (Singer, Movie, Year).
- **New Infrastructure**: Created `VERIFY_PLAN.md` and `VERIFY_LOG.md` to establish a formal verification workflow.
- Added 6 new songs to the permanent collection:
    - #458: Sathiya Nahin Jaana
    - #459: Aadmi Musafir Hai
    - #460: Aya Sawan Jhoom Ke
    - #461: Saathi Mere Saathi
    - #462: Somwar Ko Hum Mile
    - #463: Bura Mat Suno Bura Mat Dekho Bura Mat Kaho
- **Current Total: 463 songs (1-463, no gaps).**
- Regenerated `SONGS.csv`, `AUDIO_SONGS.txt`, and `VIDEO_SONGS.txt`.

---

## 2026-05-01 (Session 2)

### Songs Collection
- Filled missing audio/video gaps for #340 and deleted duplicate #422 ("Yaadon Ki Baarat Nikli Hai").
- Cleaned and added 7 new downloads to the permanent collection.
- **Renumbered collection (423-451 shifted down)** to close the gap at #422.
- Current total: **452 songs (1-452, no gaps)**.
- Regenerated all `VIDEO_SONGS.txt`, `AUDIO_SONGS.txt`, and `SONGS.csv`.
- Created a clean `README.md` for the GitHub repository.

### YT-Downloader App
- **New Feature:** Added "Both (MP3+MP4)" download mode to queue sequential downloads.
- **Bug Fix:** Stopped backend from creating empty `Audio` and `Video` folders on startup.
- **Bug Fix:** Prevented settings UI from saving empty strings over default folder paths.
- Updated `README.md` to reflect new `New Audio/Video` defaults and Both mode.

### Infrastructure & Rules
- Added strict `CRITICAL RULE: NEVER change ANYTHING without user permission` to all `PLAN.md` files.
- Expanded Master and Collection Checklists to explicitly include updating CSVs, READMEs, and pushing both repos.
- Moved root `Docs\` folder into `App\Docs\` so it is tracked by GitHub.
- Deleted old stray folders. Workspace is 100% clean.

---

## 2026-05-01 (Session 1)

### Songs Collection
- Moved collection from `D:\1 1TB SSD\my old songs` → `D:\YT-Downloads\My Old Songs`
- Renamed `Vid` → `Video (Main)`, `Music` → `Audio (Main)`
- Renamed `Add_vid` / `Add_aud` → `New Video` / `New Audio`
- Added 24 songs (#423–#446) — cleaned YouTube titles, transliterated Hindi
- Total: **445 songs** (1–446, missing #340 video and #422 audio)

### YT-Downloader App
- Added `--convert-thumbnails jpg` to prevent `.webp` files
- Updated default download folders to `New Video` / `New Audio`
- Pushed `profiles.json` support

### Infrastructure
- Renamed download folders: `Video` → `New Video`, `Audio` → `New Audio`
- Created `PLAN.md` for master index, app, and songs — written for any AI to follow
- Added mandatory "After EVERY Task" checklists to all plans
- All repos pushed to GitHub

---
