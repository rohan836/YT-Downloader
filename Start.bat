@echo off
title YT-Downloader v2
cd /d "%~dp0"

:: Ensure all tools are in PATH
set "PATH=%PATH%;C:\Program Files\nodejs"
set "PATH=%PATH%;%LOCALAPPDATA%\Microsoft\WinGet\Packages\yt-dlp.yt-dlp_Microsoft.Winget.Source_8wekyb3d8bbwe"
set "PATH=%PATH%;%LOCALAPPDATA%\Microsoft\WinGet\Packages\yt-dlp.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-N-123778-g3b55818764-win64-gpl\bin"

echo.
echo  Starting YT-Downloader v2...
echo.

:: Open browser
start "" http://localhost:3131

:: Start the server
node server.js
pause
