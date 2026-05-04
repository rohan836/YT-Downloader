const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// ── Ensure yt-dlp & FFmpeg are in PATH ─────────────────────────────────────
const EXTRA_PATHS = [
  path.join(os.homedir(), 'AppData', 'Local', 'Microsoft', 'WinGet', 'Packages', 'yt-dlp.yt-dlp_Microsoft.Winget.Source_8wekyb3d8bbwe'),
  path.join(os.homedir(), 'AppData', 'Local', 'Microsoft', 'WinGet', 'Links'),
  'C:\\Program Files\\nodejs',
];
// Dynamically find FFmpeg folder (version may change)
const ffmpegBase = path.join(os.homedir(), 'AppData', 'Local', 'Microsoft', 'WinGet', 'Packages');
try {
  const ffPkg = fs.readdirSync(ffmpegBase).find(d => d.startsWith('yt-dlp.FFmpeg'));
  if (ffPkg) {
    const ffDir = path.join(ffmpegBase, ffPkg);
    const sub = fs.readdirSync(ffDir).find(d => d.startsWith('ffmpeg'));
    if (sub) EXTRA_PATHS.push(path.join(ffDir, sub, 'bin'));
  }
} catch (e) {}

process.env.PATH = EXTRA_PATHS.join(';') + ';' + (process.env.PATH || '');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const CONFIG_FILE = path.join(__dirname, 'config.json');
const HISTORY_FILE = path.join(__dirname, 'history.json');

// ── Default Config ─────────────────────────────────────────────────────────
const DEFAULT_CONFIG = {
  audioFolder: 'D:\\YT-Downloads\\New Audio',
  videoFolder: 'D:\\YT-Downloads\\New Video',
  fourKFolder: 'D:\\YT-Downloads\\4K',
  listsFolder: 'D:\\YT-Downloads\\Lists',
  backupsFolder: 'D:\\YT-Downloads\\Backups',
  cookiesDir: 'D:\\YT-Downloads\\Cookies',
  logsFailedDir: 'D:\\YT-Downloads\\Logs\\Failed',
  logsDuplicatesDir: 'D:\\YT-Downloads\\Logs\\Duplicates',
  cookieMode: 'Auto',
  manualCookie: '',
  browserName: 'chrome',
  defaultMode: 'Audio',
  defaultSpeed: 'Fast',
  ytdlpPath: 'yt-dlp',
  theme: 'dark',
  accentColor: '#7c3aed',
  port: 3131,
  // ── Advanced Features ──
  audioFormat: 'mp3',
  concurrentFragments: 4,
  sponsorBlock: false,
  subtitles: false,
  subtitleLangs: 'en',
  embedSubs: false,
  embedChapters: true,
  writeThumbnail: false,
  restrictFilenames: false,
  trimFilenames: 200,
  proxy: '',
  impersonate: '',
  rateLimit: '',
  playlistRange: '',
  // ── New Features ──
  outputTemplate: 'clean',
  formatSort: '',
  splitChapters: false,
  dateAfter: '',
  dateBefore: '',
  minDuration: '',
  maxDuration: '',
  downloadSections: '',
};

const PROFILES_FILE = path.join(__dirname, 'profiles.json');
function loadProfiles() {
  try { if (fs.existsSync(PROFILES_FILE)) return JSON.parse(fs.readFileSync(PROFILES_FILE, 'utf8')); } catch {}
  return {};
}
function saveProfiles(p) { fs.writeFileSync(PROFILES_FILE, JSON.stringify(p, null, 2)); }

// ── Config Helpers ─────────────────────────────────────────────────────────
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')) };
    }
  } catch (e) {}
  return { ...DEFAULT_CONFIG };
}

function saveConfig(cfg) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2));
}

// ── History Helpers ────────────────────────────────────────────────────────
function loadHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  } catch (e) {}
  return [];
}

function addHistory(entry) {
  const hist = loadHistory();
  hist.unshift({ ...entry, id: Date.now(), timestamp: new Date().toISOString() });
  const trimmed = hist.slice(0, 500);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(trimmed, null, 2));
  return trimmed;
}

// ── Cookie Resolution ──────────────────────────────────────────────────────
function resolveCookie(config, url) {
  const { cookieMode, cookiesDir, manualCookie, browserName } = config;
  if (cookieMode === 'None') return [];
  if (cookieMode === 'Browser') return ['--cookies-from-browser', browserName];
  if (cookieMode === 'Manual') {
    const p = manualCookie.includes('\\') ? manualCookie : path.join(cookiesDir, manualCookie);
    if (fs.existsSync(p)) return ['--cookies', p];
    return [];
  }
  // Auto
  const map = {
    'youtube.com': 'youtube.txt', 'youtu.be': 'youtube.txt',
    'instagram.com': 'instagram.txt', 'facebook.com': 'facebook.txt',
    'fb.watch': 'facebook.txt', 'tiktok.com': 'tiktok.txt',
    'twitter.com': 'twitter.txt', 'x.com': 'twitter.txt',
    'vimeo.com': 'vimeo.txt', 'twitch.tv': 'twitch.txt',
    'soundcloud.com': 'soundcloud.txt', 'onlyfans.com': 'onlyfans.txt'
  };
  for (const [domain, file] of Object.entries(map)) {
    if (url.includes(domain)) {
      const p = path.join(cookiesDir, file);
      if (fs.existsSync(p)) return ['--cookies', p];
    }
  }
  const def = path.join(cookiesDir, 'default.txt');
  if (fs.existsSync(def)) return ['--cookies', def];
  return [];
}

// ── Build yt-dlp Args ──────────────────────────────────────────────────────
function buildArgs(config, url, mode, speed, overrides = {}) {
  const cookieArgs = resolveCookie(config, url);
  const speedArgs = {
    Fast: [],
    Medium: ['--sleep-interval', '10', '--max-sleep-interval', '20'],
    Slow: ['--sleep-interval', '25', '--max-sleep-interval', '55']
  }[speed] || [];

  const base = [...cookieArgs, '--ignore-errors', '--lazy-playlist', '--convert-thumbnails', 'jpg'];

  // ── Advanced flags ──
  const adv = [];
  const cfg = { ...config, ...overrides };

  // Concurrent fragments
  const frags = parseInt(cfg.concurrentFragments) || 1;
  if (frags > 1) adv.push('-N', String(frags));

  // SponsorBlock
  if (cfg.sponsorBlock) adv.push('--sponsorblock-remove', 'default');

  // Subtitles
  if (cfg.subtitles) {
    adv.push('--write-subs', '--sub-langs', cfg.subtitleLangs || 'en');
    if (cfg.embedSubs) adv.push('--embed-subs');
  }

  // Chapters
  if (cfg.embedChapters) adv.push('--embed-chapters');

  // Thumbnail to disk
  if (cfg.writeThumbnail) adv.push('--write-thumbnail');

  // Filename safety
  if (cfg.restrictFilenames) adv.push('--restrict-filenames');
  const trim = parseInt(cfg.trimFilenames);
  if (trim && trim > 0) adv.push('--trim-filenames', String(trim));

  // Proxy
  if (cfg.proxy) adv.push('--proxy', cfg.proxy);

  // Browser impersonation
  if (cfg.impersonate) adv.push('--impersonate', cfg.impersonate);

  // Rate limit
  if (cfg.rateLimit) adv.push('--limit-rate', cfg.rateLimit);

  // Playlist range
  if (cfg.playlistRange) adv.push('-I', cfg.playlistRange);

  // Format sorting
  if (cfg.formatSort) adv.push('-S', cfg.formatSort);

  // Split chapters
  if (cfg.splitChapters) adv.push('--split-chapters');

  // Date filters
  if (cfg.dateAfter) adv.push('--dateafter', cfg.dateAfter);
  if (cfg.dateBefore) adv.push('--datebefore', cfg.dateBefore);

  // Duration filters
  const minDur = parseInt(cfg.minDuration);
  const maxDur = parseInt(cfg.maxDuration);
  if (minDur > 0) adv.push('--match-filters', `duration>=${minDur}`);
  if (maxDur > 0) adv.push('--match-filters', `duration<=${maxDur}`);

  // Download sections (clip)
  if (cfg.downloadSections) {
    adv.push('--download-sections', cfg.downloadSections);
    adv.push('--force-keyframes-at-cuts');
    adv.push('--postprocessor-args', 'ffmpeg:-c:a aac -b:a 192k');
  }

  const audioFmt = cfg.audioFormat || 'mp3';

  // Output template
  const tpl = {
    clean: '%(title)s.%(ext)s',
    withUploader: '%(uploader)s - %(title)s.%(ext)s',
    withDate: '%(upload_date>%Y-%m-%d)s - %(title)s.%(ext)s',
    numbered: '%(playlist_index)03d - %(title)s.%(ext)s',
  }[cfg.outputTemplate] || cfg.outputTemplate || '%(title)s.%(ext)s';

  let result = null;

  switch (mode) {
    case 'Audio':
      result = { args: [...base, ...adv, '-x', '--audio-format', audioFmt, '--audio-quality', '0',
        '-o', path.join(config.audioFolder, tpl),
        '--download-archive', path.join(config.logsDuplicatesDir, 'duplicate_audio.txt'),
        '--embed-metadata', '--embed-thumbnail', ...speedArgs, url],
        folder: config.audioFolder,
        failedLog: path.join(config.logsFailedDir, 'failed_audio.txt') };
      break;

    case 'Video':
      result = { args: [...base, ...adv, '-o', path.join(config.videoFolder, tpl),
        '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best', '--merge-output-format', 'mp4',
        '--download-archive', path.join(config.logsDuplicatesDir, 'duplicate_video.txt'),
        '--embed-metadata', '--embed-thumbnail', ...speedArgs, url],
        folder: config.videoFolder,
        failedLog: path.join(config.logsFailedDir, 'failed_video.txt') };
      break;

    case '4K':
      result = { args: [...base, ...adv, '-o', path.join(config.fourKFolder, tpl),
        '-f', 'bestvideo[height<=2160][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=2160]+bestaudio/best[height<=2160]', '--merge-output-format', 'mp4',
        '--download-archive', path.join(config.logsDuplicatesDir, 'duplicate_4k.txt'),
        '--embed-metadata', '--embed-thumbnail', ...speedArgs, url],
        folder: config.fourKFolder,
        failedLog: path.join(config.logsFailedDir, 'failed_4k.txt') };
      break;

    case 'ListAudio':
    case 'ListVideo':
      result = { args: ['--skip-download', '--flat-playlist', '--print', '%(playlist_index)03d - %(title)s', url],
        folder: config.listsFolder, listFile: path.join(config.listsFolder, `list_${Date.now()}.txt`) };
      break;

    case 'BackupAudio':
    case 'BackupVideo':
      result = { args: ['--flat-playlist', '--dump-json', url],
        folder: config.backupsFolder, backupFile: path.join(config.backupsFolder, `backup_${Date.now()}.json`) };
      break;

    default:
      return null;
  }

  // Only create folders that are actually needed for this download
  if (result.folder) fs.mkdirSync(result.folder, { recursive: true });
  if (result.failedLog) fs.mkdirSync(path.dirname(result.failedLog), { recursive: true });
  if (result.args.includes('--download-archive')) {
    fs.mkdirSync(config.logsDuplicatesDir, { recursive: true });
  }

  return result;
}

// ── Active Downloads Map ───────────────────────────────────────────────────
const activeDownloads = new Map();

// ── WebSocket Handler ──────────────────────────────────────────────────────
wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'config', data: loadConfig() }));
  ws.send(JSON.stringify({ type: 'history', data: loadHistory() }));

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {
      case 'getConfig':
        ws.send(JSON.stringify({ type: 'config', data: loadConfig() }));
        break;

      case 'saveConfig': {
        const cfg = { ...loadConfig(), ...msg.data };
        saveConfig(cfg);
        ws.send(JSON.stringify({ type: 'config', data: cfg }));
        ws.send(JSON.stringify({ type: 'toast', level: 'success', text: 'Settings saved!' }));
        break;
      }

      case 'getHistory':
        ws.send(JSON.stringify({ type: 'history', data: loadHistory() }));
        break;

      case 'clearHistory':
        fs.writeFileSync(HISTORY_FILE, '[]');
        ws.send(JSON.stringify({ type: 'history', data: [] }));
        break;

      case 'startDownload': {
        const { url, mode, speed, downloadId, overrides } = msg;
        const config = loadConfig();

        if (!url || !mode) {
          ws.send(JSON.stringify({ type: 'error', downloadId, text: 'URL and mode are required.' }));
          return;
        }

        const built = buildArgs(config, url, mode, speed || config.defaultSpeed, overrides || {});
        if (!built) {
          ws.send(JSON.stringify({ type: 'error', downloadId, text: 'Unknown mode: ' + mode }));
          return;
        }

        const ytdlp = config.ytdlpPath || 'yt-dlp';
        let listData = '';
        let backupData = '';

        ws.send(JSON.stringify({ type: 'downloadStart', downloadId, url, mode }));

        const proc = spawn(ytdlp, built.args, { shell: false });
        activeDownloads.set(downloadId, proc);

        proc.stdout.on('data', (chunk) => {
          const lines = chunk.toString().split('\n');
          lines.forEach(line => {
            if (!line.trim()) return;

            // Capture list / backup data
            if (built.listFile) { listData += line + '\n'; return; }
            if (built.backupFile) { backupData += line + '\n'; return; }

            // Parse progress  [download]  72.3% of   4.56MiB at  1.23MiB/s ETA 00:02
            const progMatch = line.match(/\[download\]\s+([\d.]+)%\s+of\s+([\d.]+\w+)\s+at\s+([\d.]+\w+\/s)\s+ETA\s+(\S+)/);
            if (progMatch) {
              ws.send(JSON.stringify({ type: 'progress', downloadId,
                percent: parseFloat(progMatch[1]),
                size: progMatch[2], speed: progMatch[3], eta: progMatch[4] }));
              return;
            }
            // Already downloaded
            if (line.includes('has already been recorded')) {
              ws.send(JSON.stringify({ type: 'skipped', downloadId, text: line.trim() }));
              return;
            }
            // Track title
            const destMatch = line.match(/\[download\] Destination: (.+)/);
            if (destMatch) {
              ws.send(JSON.stringify({ type: 'currentFile', downloadId, file: path.basename(destMatch[1]) }));
              return;
            }
            ws.send(JSON.stringify({ type: 'log', downloadId, text: line }));
          });
        });

        proc.stderr.on('data', (chunk) => {
          const lines = chunk.toString().split('\n');
          lines.forEach(line => {
            if (line.trim()) {
              ws.send(JSON.stringify({ type: 'errLine', downloadId, text: line }));
              // Append to failed log file
              if (built.failedLog) {
                fs.appendFileSync(built.failedLog, `[${new Date().toISOString()}] ${line}\n`);
              }
            }
          });
        });

        proc.on('close', (code) => {
          activeDownloads.delete(downloadId);

          // Save list/backup files
          if (built.listFile && listData) {
            fs.mkdirSync(path.dirname(built.listFile), { recursive: true });
            fs.writeFileSync(built.listFile, listData);
            ws.send(JSON.stringify({ type: 'log', downloadId, text: `List saved: ${built.listFile}` }));
          }
          if (built.backupFile && backupData) {
            fs.mkdirSync(path.dirname(built.backupFile), { recursive: true });
            fs.writeFileSync(built.backupFile, backupData);
            ws.send(JSON.stringify({ type: 'log', downloadId, text: `Backup saved: ${built.backupFile}` }));
          }

          const status = code === 0 ? 'done' : 'error';
          ws.send(JSON.stringify({ type: 'downloadEnd', downloadId, code, status }));

          addHistory({ url, mode, speed: speed || config.defaultSpeed, status, folder: built.folder });
          ws.send(JSON.stringify({ type: 'history', data: loadHistory() }));
        });

        proc.on('error', (err) => {
          ws.send(JSON.stringify({ type: 'errLine', downloadId,
            text: `Failed to start yt-dlp: ${err.message}. Make sure yt-dlp is installed and in your PATH.` }));
        });
        break;
      }

      case 'cancelDownload': {
        const proc = activeDownloads.get(msg.downloadId);
        if (proc) {
          proc.kill();
          activeDownloads.delete(msg.downloadId);
          ws.send(JSON.stringify({ type: 'downloadEnd', downloadId: msg.downloadId, code: -1, status: 'cancelled' }));
        }
        break;
      }

      case 'updateYtdlp': {
        const config = loadConfig();
        const proc = spawn(config.ytdlpPath || 'yt-dlp', ['-U'], { shell: false });
        proc.stdout.on('data', d => ws.send(JSON.stringify({ type: 'toast', level: 'info', text: d.toString().trim() })));
        proc.stderr.on('data', d => ws.send(JSON.stringify({ type: 'toast', level: 'warning', text: d.toString().trim() })));
        proc.on('close', () => ws.send(JSON.stringify({ type: 'toast', level: 'success', text: 'yt-dlp update complete!' })));
        break;
      }

      case 'listFormats': {
        const config = loadConfig();
        const ytdlp = config.ytdlpPath || 'yt-dlp';
        const cookie = resolveCookie(config, msg.url);
        const proc = spawn(ytdlp, [...cookie, '-F', msg.url], { shell: false });
        let out = '';
        proc.stdout.on('data', d => { out += d.toString(); });
        proc.stderr.on('data', d => { out += d.toString(); });
        proc.on('close', () => ws.send(JSON.stringify({ type: 'formatList', url: msg.url, data: out })));
        break;
      }

      case 'saveProfile': {
        const profiles = loadProfiles();
        profiles[msg.name] = msg.data;
        saveProfiles(profiles);
        ws.send(JSON.stringify({ type: 'profiles', data: profiles }));
        ws.send(JSON.stringify({ type: 'toast', level: 'success', text: `Profile "${msg.name}" saved!` }));
        break;
      }

      case 'loadProfile': {
        const profiles = loadProfiles();
        const p = profiles[msg.name];
        if (p) ws.send(JSON.stringify({ type: 'applyProfile', data: p }));
        break;
      }

      case 'deleteProfile': {
        const profiles = loadProfiles();
        delete profiles[msg.name];
        saveProfiles(profiles);
        ws.send(JSON.stringify({ type: 'profiles', data: profiles }));
        ws.send(JSON.stringify({ type: 'toast', level: 'info', text: `Profile "${msg.name}" deleted` }));
        break;
      }

      case 'getProfiles': {
        ws.send(JSON.stringify({ type: 'profiles', data: loadProfiles() }));
        break;
      }
    }
  });
});

// ── Static Files ───────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/api/config', (_, res) => res.json(loadConfig()));
app.post('/api/config', (req, res) => { saveConfig({ ...loadConfig(), ...req.body }); res.json({ ok: true }); });
app.get('/api/history', (_, res) => res.json(loadHistory()));

// ── Start ──────────────────────────────────────────────────────────────────
const cfg = loadConfig();
const PORT = cfg.port || 3131;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n  ✅  YT-Downloader running at http://localhost:${PORT}\n`);

  // Auto-open browser
  const { exec } = require('child_process');
  exec(`start http://localhost:${PORT}`);
});
