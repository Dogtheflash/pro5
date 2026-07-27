/* ============================================================
   DISCORD LANYARD PRESENCE API MODULE
   ============================================================ */
'use strict';

import {
  DISCORD_USER_ID,
  DECORATIONS,
  statusLabels,
  profileTypingWords,
  activityTypes,
  staticDiscordBadges,
} from './config.js';

export let lanyardCache = null;

export const presenceEls = {
  avatar: null,
  decoration: null,
  displayName: null,
  username: null,
  orb: null,
  statusText: null,
  customStatusLine: null,
  activityCard: null,
  activityIcon: null,
  activityName: null,
  activityDetail: null,
  activityTime: null,
  spotifyStatus: null,
  publicFlags: null,
  typingName: null,
};

export function initPresenceElements() {
  presenceEls.avatar = document.getElementById('avatar-image');
  presenceEls.decoration = document.getElementById('avatar-decoration');
  presenceEls.displayName = document.getElementById('display-name');
  presenceEls.username = document.getElementById('username');
  presenceEls.orb = document.getElementById('status-orb');
  presenceEls.statusText = document.getElementById('status-text');
  presenceEls.customStatusLine = document.getElementById('custom-status-line');
  presenceEls.activityCard = document.getElementById('activity-card');
  presenceEls.activityIcon = document.getElementById('activity-icon');
  presenceEls.activityName = document.getElementById('activity-name');
  presenceEls.activityDetail = document.getElementById('activity-detail');
  presenceEls.activityTime = document.getElementById('activity-time');
  presenceEls.spotifyStatus = document.getElementById('spotify-status');
  presenceEls.publicFlags = document.getElementById('public-flags');
  presenceEls.typingName = document.getElementById('profile-typing-name');
}

export function setStatusClass(status) {
  if (!presenceEls.orb || !presenceEls.statusText) return 'offline';
  const normalized = ['online', 'idle', 'dnd', 'offline'].includes(status) ? status : 'offline';
  presenceEls.orb.className = `status-orb ${normalized}`;
  const dot = presenceEls.statusText.querySelector('.inline-dot');
  if (dot) dot.className = `inline-dot ${normalized}`;
  return normalized;
}

export function getAvatarUrl(user) {
  if (!user?.avatar) return '';
  const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=256`;
}

export function getDiscordDecorationUrls(user) {
  const asset = user?.avatar_decoration_data?.asset;
  if (!asset) return [];
  const normalized = asset.replace(/^avatar-decoration-presets\//, '');
  const ext = normalized.startsWith('a_') ? 'gif' : 'png';
  return [
    `https://cdn.discordapp.com/avatar-decoration-presets/${normalized}.${ext}?size=240&passthrough=true`,
    `https://cdn.discordapp.com/avatar-decoration-presets/${normalized}.png?size=240&passthrough=true`,
  ];
}

export function getEmojiText(emoji) {
  if (!emoji) return '';
  if (emoji.id) return `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`;
  return emoji.name || '';
}

export function getElapsedText(timestamps) {
  if (!timestamps?.start) return '';
  const elapsed = Math.max(0, Date.now() - timestamps.start);
  const minutes = Math.floor(elapsed / 60000);
  const hours = Math.floor(minutes / 60);
  if (hours) return `Đã chạy ${hours}h ${minutes % 60}m`;
  return `Đã chạy ${minutes}m`;
}

export function findCustomStatus(activities = []) {
  return activities.find((activity) => activity.type === 4);
}

export function findPrimaryActivity(activities = []) {
  return activities.find((activity) => activity.type !== 4);
}

export function describeActivity(activity, spotify) {
  if (spotify) {
    return {
      visible: true,
      icon: '♪',
      name: `Spotify · ${spotify.song || 'Đang nghe nhạc'}`,
      detail: [spotify.artist, spotify.album].filter(Boolean).join(' · ') || 'Đang phát qua Spotify.',
    };
  }

  if (!activity) return { visible: false, icon: '✦', name: '', detail: '', time: '' };
  const meta = activityTypes[activity.type] || { label: 'Hoạt động', icon: '✦' };
  return {
    visible: true,
    icon: meta.icon,
    name: `${meta.label} ${activity.name || ''}`.trim(),
    detail: [activity.details, activity.state].filter(Boolean).join(' · ') || 'Hoạt động đang chạy.',
    time: getElapsedText(activity.timestamps),
  };
}

export function getClientText(data) {
  return [
    data.active_on_discord_desktop && 'Desktop',
    data.active_on_discord_mobile && 'Mobile',
    data.active_on_discord_web && 'Web',
  ].filter(Boolean).join(' · ');
}

export function getCustomStatusText(activity) {
  if (!activity) return '';
  return [getEmojiText(activity.emoji), activity.state].filter(Boolean).join(' ').trim();
}

export function updateActivityCard(activity) {
  if (!presenceEls.activityCard) return;
  presenceEls.activityCard.classList.toggle('hidden', !activity.visible);
  if (!activity.visible) return;
  presenceEls.activityIcon.textContent = activity.icon;
  presenceEls.activityName.textContent = activity.name;
  presenceEls.activityDetail.textContent = activity.detail;
  presenceEls.activityTime.textContent = activity.time;
}

export function renderDiscordBadges() {
  if (!presenceEls.publicFlags) return;
  presenceEls.publicFlags.innerHTML = staticDiscordBadges.map((badge) => `
    <span class="discord-badge ${badge.nitro ? 'nitro' : ''}" data-tooltip="${badge.name}" aria-label="${badge.name}">
      <img src="${badge.icon}" alt="${badge.name}">
    </span>
  `).join('');
}

export function updateMetaFields(data) {
  if (!presenceEls.spotifyStatus) return;
  presenceEls.spotifyStatus.textContent = data.listening_to_spotify && data.spotify
    ? `${data.spotify.song || 'Spotify'} · ${data.spotify.artist || 'Unknown'}`
    : 'Chưa phát hiện';
  renderDiscordBadges();
}

export function setLocalDecoration() {
  if (!presenceEls.decoration) return;
  const randomImage = DECORATIONS[Math.floor(Math.random() * DECORATIONS.length)];
  presenceEls.decoration.src = `./data/decoration/${randomImage}`;
  presenceEls.decoration.dataset.source = 'local';
}

export function setDiscordDecoration(urls) {
  if (!presenceEls.decoration) return;
  if (!urls.length) {
    if (presenceEls.decoration.dataset.source !== 'local') setLocalDecoration();
    return;
  }

  let index = 0;
  presenceEls.decoration.dataset.source = 'discord';
  presenceEls.decoration.onerror = () => {
    index += 1;
    if (urls[index]) {
      presenceEls.decoration.src = urls[index];
    } else {
      presenceEls.decoration.onerror = null;
      setLocalDecoration();
    }
  };
  presenceEls.decoration.src = urls[index];
}

export function startProfileNameTyping() {
  const target = presenceEls.typingName;
  if (!target) return;

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const word = profileTypingWords[wordIndex];
    target.textContent = word.slice(0, charIndex);

    if (!deleting && charIndex < word.length) {
      charIndex += 1;
      setTimeout(tick, 100);
      return;
    }

    if (!deleting) {
      deleting = true;
      setTimeout(tick, wordIndex === 0 ? 3000 : 1150);
      return;
    }

    if (charIndex > 0) {
      charIndex -= 1;
      setTimeout(tick, 60);
      return;
    }

    deleting = false;
    wordIndex = (wordIndex + 1) % profileTypingWords.length;
    setTimeout(tick, 260);
  };

  tick();
}

export async function fetchDiscordPresence() {
  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`, { cache: 'no-store' });
    const payload = await response.json();
    if (!payload.success) throw new Error('Lanyard returned unsuccessful response');

    const data = payload.data;
    lanyardCache = data;

    const user = data.discord_user;
    const status = setStatusClass(data.discord_status);
    const statusLabel = statusLabels[status] || 'Đang offline';
    const clientText = getClientText(data);
    const customStatusText = getCustomStatusText(findCustomStatus(data.activities));
    const primaryActivity = describeActivity(findPrimaryActivity(data.activities), data.listening_to_spotify ? data.spotify : null);
    const avatarUrl = getAvatarUrl(user);
    const discordDecorationUrls = getDiscordDecorationUrls(user);

    profileTypingWords[0] = 'Chinatsu Kamado';
    if (presenceEls.username) {
      presenceEls.username.textContent = 'Chinatsu Kamado';
      presenceEls.username.setAttribute('data-text', 'Chinatsu Kamado');
    }
    if (presenceEls.customStatusLine) presenceEls.customStatusLine.textContent = customStatusText || '...';
    if (presenceEls.statusText) presenceEls.statusText.innerHTML = `<span class="inline-dot ${status}"></span>${statusLabel}${clientText ? ` - ${clientText}` : ''}`;
    if (avatarUrl && presenceEls.avatar) presenceEls.avatar.src = avatarUrl;

    setDiscordDecoration(discordDecorationUrls);

    updateActivityCard(primaryActivity);
    updateMetaFields(data);
  } catch (error) {
    console.warn('Unable to retrieve Discord presence:', error);
    const status = setStatusClass('offline');
    if (presenceEls.statusText) presenceEls.statusText.innerHTML = `<span class="inline-dot ${status}"></span>Chưa thể đồng bộ Discord`;
    if (presenceEls.customStatusLine) presenceEls.customStatusLine.textContent = 'Không rõ';
    if (presenceEls.spotifyStatus) presenceEls.spotifyStatus.textContent = 'Không rõ';
    if (presenceEls.publicFlags) presenceEls.publicFlags.innerHTML = '<span class="discord-badge empty">Không rõ</span>';
  }
}

export function rotateDecoration() {
  if (presenceEls.decoration && presenceEls.decoration.dataset.source === 'discord') return;
  setLocalDecoration();
}

export function initDiscordPresence() {
  initPresenceElements();
  startProfileNameTyping();
  fetchDiscordPresence();
  setInterval(fetchDiscordPresence, 6000);
  setInterval(rotateDecoration, 5000);
}
