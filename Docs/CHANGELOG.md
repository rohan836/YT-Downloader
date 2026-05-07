# 📝 Changelog

All changes to the YT-Downloads workspace, logged by session.

---

## 2026-05-08 (Session 5)

### Songs Collection
- **Distinguished Multi-Part Songs**: Renamed #338 and #339 ("Ab Ke Sajan Sawan Mein") to include **Part 1** and **Part 2** at the beginning of the title.
- **Fixed Song #450**: Corrected misnamed song #450 to *Tum Saath Ho Jab Apne* (Kaalia, 1981). Removed the temporary "Part 2" suffix.
- **Corrected Song #449**: Found that #449 was actually *Maine Tujhe Manga (Short Version)* from *Deewaar* (1975) and fixed its metadata accordingly.
- **Corrected Song #5**: Discovered that song #5 was mislabeled as *Bahut Der Tumne Sataya Hai Mujhko* but actually contained *Roop Tera Mastana* (Kishore Kumar - Aradhana - 1969). Corrected the title, tags, and database row.
- **Downloaded Favorite #2**: Located and downloaded the *actual* song *Bahut Der Tumne Sataya Hai Mujhko* (Asha Bhosle - Man Ki Aankhen - 1970) from YouTube and added it to the `My Favorites` collection as Song #2.
- **Physically Moved Favorite #1**: Physically moved the files for song #455 (*Nazron Se Keh Do*) from the main `My Old Songs` collection into `My Favorites` as Song #1, while leaving its number slot empty in the main folders to maintain the numbering sequence.
- **Library Audit (Duplicates Fixed)**: Discovered sets of duplicates that were incorrectly labeled by the AI. Fixed #209, #329, #66, and #357 to reflect their true audio content, marked as Part 1 and Part 2.
- **Corrected Song #464**: Downloaded the real *Mohabbat Ab Tijarat Ban Gayi* (Anwar - Arpan - 1983) from YouTube, fully replaced the mislabeled audio/video files, and reverted #463 back to its standard name.

---
+
+## 2026-05-07 (Session 4)

### Songs Collection
- **Metadata Tags Embedded**: Used ffmpeg to write Title, Artist, Album, Year, and Track into all 926 files (463 audio + 463 video).
- **Full Format Rename**: Renamed all 926 files from `{Num} {Title}` to `{Num} {Title} - {Singer} - {Movie} - {Year}`.
- **Documentation Update**: Updated `PLAN.md`, `VERIFY_PLAN.md`, `VERIFY_LOG.md`, `README.md`, and `App/Docs/PLAN.md` to reflect the new standard filename format and web-search workflow for new songs.
- **Added 6 new songs** to the permanent collection:
    - #464: Mohabbat Ab Tijarat Ban Gayi (Anwar - Arpan, 1983)
    - #465: Kya Hua Tera Wada (Mohammed Rafi, Sushma Shrestha - Hum Kisise Kum Naheen, 1977)
    - #466: O Saathi Re Tere Bina Bhi Kya Jeena (Kishore Kumar - Muqaddar Ka Sikandar, 1978)
    - #467: Tauba Kaise Hai Nadan Ghunghroo Payal Ke (Lata Mangeshkar - Arpan, 1983)
    - #468: Ek Din Bik Jayega Mati Ke Mol (Mukesh - Dharam Karam, 1975)
    - #469: Pardes Jake Pardesia (Lata Mangeshkar - Arpan, 1983)
- **Current Total: 469 songs (1-469, no gaps).**

---

## 2026-05-05 (Session 3)

### YT-Downloader App
- **New Feature: Clip / Trim UI**: Added a visual time-range selector with a toggle switch in the "Advanced Options" panel.
- **Bug Fix (Trimming Accuracy)**: Added `--force-keyframes-at-cuts` to ensure videos cut exactly at the specified start time.
- **Bug Fix (Audio Truncation)**: Forced AAC re-encoding for clips to prevent audio cutting off early due to stream copy misalignment.
- **Bug Fix (Duplicate Tabs)**: Removed redundant `start` command in `Start.bat` that caused the browser to open twice.
- **Download Optimization**: Updated format preference to native MP4/M4A to prevent FFmpeg merge errors.
- **App Update**: Set default download speed to **Fast** (Max Speed).

### Songs Collection
- **Full Library Verification (1-463)**: Completed exhaustive web-search verification for the entire collection. All 463 songs now have standardized titles and full metadata (Singer, Movie, Year).
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
