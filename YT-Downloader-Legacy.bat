@echo off
:: --- FIX: Forces the script to run from the correct drive even if opened from the Desktop ---
cd /d "D:\All"

title Universal YT-DLP Smart Downloader - Multi-Platform
color 0A
echo =====================================================
echo       Smart YT-DLP Universal Downloader (Menu)
echo =====================================================
echo.

:: ================== YOUR CUSTOM SETTINGS ==================
set "TARGET_URL=https://youtube.com/playlist?list=PLSVkseU0m9LeU3SRMM9da1-Hu8PzYfMHb"

set "AUDIO_FOLDER=D:\All\Audio"
set "VIDEO_FOLDER=D:\All\Video"

:: --- NEW SMART COOKIE SYSTEM ---
set "COOKIES_DIR=D:\All\AllCookies"
set "COOKIE_MODE=Auto"       :: Auto, Manual, Browser, or None
set "MANUAL_COOKIE=%COOKIES_DIR%\default.txt"

set "MODE=Audio"             :: Default Mode
set "SPEED=Medium"           :: Default Speed
:: ===========================================================

:: Auto-create Cookie directory and guide
if not exist "%COOKIES_DIR%" mkdir "%COOKIES_DIR%"
if not exist "%COOKIES_DIR%\readme.txt" (
    echo Place your cookie text files here! > "%COOKIES_DIR%\readme.txt"
    echo Name them matching the website: youtube.txt, instagram.txt, tiktok.txt, facebook.txt, twitter.txt, vimeo.txt >> "%COOKIES_DIR%\readme.txt"
    echo The script's "Auto" mode will look at your URL and select the right cookie file automatically. >> "%COOKIES_DIR%\readme.txt"
)

:MAIN_MENU
cls
echo =====================================================
echo       Smart YT-DLP Universal Downloader (Menu)
echo =====================================================
echo.
echo                 --- CURRENT SETTINGS ---
echo.
echo  [1] Target URL   : %TARGET_URL%
echo  [2] Save Folders : Audio: %AUDIO_FOLDER% ^| Video: %VIDEO_FOLDER%
echo  [3] Download Mode: %MODE%
echo  [4] Speed        : %SPEED%
echo  [5] Cookies Mode : %COOKIE_MODE% 
if "%COOKIE_MODE%"=="Auto" echo                   (Dir: %COOKIES_DIR%)
if "%COOKIE_MODE%"=="Manual" echo                   (File: %MANUAL_COOKIE%)
if "%COOKIE_MODE%"=="Browser" echo                   (Browser: %MANUAL_COOKIE%)
echo.
echo -----------------------------------------------------
echo  [S] START OPERATION with the settings above
echo  [0] Exit Application
echo -----------------------------------------------------
echo.
set /p MENU_CHOICE="Enter a number to change a setting, 'S' to Start, '0' to Exit: "

if /i "%MENU_CHOICE%"=="S" goto START_PROCESS
if "%MENU_CHOICE%"=="1" goto SET_TARGET_URL
if "%MENU_CHOICE%"=="2" goto SET_FOLDERS
if "%MENU_CHOICE%"=="3" goto SET_MODE
if "%MENU_CHOICE%"=="4" goto SET_SPEED
if "%MENU_CHOICE%"=="5" goto SET_COOKIES
if "%MENU_CHOICE%"=="0" exit
goto MAIN_MENU

:SET_TARGET_URL
cls
echo =====================================================
echo                UPDATE TARGET URL
echo =====================================================
echo Current URL : %TARGET_URL%
echo.
set /p NEW_URL="Paste new URL (YT, IG, Twitch, Vimeo, FB, TikTok, etc) or press Enter to go back: "
if not "%NEW_URL%"=="" set "TARGET_URL=%NEW_URL%"
goto MAIN_MENU

:SET_FOLDERS
cls
echo =====================================================
echo               UPDATE SAVE DIRECTORIES
echo =====================================================
echo Current Audio Folder : %AUDIO_FOLDER%
echo Current Video Folder : %VIDEO_FOLDER%
echo.
set /p NEW_AUDIO="Enter NEW Audio Folder [%AUDIO_FOLDER%]: "
if not "%NEW_AUDIO%"=="" set "AUDIO_FOLDER=%NEW_AUDIO%"
set /p NEW_VIDEO="Enter NEW Video Folder [%VIDEO_FOLDER%]: "
if not "%NEW_VIDEO%"=="" set "VIDEO_FOLDER=%NEW_VIDEO%"
goto MAIN_MENU

:SET_COOKIES
cls
echo =====================================================
echo                 COOKIE MANAGEMENT
echo =====================================================
echo Using cookies allows you to download private/restricted 
echo content from Instagram, Facebook, Vimeo, OnlyFans, etc.
echo.
echo Current Mode : %COOKIE_MODE%
echo.
echo -----------------------------------------------------
echo [1] AUTO-DETECT (Matches URL to text files like youtube.txt)
echo [2] MANUAL FILE (Force the script to use a specific text file)
echo [3] DISABLE Cookies (Run anonymously)
echo [4] BROWSER DIRECT (Auto-pull from Chrome/Edge/Firefox)
echo.
echo [0] BACK to Main Menu
echo.
set /p C_CHOICE="Enter a number (0-4): "

if "%C_CHOICE%"=="1" set "COOKIE_MODE=Auto"
if "%C_CHOICE%"=="2" goto SET_MANUAL_COOKIE
if "%C_CHOICE%"=="3" set "COOKIE_MODE=None"
if "%C_CHOICE%"=="4" goto SET_BROWSER_COOKIE
goto MAIN_MENU

:SET_MANUAL_COOKIE
echo.
set /p NEW_MANUAL="Type the file name (e.g. instagram.txt) or full path: "
if exist "%COOKIES_DIR%\%NEW_MANUAL%" (
    set "MANUAL_COOKIE=%COOKIES_DIR%\%NEW_MANUAL%"
    set "COOKIE_MODE=Manual"
) else if exist "%NEW_MANUAL%" (
    set "MANUAL_COOKIE=%NEW_MANUAL%"
    set "COOKIE_MODE=Manual"
) else (
    echo Error: File not found! Make sure you saved it in %COOKIES_DIR%.
    pause
)
goto SET_COOKIES

:SET_BROWSER_COOKIE
echo.
echo Which browser do you want to extract cookies from?
echo (Supported: chrome, edge, firefox, brave, opera, vivaldi, safari)
echo.
set /p BROWSER_NAME="Type browser name (e.g. chrome): "
if not "%BROWSER_NAME%"=="" (
    set "COOKIE_MODE=Browser"
    set "MANUAL_COOKIE=%BROWSER_NAME%"
)
goto SET_COOKIES

:SET_MODE
cls
echo =====================================================
echo                CHOOSE DOWNLOAD MODE
echo =====================================================
echo Current Mode: %MODE%
echo.
echo [1] Audio (MP3 320kbps)
echo [2] Video (1080p MP4)
echo [3] 4K (2160p MP4)
echo [4] ListOnly (Save list to Audio Folder)
echo [5] ListOnly (Save list to Video Folder)
echo [6] BackupJSON (Save to Audio Folder)
echo [7] BackupJSON (Save to Video Folder)
echo.
echo [0] BACK to Main Menu
echo.
set /p MODE_CHOICE="Enter a number (0-7): "
if "%MODE_CHOICE%"=="1" set "MODE=Audio"
if "%MODE_CHOICE%"=="2" set "MODE=Video"
if "%MODE_CHOICE%"=="3" set "MODE=4K"
if "%MODE_CHOICE%"=="4" set "MODE=ListAudio"
if "%MODE_CHOICE%"=="5" set "MODE=ListVideo"
if "%MODE_CHOICE%"=="6" set "MODE=BackupAudio"
if "%MODE_CHOICE%"=="7" set "MODE=BackupVideo"
goto MAIN_MENU

:SET_SPEED
cls
echo =====================================================
echo                 CHOOSE SPEED MODE
echo =====================================================
echo Current Speed: %SPEED%
echo.
echo [1] Fast (No delays - Max Speed)
echo [2] Medium (10-20s delay - Balanced/Safe)
echo [3] Slow (25-55s delay - Extremely Safe)
echo.
echo [0] BACK to Main Menu
echo.
set /p SPEED_CHOICE="Enter a number (0-3): "
if "%SPEED_CHOICE%"=="1" set "SPEED=Fast"
if "%SPEED_CHOICE%"=="2" set "SPEED=Medium"
if "%SPEED_CHOICE%"=="3" set "SPEED=Slow"
goto MAIN_MENU

:START_PROCESS
cls
:: --- SMART COOKIE RESOLUTION LOGIC ---
set "ACTIVE_COOKIE="
if "%COOKIE_MODE%"=="Manual" set "ACTIVE_COOKIE=%MANUAL_COOKIE%"
if "%COOKIE_MODE%"=="Auto" (
    set "ACTIVE_COOKIE=%COOKIES_DIR%\default.txt"
    echo "%TARGET_URL%" | findstr /i "youtube.com youtu.be" >nul && set "ACTIVE_COOKIE=%COOKIES_DIR%\youtube.txt"
    echo "%TARGET_URL%" | findstr /i "instagram.com" >nul && set "ACTIVE_COOKIE=%COOKIES_DIR%\instagram.txt"
    echo "%TARGET_URL%" | findstr /i "facebook.com fb.watch" >nul && set "ACTIVE_COOKIE=%COOKIES_DIR%\facebook.txt"
    echo "%TARGET_URL%" | findstr /i "tiktok.com" >nul && set "ACTIVE_COOKIE=%COOKIES_DIR%\tiktok.txt"
    echo "%TARGET_URL%" | findstr /i "twitter.com x.com" >nul && set "ACTIVE_COOKIE=%COOKIES_DIR%\twitter.txt"
    echo "%TARGET_URL%" | findstr /i "vimeo.com" >nul && set "ACTIVE_COOKIE=%COOKIES_DIR%\vimeo.txt"
    echo "%TARGET_URL%" | findstr /i "twitch.tv" >nul && set "ACTIVE_COOKIE=%COOKIES_DIR%\twitch.txt"
    echo "%TARGET_URL%" | findstr /i "soundcloud.com" >nul && set "ACTIVE_COOKIE=%COOKIES_DIR%\soundcloud.txt"
    echo "%TARGET_URL%" | findstr /i "onlyfans.com" >nul && set "ACTIVE_COOKIE=%COOKIES_DIR%\onlyfans.txt"
)

:: Validate if the chosen cookie file exists or if Browser mode is used
set "COOKIE_CMD="
set "COOKIE_DISPLAY=Disabled (None)"

if "%COOKIE_MODE%"=="Browser" (
    set "COOKIE_CMD=--cookies-from-browser %MANUAL_COOKIE%"
    set "COOKIE_DISPLAY=Browser Auto-Extract (%MANUAL_COOKIE%)"
) else if not "%COOKIE_MODE%"=="None" (
    if exist "%ACTIVE_COOKIE%" (
        set "COOKIE_CMD=--cookies "%ACTIVE_COOKIE%""
        set "COOKIE_DISPLAY=Text File (%ACTIVE_COOKIE%)"
    ) else (
        set "COOKIE_DISPLAY=Not Found - Downloading Without Cookies (%ACTIVE_COOKIE%)"
    )
)

echo =====================================================
echo                 FINAL CONFIRMATION
echo =====================================================
echo Please review your choices before starting:
echo.
echo  Target URL   : %TARGET_URL%
echo  Action Mode  : %MODE%
echo  Download Spd : %SPEED%
echo  Active Cookie: %COOKIE_DISPLAY%
echo.
if /i "%MODE%"=="Audio" echo  Saving to    : %AUDIO_FOLDER%
if /i "%MODE%"=="Video" echo  Saving to    : %VIDEO_FOLDER%
if /i "%MODE%"=="4K" echo  Saving to    : %VIDEO_FOLDER%
if /i "%MODE%"=="ListAudio" echo  Saving to    : %AUDIO_FOLDER%
if /i "%MODE%"=="ListVideo" echo  Saving to    : %VIDEO_FOLDER%
if /i "%MODE%"=="BackupAudio" echo  Saving to    : %AUDIO_FOLDER%
if /i "%MODE%"=="BackupVideo" echo  Saving to    : %VIDEO_FOLDER%
echo.
echo =====================================================
echo Press ANY KEY to confirm and start, or close this window to cancel.
pause >nul

:: Create folders
if not exist "%AUDIO_FOLDER%" mkdir "%AUDIO_FOLDER%"
if not exist "%VIDEO_FOLDER%" mkdir "%VIDEO_FOLDER%"

:: Base command with dynamically injected cookies
set "BASE_CMD=yt-dlp %COOKIE_CMD% --ignore-errors --lazy-playlist"

:: Speed settings
if /i "%SPEED%"=="Fast" set "SPEED_CMD="
if /i "%SPEED%"=="Medium" set "SPEED_CMD=--sleep-interval 10 --max-sleep-interval 20"
if /i "%SPEED%"=="Slow" set "SPEED_CMD=--sleep-interval 25 --max-sleep-interval 55"

:: Logic Routing
if /i "%MODE%"=="Audio" goto MODE_AUDIO
if /i "%MODE%"=="Video" goto MODE_VIDEO
if /i "%MODE%"=="4K" goto MODE_4K
if /i "%MODE%"=="ListOnly" goto MODE_LIST_AUDIO
if /i "%MODE%"=="ListAudio" goto MODE_LIST_AUDIO
if /i "%MODE%"=="ListVideo" goto MODE_LIST_VIDEO
if /i "%MODE%"=="BackupJSON" goto MODE_BACKUP_AUDIO
if /i "%MODE%"=="BackupAudio" goto MODE_BACKUP_AUDIO
if /i "%MODE%"=="BackupVideo" goto MODE_BACKUP_VIDEO

:MODE_AUDIO
set "FULL_CMD=%BASE_CMD% -x --audio-format mp3 --audio-quality 0 -o "%AUDIO_FOLDER%\%%(title)s.%%(ext)s" --download-archive "%AUDIO_FOLDER%\duplicate_audio.txt" --embed-metadata --embed-thumbnail %SPEED_CMD%"
set "FAILED_LOG=%AUDIO_FOLDER%\failed_audio.txt"
set "DUPLICATE_LOG=%AUDIO_FOLDER%\duplicate_audio.txt"
goto RUN_DOWNLOAD

:MODE_VIDEO
set "FULL_CMD=%BASE_CMD% -o "%VIDEO_FOLDER%\%%(title)s.%%(ext)s" -f "bestvideo+bestaudio/best" --merge-output-format mp4 --download-archive "%VIDEO_FOLDER%\duplicate_video.txt" --embed-metadata --embed-thumbnail %SPEED_CMD%"
set "FAILED_LOG=%VIDEO_FOLDER%\failed_video.txt"
set "DUPLICATE_LOG=%VIDEO_FOLDER%\duplicate_video.txt"
goto RUN_DOWNLOAD

:MODE_4K
set "FULL_CMD=%BASE_CMD% -o "%VIDEO_FOLDER%\%%(title)s.%%(ext)s" -f "bestvideo[height<=2160]+bestaudio/best[height<=2160]" --merge-output-format mp4 --download-archive "%VIDEO_FOLDER%\duplicate_video.txt" --embed-metadata --embed-thumbnail %SPEED_CMD%"
set "FAILED_LOG=%VIDEO_FOLDER%\failed_video.txt"
set "DUPLICATE_LOG=%VIDEO_FOLDER%\duplicate_video.txt"
goto RUN_DOWNLOAD

:MODE_LIST_AUDIO
set "LIST_FILE=%AUDIO_FOLDER%\songs_list.txt"
set "LIST_DISPLAY_DIR=%AUDIO_FOLDER%"
goto RUN_LIST

:MODE_LIST_VIDEO
set "LIST_FILE=%VIDEO_FOLDER%\songs_list.txt"
set "LIST_DISPLAY_DIR=%VIDEO_FOLDER%"
goto RUN_LIST

:RUN_LIST
cls
echo.
echo =====================================================
echo              Creating Title List Only...
echo =====================================================
echo.
yt-dlp --skip-download --flat-playlist --print "%%(playlist_index)03d - %%(title)s" "%TARGET_URL%" > "%LIST_FILE%"
echo List successfully created!
echo File saved as: %LIST_FILE%
echo.
echo You can now open the file "songs_list.txt" in %LIST_DISPLAY_DIR%
pause
goto MAIN_MENU

:MODE_BACKUP_AUDIO
set "BACKUP_FILE=%AUDIO_FOLDER%\playlist_backup.json"
goto RUN_BACKUP

:MODE_BACKUP_VIDEO
set "BACKUP_FILE=%VIDEO_FOLDER%\playlist_backup.json"
goto RUN_BACKUP

:RUN_BACKUP
cls
echo.
echo =====================================================
echo      Creating FULL backup as JSON file...
echo =====================================================
echo.
yt-dlp --flat-playlist --dump-json "%TARGET_URL%" > "%BACKUP_FILE%"
echo.
echo Backup successfully created!
echo File saved as: %BACKUP_FILE%
pause
goto MAIN_MENU

:RUN_DOWNLOAD
cls
echo.
echo =====================================================
echo Starting %MODE% download in %SPEED% mode...
echo =====================================================
echo.
echo Duplicates will be tracked in: %DUPLICATE_LOG%
echo Failed items will be logged in: %FAILED_LOG%
echo.

:: Execute the command and send errors specifically to the failed log
%FULL_CMD% "%TARGET_URL%" 2>> "%FAILED_LOG%"

echo.
echo =====================================================
echo                 Download Finished!
echo =====================================================
echo.
echo [*] Check these files:
echo     - %DUPLICATE_LOG%   (Duplicate/Skipped items)
echo     - %FAILED_LOG%      (Private/Failed items)
echo.
pause
goto MAIN_MENU