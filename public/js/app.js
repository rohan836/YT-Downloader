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
    case 'formatList':    el('formatListContent').textContent = msg.data || 'No formats found.'; break;
    case 'profiles':      renderProfileSelect(msg.data); break;
    case 'applyProfile':  applyProfileOverrides(msg.data); break;
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
  el('outputTemplate').value       = cfg.outputTemplate || 'clean';
  el('formatSort').value           = cfg.formatSort    || '';
  el('splitChapters').checked      = !!cfg.splitChapters;
  el('dateAfter').value            = cfg.dateAfter     || '';
  el('dateBefore').value           = cfg.dateBefore    || '';
  el('minDuration').value          = cfg.minDuration   || '';
  el('maxDuration').value          = cfg.maxDuration   || '';
  el('downloadSections').value     = cfg.downloadSections || '';
  updateSubtitleRow();

  // Request profiles
  send({ type: 'getProfiles' });

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
    outputTemplate:      el('outputTemplate').value,
    formatSort:          el('formatSort').value,
    splitChapters:       el('splitChapters').checked,
    dateAfter:           el('dateAfter').value.trim(),
    dateBefore:          el('dateBefore').value.trim(),
    minDuration:         el('minDuration').value.trim(),
    maxDuration:         el('maxDuration').value.trim(),
    downloadSections:    el('downloadSections').value.trim(),
  };
}

// ── Start / Cancel / Queue ─────────────────────────────────────────────────
let currentDownloadId = null;
let isRunning = false;
let downloadQueue = [];
let queueMode = false;

// Toggle queue textarea
el('toggleQueueBtn').addEventListener('click', () => {
  queueMode = !queueMode;
  el('queueInput').style.display = queueMode ? '' : 'none';
  el('toggleQueueBtn').textContent = queueMode ? '📋 Single URL' : '📋 Queue';
});

function startSingleDownload(url) {
  const speed = document.querySelector('input[name=speed]:checked')?.value || 'Medium';
  const cookieMode = document.querySelector('input[name=cookie]:checked')?.value || 'Auto';

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
}

el('startBtn').addEventListener('click', () => {
  if (isRunning) {
    if (currentDownloadId) send({ type: 'cancelDownload', downloadId: currentDownloadId });
    downloadQueue = [];
    return;
  }

  let urls = [];
  if (queueMode) {
    urls = el('queueInput').value.split('\n').map(u => u.trim()).filter(u => u && u.startsWith('http'));
  } else {
    const u = el('urlInput').value.trim();
    if (u) urls.push(u);
  }

  if (urls.length === 0) { showToast('Please paste a URL first!', 'warning'); return; }

  if (urls.length === 1) {
    startSingleDownload(urls[0]);
  } else {
    downloadQueue = urls.slice(1);
    showToast(`Queue: ${urls.length} URLs. Starting first…`, 'info');
    startSingleDownload(urls[0]);
  }
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
    notifyDesktop('Download complete! 🎉');
  } else if (status === 'cancelled') {
    statusEl.textContent = 'Cancelled';
    statusEl.className = 'pi-status cancelled';
    showToast('Download cancelled.', 'info');
  } else {
    statusEl.textContent = '✗ Error';
    statusEl.className = 'pi-status error';
    showToast('Download ended with errors. Check the log.', 'error');
  }

  // Process next in queue
  if (downloadQueue.length > 0) {
    const nextUrl = downloadQueue.shift();
    showToast(`Queue: ${downloadQueue.length + 1} remaining. Next…`, 'info');
    setTimeout(() => startSingleDownload(nextUrl), 1000);
  } else if (status === 'done') {
    notifyDesktop('All downloads complete! 🎉');
  }
}

function notifyDesktop(msg) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('YT-Downloader', { body: msg, icon: '⬇' });
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

// Request desktop notification permission
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

// ── Drag & Drop ──────────────────────────────────────────────────────────
{
  const sec = document.querySelector('.url-section');
  ['dragenter','dragover'].forEach(e => sec.addEventListener(e, (ev) => { ev.preventDefault(); sec.classList.add('drag-over'); }));
  ['dragleave','drop'].forEach(e => sec.addEventListener(e, () => sec.classList.remove('drag-over')));
  sec.addEventListener('drop', (ev) => {
    ev.preventDefault();
    const text = ev.dataTransfer.getData('text/plain') || '';
    if (text) {
      el('urlInput').value = text.trim();
      const p = detectPlatform(text.trim());
      el('urlPlatform').textContent = p ? p.icon : '🔗';
      showToast('URL dropped!', 'success');
    }
    const file = ev.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = () => {
        el('queueInput').value = reader.result;
        el('queueInput').style.display = '';
        queueMode = true;
        el('toggleQueueBtn').textContent = '📋 Single URL';
        showToast(`Loaded ${reader.result.split('\n').filter(l=>l.trim()).length} URLs from file`, 'success');
      };
      reader.readAsText(file);
    }
  });
}

// ── List Formats ──────────────────────────────────────────────────────────
el('listFormatsBtn').addEventListener('click', () => {
  const url = el('urlInput').value.trim();
  if (!url) { showToast('Paste a URL first', 'warning'); return; }
  el('formatListContent').textContent = 'Loading formats…';
  el('formatModalOverlay').style.display = '';
  send({ type: 'listFormats', url });
});
el('closeFormatModal').addEventListener('click', () => { el('formatModalOverlay').style.display = 'none'; });
el('formatModalOverlay').addEventListener('click', (e) => {
  if (e.target === el('formatModalOverlay')) el('formatModalOverlay').style.display = 'none';
});

// ── Config Profiles ──────────────────────────────────────────────────────
let profilesCache = {};

function renderProfileSelect(profiles) {
  profilesCache = profiles || {};
  const sel = el('profileSelect');
  sel.innerHTML = '<option value="">— Select profile —</option>';
  Object.keys(profilesCache).forEach(name => {
    sel.innerHTML += `<option value="${escHtml(name)}">${escHtml(name)}</option>`;
  });
}

el('saveProfileBtn').addEventListener('click', () => {
  const name = prompt('Profile name:');
  if (!name) return;
  send({ type: 'saveProfile', name, data: getAdvancedOverrides() });
});

el('loadProfileBtn').addEventListener('click', () => {
  const name = el('profileSelect').value;
  if (!name) { showToast('Select a profile first', 'warning'); return; }
  send({ type: 'loadProfile', name });
});

el('deleteProfileBtn').addEventListener('click', () => {
  const name = el('profileSelect').value;
  if (!name) return;
  send({ type: 'deleteProfile', name });
});

function applyProfileOverrides(data) {
  if (data.audioFormat) el('audioFormat').value = data.audioFormat;
  if (data.concurrentFragments) { el('concurrentFragments').value = data.concurrentFragments; el('concurrentFragmentsVal').textContent = data.concurrentFragments; }
  if (data.sponsorBlock !== undefined) el('sponsorBlock').checked = data.sponsorBlock;
  if (data.subtitles !== undefined) el('subtitles').checked = data.subtitles;
  if (data.subtitleLangs) el('subtitleLangs').value = data.subtitleLangs;
  if (data.embedSubs !== undefined) el('embedSubs').checked = data.embedSubs;
  if (data.embedChapters !== undefined) el('embedChapters').checked = data.embedChapters;
  if (data.writeThumbnail !== undefined) el('writeThumbnail').checked = data.writeThumbnail;
  if (data.restrictFilenames !== undefined) el('restrictFilenames').checked = data.restrictFilenames;
  if (data.playlistRange !== undefined) el('playlistRange').value = data.playlistRange;
  if (data.rateLimit !== undefined) el('rateLimit').value = data.rateLimit;
  if (data.proxy !== undefined) el('proxy').value = data.proxy;
  if (data.impersonate !== undefined) el('impersonate').value = data.impersonate;
  if (data.outputTemplate) el('outputTemplate').value = data.outputTemplate;
  if (data.formatSort !== undefined) el('formatSort').value = data.formatSort;
  if (data.splitChapters !== undefined) el('splitChapters').checked = data.splitChapters;
  if (data.dateAfter !== undefined) el('dateAfter').value = data.dateAfter;
  if (data.dateBefore !== undefined) el('dateBefore').value = data.dateBefore;
  if (data.minDuration !== undefined) el('minDuration').value = data.minDuration;
  if (data.maxDuration !== undefined) el('maxDuration').value = data.maxDuration;
  if (data.downloadSections !== undefined) el('downloadSections').value = data.downloadSections;
  updateSubtitleRow();
  showToast('Profile loaded!', 'success');
}
