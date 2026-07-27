/* ============================================================
   MINECRAFT SERVER PAGE MODULE
   ============================================================ */
'use strict';

export const minecraftPage = {
  page: null,
  back: null,
  open: null,
  ping: null,
  version: null,
  online: null,
  max: null,
  ip: null,
  statusText: null,
  updated: null,
  joinBtn: null,
};

export const MC_CONFIG = {
  ip: 'Sv.Minevui.Net',
  port: 25565,
  discordInvite: 'https://discord.gg/',
  botName: 'Minecraft Skyblock',
  botDesc: '🌿 Server Minecraft sinh tồn · Vanilla SMP',
  version: '1.21.x',
};

export function formatMcTime() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value || '';
  return `Cập nhật ${get('hour')}:${get('minute')}:${get('second')}`;
}

export async function fetchMinecraftStatus() {
  if (!minecraftPage.page) return;
  const ip = MC_CONFIG.ip;
  const port = MC_CONFIG.port;
  const apiUrl = `https://api.mcsrvstat.us/3/${ip}${port !== 25565 ? ':' + port : ''}`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (data.online) {
      if (minecraftPage.ping) minecraftPage.ping.textContent = '20ms';
      if (minecraftPage.online) minecraftPage.online.textContent = '0 người';
      if (minecraftPage.max) minecraftPage.max.textContent = '1000 người';
      if (minecraftPage.version) minecraftPage.version.textContent = data.version || MC_CONFIG.version;
      if (minecraftPage.statusText) {
        minecraftPage.statusText.textContent = '🟢 Online — Đang hoạt động';
        minecraftPage.statusText.style.color = 'var(--green)';
      }
    } else {
      if (minecraftPage.ping) minecraftPage.ping.textContent = '20ms';
      if (minecraftPage.online) minecraftPage.online.textContent = '0 người';
      if (minecraftPage.max) minecraftPage.max.textContent = '1000 người';
      if (minecraftPage.version) minecraftPage.version.textContent = MC_CONFIG.version;
      if (minecraftPage.statusText) {
        minecraftPage.statusText.textContent = '🔴 Offline — Server đang tắt';
        minecraftPage.statusText.style.color = 'var(--red)';
      }
    }
  } catch {
    if (minecraftPage.ping) minecraftPage.ping.textContent = '20ms';
    if (minecraftPage.online) minecraftPage.online.textContent = '0 người';
    if (minecraftPage.max) minecraftPage.max.textContent = '1000 người';
    if (minecraftPage.statusText) {
      minecraftPage.statusText.textContent = '⚠️ Không thể kiểm tra';
      minecraftPage.statusText.style.color = 'var(--yellow)';
    }
  }

  if (minecraftPage.ip) minecraftPage.ip.textContent = ip;
  if (minecraftPage.updated) minecraftPage.updated.textContent = formatMcTime();
  if (minecraftPage.joinBtn) minecraftPage.joinBtn.href = MC_CONFIG.discordInvite;

  const botNameEl = document.getElementById('mc-bot-name');
  if (botNameEl) botNameEl.textContent = MC_CONFIG.botName;
  const botDescEl = document.getElementById('mc-bot-desc');
  if (botDescEl) botDescEl.textContent = MC_CONFIG.botDesc;

  const ipCard = minecraftPage.ip?.closest('.mc-stat-card');
  if (ipCard && !ipCard.querySelector('.mc-copy-ip-btn')) {
    ipCard.style.display = 'flex';
    ipCard.style.flexDirection = 'column';
    ipCard.style.gap = '6px';

    if (minecraftPage.ip) {
      minecraftPage.ip.classList.add('mc-ip-rainbow');
    }

    const bottomRow = document.createElement('div');
    bottomRow.className = 'mc-ip-bottom-row';

    if (minecraftPage.ip) {
      bottomRow.appendChild(minecraftPage.ip);
    }

    const copyBtn = document.createElement('button');
    copyBtn.className = 'mc-copy-ip-btn';
    copyBtn.title = 'Copy địa chỉ server';
    copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(MC_CONFIG.ip).then(() => {
        copyBtn.innerHTML = `✓`;
        copyBtn.style.color = 'var(--green)';
        setTimeout(() => {
          copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;
          copyBtn.style.color = '';
        }, 1500);
      });
    });

    bottomRow.appendChild(copyBtn);
    ipCard.appendChild(bottomRow);
  }
}

export function injectCopyBtnStyle() {
  if (document.getElementById('mc-copy-style')) return;
  const style = document.createElement('style');
  style.id = 'mc-copy-style';
  style.textContent = `
    .mc-ip-bottom-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; width: 100%; }
    .mc-ip-rainbow { background: linear-gradient(90deg, #ff4fd8, #ff6b6b, #ffd93d, #6bcb77, #35e8ff, #5865f2, #ff4fd8); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent !important; animation: rainbowShift 3s linear infinite; font-weight: 800 !important; letter-spacing: .04em; }
    @keyframes rainbowShift { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
    .mc-copy-ip-btn { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: 1px solid rgba(53,232,255,.28); border-radius: 8px; background: rgba(53,232,255,.09); color: var(--cyan); cursor: pointer; transition: .2s ease; font-size: 13px; font-weight: 700; }
    .mc-copy-ip-btn:hover { background: rgba(53,232,255,.22); border-color: rgba(53,232,255,.55); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(53,232,255,.22); }
  `;
  document.head.appendChild(style);
}

export function initMinecraftModule(showInnerPage, hideInnerPage) {
  minecraftPage.page = document.getElementById('minecraft-page');
  minecraftPage.back = document.getElementById('minecraft-back');
  minecraftPage.open = document.getElementById('page-one-link');
  minecraftPage.ping = document.getElementById('mc-ping');
  minecraftPage.version = document.getElementById('mc-version');
  minecraftPage.online = document.getElementById('mc-online');
  minecraftPage.max = document.getElementById('mc-max');
  minecraftPage.ip = document.getElementById('mc-ip');
  minecraftPage.statusText = document.getElementById('mc-status-text');
  minecraftPage.updated = document.getElementById('mc-updated');
  minecraftPage.joinBtn = document.getElementById('mc-join-btn');

  injectCopyBtnStyle();

  if (minecraftPage.open) {
    minecraftPage.open.addEventListener('click', (e) => {
      e.preventDefault();
      showInnerPage(minecraftPage.page, () => { fetchMinecraftStatus(); }, false);
    });
  }
  if (minecraftPage.back) {
    minecraftPage.back.addEventListener('click', () => { hideInnerPage(minecraftPage.page); });
  }

  setInterval(() => {
    if (minecraftPage.page && !minecraftPage.page.classList.contains('hidden')) {
      fetchMinecraftStatus();
    }
  }, 30000);
}
