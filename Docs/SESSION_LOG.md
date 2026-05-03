# 🕐 Session Log

> The AI MUST write a short summary here at the END of every session.
> The next AI reads this to know what just happened.

---

## Last Session: 2026-05-04 (Current)

**What was done:**
- **App Feature**: Implemented a comprehensive **Clip / Trim** feature with a visual UI in the "Advanced Options" panel.
- **App Bug Fixes**:
    - Resolved the "FFmpeg stall" by automating the `*` prefix for time ranges.
    - Fixed inaccurate cutting by forcing keyframes at cut points.
    - Fixed audio truncation by re-encoding audio to AAC during trimming.
    - Fixed the "double browser tab" issue on startup by removing duplicate `start` command in `Start.bat`.
    - Optimized download format to prefer native MP4/M4A for better merging.
- **Collection Management**:
    - Added **4 new songs** (#454 - #457).
    - Renamed and moved files from `New Audio/Video` to `Main` folders.
    - Regenerated `SONGS.csv`, `AUDIO_SONGS.txt`, and `VIDEO_SONGS.txt`.
- **Infrastructure**:
    - Updated all project documentation (PLAN.md, README.md, CHANGELOG.md) to reflect the new count of **457**.
    - Pushed all changes to both `YT-Downloader` and `my-old-songs` GitHub repositories.

**Next Steps / Pending:**
- Continue adding songs starting from **#458**.
- Monitor for any further audio/video sync issues with the new trimming logic.
- Consider adding a "Precise Cut" toggle if re-encoding speed becomes an issue for the user.

---

## Previous Session: 2026-05-01

**What was done:**
- Fixed numbering gaps in the "My Old Songs" collection (Sequence: 1–453).
- Added "Both (MP3+MP4)" mode and fixed folder path bugs in the app.
- Consolidated all documentation into `App\Docs\`.
- Created strict mandatory checklists for future AI assistants.
