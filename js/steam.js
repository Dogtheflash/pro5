/* ============================================================
   STEAM PROFILE PAGE MODULE
   ============================================================ */
'use strict';

import { lanyardCache } from './discord.js';

export const STEAM_WORKER_URL = 'https://steam-proxy.bbtu223344.workers.dev/';

export const steamPage = {
  page: null,
  back: null,
  open: null,
  avatar: null,
  statusDot: null,
  statusLabel: null,
  displayName: null,
  realName: null,
  hours: null,
  games: null,
  level: null,
  friends: null,
  playing: null,
  updated: null,
  gameThumb: null,
};

export const STEAM_STATIC = {
  realName: '🎮 Chinatsu Kamado',
  level: '--',
  friends: '-- người',
};

export function formatSteamTime() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value || '';
  return `Cập nhật ${get('hour')}:${get('minute')}:${get('second')}`;
}

export async function fetchSteamData() {
  const res = await fetch(STEAM_WORKER_URL, { cache: 'no-store' });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

export function applySteamData(data) {
  if (steamPage.avatar && data.avatar) steamPage.avatar.src = data.avatar;
  if (steamPage.displayName) steamPage.displayName.textContent = data.displayName || 'nakarotad';
  if (steamPage.realName) steamPage.realName.textContent = STEAM_STATIC.realName;
  if (steamPage.level) steamPage.level.textContent = (data.level ?? null) !== null ? `${data.level}` : STEAM_STATIC.level;
  if (steamPage.friends) steamPage.friends.textContent = (data.friendsCount ?? null) !== null ? `${data.friendsCount} người` : STEAM_STATIC.friends;
  if (steamPage.games) steamPage.games.textContent = `${data.totalGames} game`;
  if (steamPage.hours) steamPage.hours.textContent = `${data.totalHours.toLocaleString()} giờ`;

  const isIngame = Boolean(data.currentGame);
  const isOnline = data.statusCode > 0;
  let dotClass = 'offline';
  let statusText = 'Offline';
  if (isIngame) { dotClass = 'ingame'; statusText = 'In-Game'; }
  else if (isOnline) { dotClass = 'online'; statusText = data.status || 'Online'; }

  if (steamPage.statusDot) steamPage.statusDot.className = `steam-status-dot ${dotClass}`;
  if (steamPage.statusLabel) steamPage.statusLabel.textContent = statusText;

  if (steamPage.playing) {
    if (isIngame) {
      steamPage.playing.innerHTML = `🎮 <strong style="color:#fff">${data.currentGame}</strong>`;
    } else {
      steamPage.playing.textContent = 'Không có game đang chạy';
    }
  }

  if (steamPage.gameThumb) {
    if (isIngame && data.currentGameThumb) {
      steamPage.gameThumb.src = data.currentGameThumb;
      steamPage.gameThumb.style.display = 'block';
    } else {
      steamPage.gameThumb.style.display = 'none';
    }
  }

  if (data.topGames?.length) {
    data.topGames.forEach((game, i) => {
      const card = document.getElementById(`steam-game-${i + 1}`);
      if (!card) return;
      const title = card.querySelector('.mc-feature-title');
      const desc = card.querySelector('.mc-feature-desc');
      if (title) title.textContent = game.name;
      if (desc) desc.textContent = `${game.hours.toLocaleString()} giờ chơi`;
    });
  }

  if (steamPage.updated) steamPage.updated.textContent = formatSteamTime();
}

export function applySteamLanyardFallback(data) {
  if (!steamPage.page) return;
  const activities = data.activities || [];
  const steamActivity = activities.find(a => a.type === 0 && a.id !== 'spotify:1' && a.application_id);
  if (!steamActivity) return;

  const gameName = steamActivity.name || 'Unknown Game';
  const gameDetail = steamActivity.details || '';
  const gameState = steamActivity.state || '';
  const elapsed = (function getElapsedText(timestamps) {
    if (!timestamps?.start) return '';
    const el = Math.max(0, Date.now() - timestamps.start);
    const m = Math.floor(el / 60000);
    const h = Math.floor(m / 60);
    return h ? `Đã chạy ${h}h ${m % 60}m` : `Đã chạy ${m}m`;
  })(steamActivity.timestamps);

  if (steamPage.statusDot) steamPage.statusDot.className = 'steam-status-dot ingame';
  if (steamPage.statusLabel) steamPage.statusLabel.textContent = 'In-Game';

  if (steamPage.playing) {
    steamPage.playing.innerHTML =
      `🎮 <strong style="color:#fff">${gameName}</strong>` +
      (gameDetail ? `<br><span style="font-size:11px;color:var(--muted)">${gameDetail}${gameState ? ' · ' + gameState : ''}</span>` : '') +
      (elapsed ? `<br><span style="font-size:11px;color:var(--cyan)">${elapsed}</span>` : '');
  }

  if (steamActivity?.assets?.large_image && steamPage.gameThumb) {
    const appId = steamActivity.application_id;
    steamPage.gameThumb.src = `https://cdn.discordapp.com/app-assets/${appId}/${steamActivity.assets.large_image}.png`;
    steamPage.gameThumb.style.display = 'block';
  }

  if (steamPage.updated) steamPage.updated.textContent = formatSteamTime();
}

export async function initSteamPage() {
  if (!steamPage.page) return;

  if (steamPage.statusLabel) steamPage.statusLabel.textContent = 'Đang tải...';
  if (steamPage.playing) steamPage.playing.textContent = 'Đang kết nối Steam...';
  if (steamPage.realName) steamPage.realName.textContent = STEAM_STATIC.realName;
  if (steamPage.level) steamPage.level.textContent = STEAM_STATIC.level;
  if (steamPage.friends) steamPage.friends.textContent = STEAM_STATIC.friends;

  try {
    const data = await fetchSteamData();
    applySteamData(data);

    if (lanyardCache) applySteamLanyardFallback(lanyardCache);
  } catch (err) {
    console.warn('Steam Worker fetch error:', err);

    if (steamPage.statusLabel) steamPage.statusLabel.textContent = 'Lỗi kết nối Steam API';
    if (steamPage.playing) steamPage.playing.textContent = 'Đang dùng dữ liệu Discord...';
    if (steamPage.updated) steamPage.updated.textContent = formatSteamTime();

    if (lanyardCache) applySteamLanyardFallback(lanyardCache);
  }
}

export function initSteamModule(showInnerPage, hideInnerPage) {
  steamPage.page = document.getElementById('steam-page');
  steamPage.back = document.getElementById('steam-back');
  steamPage.open = document.getElementById('page-two-link');
  steamPage.avatar = document.getElementById('steam-avatar');
  steamPage.statusDot = document.getElementById('steam-status-dot');
  steamPage.statusLabel = document.getElementById('steam-status-label');
  steamPage.displayName = document.getElementById('steam-display-name');
  steamPage.realName = document.getElementById('steam-real-name');
  steamPage.hours = document.getElementById('steam-hours');
  steamPage.games = document.getElementById('steam-games');
  steamPage.level = document.getElementById('steam-level');
  steamPage.friends = document.getElementById('steam-friends');
  steamPage.playing = document.getElementById('steam-playing');
  steamPage.updated = document.getElementById('steam-updated');
  steamPage.gameThumb = document.getElementById('steam-game-thumb');

  if (steamPage.open) {
    steamPage.open.addEventListener('click', (e) => {
      e.preventDefault();
      showInnerPage(steamPage.page, () => { initSteamPage(); }, true);
    });
  }

  if (steamPage.back) {
    steamPage.back.addEventListener('click', () => { hideInnerPage(steamPage.page); });
  }

  setInterval(() => {
    if (steamPage.page && !steamPage.page.classList.contains('hidden')) {
      fetchSteamData().then(data => {
        applySteamData(data);
        if (lanyardCache) applySteamLanyardFallback(lanyardCache);
      }).catch(() => {
        if (lanyardCache) applySteamLanyardFallback(lanyardCache);
      });
    }
  }, 30000);
}
