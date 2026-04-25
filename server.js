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
  audioFolder: 'D:\\YT-Downloads\\Audio',
  videoFolder: 'D:\\YT-Downloads\\Video',
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
  defaultSpeed: 'Medium',
  ytdlpPath: 'yt-dlp',
  theme: 'dark',
  accentColor: '#7c3aed',
  port: 3131
};

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
function buildArgs(config, url, mode, speed) {
  const cookieArgs = resolveCookie(config, url);
  const speedArgs = {
    Fast: [],
    Medium: ['--sleep-interval', '10', '--max-sleep-interval', '20'],
    Slow: ['--sleep-interval', '25', '--max-sleep-interval', '55']
  }[speed] || [];

  const base = [...cookieArgs, '--ignore-errors', '--lazy-playlist'];

  // Ensure all directories exist
  [config.audioFolder, config.videoFolder, config.fourKFolder,
   config.listsFolder, config.backupsFolder, config.cookiesDir,
   config.logsFailedDir, config.logsDuplicatesDir].forEach(d => {
    if (d) fs.mkdirSync(d, { recursive: true });
  });

  switch (mode) {
    case 'Audio':
      return { args: [...base, '-x', '--audio-format', 'mp3', '--audio-quality', '0',
        '-o', path.join(config.audioFolder, '%(title)s.%(ext)s'),
        '--download-archive', path.join(config.logsDuplicatesDir, 'duplicate_audio.txt'),
        '--embed-metadata', '--embed-thumbnail', ...speedArgs, url],
        folder: config.audioFolder,
        failedLog: path.join(config.logsFailedDir, 'failed_audio.txt') };

    case 'Video':
      return { args: [...base, '-o', path.join(config.videoFolder, '%(title)s.%(ext)s'),
        '-f', 'bestvideo+bestaudio/best', '--merge-output-format', 'mp4',
        '--download-archive', path.join(config.logsDuplicatesDir, 'duplicate_video.txt'),
        '--embed-metadata', '--embed-thumbnail', ...speedArgs, url],
        folder: config.videoFolder,
        failedLog: path.join(config.logsFailedDir, 'failed_video.txt') };

    case '4K':
      return { args: [...base, '-o', path.join(config.fourKFolder, '%(title)s.%(ext)s'),
        '-f', 'bestvideo[height<=2160]+bestaudio/best[height<=2160]', '--merge-output-format', 'mp4',
        '--download-archive', path.join(config.logsDuplicatesDir, 'duplicate_4k.txt'),
        '--embed-metadata', '--embed-thumbnail', ...speedArgs, url],
        folder: config.fourKFolder,
        failedLog: path.join(config.logsFailedDir, 'failed_4k.txt') };

    case 'ListAudio':
    case 'ListVideo':
      return { args: ['--skip-download', '--flat-playlist', '--print', '%(playlist_index)03d - %(title)s', url],
        folder: config.listsFolder, listFile: path.join(config.listsFolder, `list_${Date.now()}.txt`) };

    case 'BackupAudio':
    case 'BackupVideo':
      return { args: ['--flat-playlist', '--dump-json', url],
        folder: config.backupsFolder, backupFile: path.join(config.backupsFolder, `backup_${Date.now()}.json`) };

    default:
      return null;
  }
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
        const { url, mode, speed, downloadId } = msg;
        const config = loadConfig();

        if (!url || !mode) {
          ws.send(JSON.stringify({ type: 'error', downloadId, text: 'URL and mode are required.' }));
          return;
        }

        const built = buildArgs(config, url, mode, speed || config.defaultSpeed);
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
