/* ─────────────────────────────────────────────────────────────────────────
   YT-Downloader v2 — Main App JS
   ───────────────────────────────────────────────────────────────────────── */

// ── WebSocket ──────────────────────────────────────────────────────────────
let ws;
let wsReady = false;
let config = {};

function connectWS() {
  ws = new WebSocket(`ws://${location.host}`);
  ws.onopen = () => { wsReady = true; };
  ws.onclose = () => { wsReady = false; setTimeout(connectWS, 2000); };
  ws.onerror = () => ws.close();
  ws.onmessage = (e) => handleMsg(JSON.parse(e.data));
}

function send(obj) {
  if (wsReady && ws.readyState === 1) ws.send(JSON.stringify(obj));
}

// ── Message Handler ────────────────────────────────────────────────────────
function handleMsg(msg) {
  switch (msg.type) {
    case 'config':  applyConfig(msg.data); break;
    case 'history': renderHistory(msg.data); break;
    case 'toast':   showToast(msg.text, msg.level); break;
    case 'downloadStart': onDownloadStart(msg); break;
    case 'downloadEnd':   onDownloadEnd(msg);   break;
    case 'progress':      onProgress(msg);      break;
    case 'currentFile':   onCurrentFile(msg);   break;
    case 'log':           onLog(msg);            break;
    case 'errLine':       onErrLine(msg);        break;
    case 'skipped':       onSkipped(msg);        break;
  }
}

// ── Config ─────────────────────────────────────────────────────────────────
function applyConfig(cfg) {
  config = cfg;
  // Populate drawer fields
  el('cfgAudioFolder').value       = cfg.audioFolder       || '';
  el('cfgVideoFolder').value       = cfg.videoFolder       || '';
  el('cfgFourKFolder').value       = cfg.fourKFolder       || '';
  el('cfgListsFolder').value       = cfg.listsFolder       || '';
  el('cfgBackupsFolder').value     = cfg.backupsFolder     || '';
  el('cfgCookiesDir').value        = cfg.cookiesDir        || '';
  el('cfgLogsFailedDir').value     = cfg.logsFailedDir     || '';
  el('cfgLogsDuplicatesDir').value = cfg.logsDuplicatesDir || '';
  el('cfgYtdlpPath').value         = cfg.ytdlpPath         || 'yt-dlp';
  el('cfgPort').value              = cfg.port              || 3131;
  el('accentColorPicker').value    = cfg.accentColor       || '#7c3aed';
  el('accentColorHex').textContent = cfg.accentColor       || '#7c3aed';

  // Advanced options
  el('audioFormat').value          = cfg.audioFormat           || 'mp3';
  el('concurrentFragments').value  = cfg.concurrentFragments   || 4;
  el('concurrentFragmentsVal').textContent = cfg.concurrentFragments || 4;
  el('sponsorBlock').checked       = !!cfg.sponsorBlock;
  el('subtitles').checked          = !!cfg.subtitles;
  el('embedSubs').checked          = !!cfg.embedSubs;
  el('embedChapters').checked      = cfg.embedChapters !== false;
  el('writeThumbnail').checked     = !!cfg.writeThumbnail;
  el('restrictFilenames').checked  = !!cfg.restrictFilenames;
  el('subtitleLangs').value        = cfg.subtitleLangs || 'en';
  el('playlistRange').value        = cfg.playlistRange || '';
  el('rateLimit').value            = cfg.rateLimit     || '';
  el('proxy').value                = cfg.proxy         || '';
  el('impersonate').value          = cfg.impersonate   || '';
  updateSubtitleRow();

  // Speed
  const speedMap = { Fast: 'speedFast', Medium: 'speedMedium', Slow: 'speedSlow' };
  const sid = speedMap[cfg.defaultSpeed] || 'speedMedium';
  if (el(sid)) el(sid).checked = true;

  // Cookie mode
  const cMap = { Auto: 'cookieAuto', Browser: 'cookieBrowser', Manual: 'cookieManual', None: 'cookieNone' };
  const cid = cMap[cfg.cookieMode] || 'cookieAuto';
  if (el(cid)) { el(cid).checked = true; updateCookieSub(cfg.cookieMode); }

  if (cfg.browserName)   el('browserNameInput').value  = cfg.browserName;
  if (cfg.manualCookie)  el('manualCookieInput').value = cfg.manualCookie;

  // Theme
  applyTheme(cfg.theme || 'dark');
  const tDark = el('themeDark'), tLight = el('themeLight');
  if (tDark && tLight) { tDark.checked = cfg.theme !== 'light'; tLight.checked = cfg.theme === 'light'; }

  // Accent color
  applyAccent(cfg.accentColor || '#7c3aed');
}

function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  el('themeToggleBtn').textContent = t === 'dark' ? '☀️' : '🌙';
}

function applyAccent(hex) {
  document.documentElement.style.setProperty('--accent', hex);
  // Derive accent2 complementary (simple shift: swap to cyan if purple, else keep)
}

// ── Platform Detection ─────────────────────────────────────────────────────
const PLATFORMS = [
  { test: /youtube\.com|youtu\.be/i,   icon: '▶️',  label: 'YouTube'     },
  { test: /instagram\.com/i,           icon: '📸',  label: 'Instagram'   },
  { test: /tiktok\.com/i,              icon: '🎵',  label: 'TikTok'      },
  { test: /twitter\.com|x\.com/i,      icon: '🐦',  label: 'X / Twitter' },
  { test: /facebook\.com|fb\.watch/i,  icon: '👤',  label: 'Facebook'    },
  { test: /vimeo\.com/i,               icon: '🎞️', label: 'Vimeo'       },
  { test: /twitch\.tv/i,               icon: '🎮',  label: 'Twitch'      },
  { test: /soundcloud\.com/i,          icon: '🎧',  label: 'SoundCloud'  },
];

function detectPlatform(url) {
  for (const p of PLATFORMS) if (p.test.test(url)) return p;
  return null;
}

// ── URL Input ──────────────────────────────────────────────────────────────
el('urlInput').addEventListener('input', debounce(() => {
  const url = el('urlInput').value.trim();
  const p = url ? detectPlatform(url) : null;
  el('urlPlatform').textContent = p ? p.icon : '🔗';
  el('urlPlatform').title = p ? p.label : '';
}, 300));

el('urlClearBtn').addEventListener('click', () => {
  el('urlInput').value = '';
  el('urlPlatform').textContent = '🔗';
});

// ── Mode Chips ─────────────────────────────────────────────────────────────
let selectedMode = 'Audio';
document.querySelectorAll('.mode-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.mode-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    selectedMode = chip.dataset.mode;
  });
});

// ── Cookie Sub-options ─────────────────────────────────────────────────────
document.querySelectorAll('input[name=cookie]').forEach(r => {
  r.addEventListener('change', () => updateCookieSub(r.value));
});

function updateCookieSub(mode) {
  el('cookieSubAuto').style.display    = mode === 'Auto'    ? '' : 'none';
  el('cookieSubBrowser').style.display = mode === 'Browser' ? '' : 'none';
  el('cookieSubManual').style.display  = mode === 'Manual'  ? '' : 'none';
}

// ── Advanced Controls ────────────────────────────────────────────────────
el('concurrentFragments').addEventListener('input', (e) => {
  el('concurrentFragmentsVal').textContent = e.target.value;
});

el('subtitles').addEventListener('change', updateSubtitleRow);
function updateSubtitleRow() {
  el('subtitleLangsRow').style.display = el('subtitles').checked ? '' : 'none';
}

function getAdvancedOverrides() {
  return {
    audioFormat:         el('audioFormat').value,
    concurrentFragments: parseInt(el('concurrentFragments').value) || 4,
    sponsorBlock:        el('sponsorBlock').checked,
    subtitles:           el('subtitles').checked,
    subtitleLangs:       el('subtitleLangs').value || 'en',
    embedSubs:           el('embedSubs').checked,
    embedChapters:       el('embedChapters').checked,
    writeThumbnail:      el('writeThumbnail').checked,
    restrictFilenames:   el('restrictFilenames').checked,
    playlistRange:       el('playlistRange').value.trim(),
    rateLimit:           el('rateLimit').value.trim(),
    proxy:               el('proxy').value.trim(),
    impersonate:         el('impersonate').value,
  };
}

// ── Start / Cancel ─────────────────────────────────────────────────────────
let currentDownloadId = null;
let isRunning = false;

el('startBtn').addEventListener('click', () => {
  if (isRunning) {
    // Cancel
    if (currentDownloadId) send({ type: 'cancelDownload', downloadId: currentDownloadId });
    return;
  }

  const url = el('urlInput').value.trim();
  if (!url) { showToast('Please paste a URL first!', 'warning'); return; }

  const speed = document.querySelector('input[name=speed]:checked')?.value || 'Medium';
  const cookieMode = document.querySelector('input[name=cookie]:checked')?.value || 'Auto';

  // If cookie mode changed from config, save inline
  if (cookieMode !== config.cookieMode ||
      el('browserNameInput').value !== config.browserName ||
      el('manualCookieInput').value !== config.manualCookie) {
    send({ type: 'saveConfig', data: {
      cookieMode,
      browserName: el('browserNameInput').value,
      manualCookie: el('manualCookieInput').value
    }});
  }

  currentDownloadId = 'dl_' + Date.now();
  isRunning = true;
  el('startBtn').textContent = '⏹ Cancel Download';
  el('startBtn').classList.add('running');
  el('progressSection').style.display = '';

  send({ type: 'startDownload', url, mode: selectedMode, speed, downloadId: currentDownloadId, overrides: getAdvancedOverrides() });
});

// ── Progress Items ─────────────────────────────────────────────────────────
const progressItems = {};

function onDownloadStart({ downloadId, url, mode }) {
  const div = document.createElement('div');
  div.className = 'progress-item';
  div.id = 'pi_' + downloadId;
  div.innerHTML = `
    <div class="pi-header">
      <span class="pi-title">${escHtml(url)}</span>
      <span class="pi-status running" id="pis_${downloadId}">Starting…</span>
    </div>
    <div class="pi-bar-wrap"><div class="pi-bar" id="pib_${downloadId}" style="width:0%"></div></div>
    <div class="pi-meta">
      <span id="pip_${downloadId}">0%</span>
      <span id="pispd_${downloadId}"></span>
      <span id="pieta_${downloadId}"></span>
      <span id="pif_${downloadId}" style="color:var(--text2);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></span>
    </div>
    <div class="pi-log" id="pil_${downloadId}"></div>
  `;
  el('progressList').prepend(div);
  progressItems[downloadId] = { errors: 0 };
}

function onProgress({ downloadId, percent, size, speed, eta }) {
  if (!el('pib_' + downloadId)) return;
  el('pib_' + downloadId).style.width = percent + '%';
  el('pip_' + downloadId).textContent = percent.toFixed(1) + '%';
  el('pispd_' + downloadId).textContent = speed;
  el('pieta_' + downloadId).textContent = 'ETA ' + eta;
  el('pis_' + downloadId).textContent = 'Downloading';
}

function onCurrentFile({ downloadId, file }) {
  if (el('pif_' + downloadId)) el('pif_' + downloadId).textContent = file;
  if (el('pis_' + downloadId)) el('pis_' + downloadId).textContent = 'Downloading';
}

function onLog({ downloadId, text }) {
  appendLog(downloadId, text, '');
}

function onErrLine({ downloadId, text }) {
  appendLog(downloadId, text, 'color:var(--error)');
  if (progressItems[downloadId]) progressItems[downloadId].errors++;
}

function onSkipped({ downloadId, text }) {
  appendLog(downloadId, '⏭ ' + text, 'color:var(--warning)');
}

function appendLog(downloadId, text, style) {
  const log = el('pil_' + downloadId);
  if (!log) return;
  const p = document.createElement('p');
  if (style) p.style.cssText = style;
  p.textContent = text;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
}

function onDownloadEnd({ downloadId, code, status }) {
  isRunning = false;
  currentDownloadId = null;
  el('startBtn').textContent = '⬇ Start Download';
  el('startBtn').classList.remove('running');

  const statusEl = el('pis_' + downloadId);
  const barEl    = el('pib_' + downloadId);
  if (!statusEl) return;

  if (status === 'done') {
    statusEl.textContent = '✓ Done';
    statusEl.className = 'pi-status done';
    if (barEl) barEl.style.width = '100%';
    showToast('Download complete! 🎉', 'success');
  } else if (status === 'cancelled') {
    statusEl.textContent = 'Cancelled';
    statusEl.className = 'pi-status cancelled';
    showToast('Download cancelled.', 'info');
  } else {
    statusEl.textContent = '✗ Error';
    statusEl.className = 'pi-status error';
    showToast('Download ended with errors. Check the log.', 'error');
  }
}

// ── History ────────────────────────────────────────────────────────────────
const MODE_ICONS = { Audio:'🎵', Video:'🎬', '4K':'🎥', ListAudio:'📋', ListVideo:'📝', BackupAudio:'💾', BackupVideo:'💾' };

function renderHistory(data) {
  const list = el('historyList');
  const query = el('histSearch').value.toLowerCase();
  const filtered = query ? data.filter(h => h.url.toLowerCase().includes(query) || (h.mode||'').toLowerCase().includes(query)) : data;

  if (!filtered.length) {
    list.innerHTML = '<p class="empty-hist">No downloads yet</p>';
    return;
  }
  list.innerHTML = filtered.slice(0, 100).map(h => `
    <div class="hist-item">
      <span class="hist-icon">${MODE_ICONS[h.mode] || '⬇'}</span>
      <div class="hist-info">
        <div class="hist-url" title="${escHtml(h.url)}">${escHtml(h.url)}</div>
        <div class="hist-meta">${h.mode || ''} · ${h.speed || ''} · ${formatDate(h.timestamp)}</div>
      </div>
      <span class="hist-status ${h.status}">${h.status}</span>
    </div>
  `).join('');
}

el('histSearch').addEventListener('input', debounce(() => {
  const hist = JSON.parse(localStorage.getItem('hist_cache') || '[]');
  renderHistory(hist);
}, 200));

// Cache history locally for search
const _origRenderHistory = renderHistory;
window.renderHistory = (data) => {
  localStorage.setItem('hist_cache', JSON.stringify(data));
  _origRenderHistory(data);
};

el('clearHistBtn').addEventListener('click', () => {
  if (confirm('Clear all download history?')) send({ type: 'clearHistory' });
});

// ── Settings Drawer ────────────────────────────────────────────────────────
el('openSettingsBtn').addEventListener('click', openDrawer);
el('drawerOverlay').addEventListener('click', closeDrawer);
el('closeDrawerBtn').addEventListener('click', closeDrawer);

function openDrawer()  { el('settingsDrawer').classList.add('open'); el('drawerOverlay').classList.add('open'); }
function closeDrawer() { el('settingsDrawer').classList.remove('open'); el('drawerOverlay').classList.remove('open'); }

el('saveSettingsBtn').addEventListener('click', () => {
  const theme = el('themeDark').checked ? 'dark' : 'light';
  const accent = el('accentColorPicker').value;
  const data = {
    audioFolder:       el('cfgAudioFolder').value.trim(),
    videoFolder:       el('cfgVideoFolder').value.trim(),
    fourKFolder:       el('cfgFourKFolder').value.trim(),
    listsFolder:       el('cfgListsFolder').value.trim(),
    backupsFolder:     el('cfgBackupsFolder').value.trim(),
    cookiesDir:        el('cfgCookiesDir').value.trim(),
    logsFailedDir:     el('cfgLogsFailedDir').value.trim(),
    logsDuplicatesDir: el('cfgLogsDuplicatesDir').value.trim(),
    ytdlpPath:         el('cfgYtdlpPath').value.trim() || 'yt-dlp',
    port:              parseInt(el('cfgPort').value) || 3131,
    theme, accentColor: accent
  };
  send({ type: 'saveConfig', data });
  applyTheme(theme);
  applyAccent(accent);
  closeDrawer();
});

el('updateYtdlpBtn').addEventListener('click', () => {
  send({ type: 'updateYtdlp' });
  showToast('Updating yt-dlp…', 'info');
});

el('accentColorPicker').addEventListener('input', (e) => {
  el('accentColorHex').textContent = e.target.value;
  applyAccent(e.target.value);
});

el('resetAccent').addEventListener('click', () => {
  el('accentColorPicker').value = '#7c3aed';
  el('accentColorHex').textContent = '#7c3aed';
  applyAccent('#7c3aed');
});

el('themeToggleBtn').addEventListener('click', () => {
  const current = document.documentElement.dataset.theme;
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  send({ type: 'saveConfig', data: { theme: next } });
});

// Radio theme sync
document.querySelectorAll('input[name=theme]').forEach(r => {
  r.addEventListener('change', () => applyTheme(r.value));
});

// ── Toasts ─────────────────────────────────────────────────────────────────
function showToast(text, level = 'info') {
  const t = document.createElement('div');
  t.className = `toast ${level}`;
  const icons = { success:'✅', error:'❌', warning:'⚠️', info:'ℹ️' };
  t.innerHTML = `<span>${icons[level] || 'ℹ️'}</span><span>${escHtml(text)}</span>`;
  el('toastContainer').appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

// ── Helpers ────────────────────────────────────────────────────────────────
function el(id) { return document.getElementById(id); }
function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
function formatDate(iso) {
  if (!iso) return '';
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

// ── Init ───────────────────────────────────────────────────────────────────
connectWS();
