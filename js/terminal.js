/* ============================================================
   TERMINAL CMD WINDOW CONTROLLER
   ============================================================ */
'use strict';

import { playUISound } from './config.js';
import { startMusic } from './music-player.js';

export let terminalScreen;
export let profileScreen;
export let enterButton;
export let player;
export let cmdTabs;
export let cmdNewTab;
export let cmdLog;
export let cmdForm;
export let cmdInput;

export const introLines = [
  'C:\\Users\\Chinatsu Kamado> WaiFu',
  'Chinatsu Kamado.dev',
  '',
  'C:\\Users\\Chinatsu Kamado> profile --boot',
  '[OK] Đang tải giao diện cá nhân...',
  '[OK] Đang kết nối trạng thái Discord...',
  '[OK] Đang chuẩn bị trang trí ảnh đại diện...',
  '[OK] Đang chuẩn bị trang trí ảnh đại diện...',
  '',
  'Alias        : Chinatsu Kamado',
  'Style        : Discord-inspired anime profile',
  'Location     : Vietnam',
  'Passion      : Anime, gaming, Minecraft',
  'Current Mode : Quiet but online',
  '',
  'Press Enter to continue.',
];

export let activeTabId = 'boot';
export let tabCount = 1;
export let introTimer;

export const cmdTabsState = [
  {
    id: 'boot',
    title: 'cmd',
    log: 'Microsoft Windows [Version 11.0.22631.0000]\n(c) Microsoft Corporation. All rights reserved.\n\n',
    input: '',
    boot: true,
    interactive: false,
    typing: true,
  },
];

export function activeCmdTab() {
  return cmdTabsState.find((tab) => tab.id === activeTabId) || cmdTabsState[0];
}

export function renderCmdTabs() {
  if (!cmdTabs) return;
  cmdTabs.innerHTML = cmdTabsState.map((tab) => `
    <button class="cmd-tab ${tab.id === activeTabId ? 'active-tab' : ''}" type="button" data-tab-id="${tab.id}" role="tab" aria-selected="${tab.id === activeTabId}">
      <span class="cmd-tab-title">${tab.title}</span>
      ${cmdTabsState.length > 1 && !tab.boot ? '<span class="cmd-tab-close" data-close-tab>×</span>' : ''}
    </button>
  `).join('');
}

export function renderCmdBody() {
  const tab = activeCmdTab();
  if (!cmdLog || !cmdForm) return;
  cmdLog.textContent = tab.log;
  cmdLog.classList.toggle('typing', Boolean(tab.typing));
  cmdForm.classList.toggle('hidden', !tab.interactive);
  if (cmdInput) cmdInput.value = tab.input || '';
}

export function renderCmd() {
  renderCmdTabs();
  renderCmdBody();
}

export function switchCmdTab(tabId) {
  if (activeTabId === tabId) return;
  activeTabId = tabId;
  const cmdBody = document.querySelector('.cmd-body');
  if (cmdBody) {
    cmdBody.classList.remove('tab-switching');
    void cmdBody.offsetWidth;
    cmdBody.classList.add('tab-switching');
  }
  renderCmd();
  if (cmdInput) cmdInput.focus();
}

export function typeIntro() {
  const tab = activeCmdTab();
  const prefix = tab.log;
  const text = introLines.join('\n');
  let index = 0;
  introTimer = setInterval(() => {
    tab.log = prefix + text.slice(0, index);
    if (tab.id === activeTabId) renderCmdBody();
    index += 1;
    if (index > text.length) {
      tab.typing = false;
      clearInterval(introTimer);
      if (tab.id === activeTabId) renderCmdBody();
    }
  }, 18);
}

export function initCmdWindowControls() {
  const controls = document.querySelectorAll('.cmd-controls span');
  const cmdWindow = document.querySelector('.cmd-window');
  if (!controls || controls.length < 3 || !cmdWindow) return;

  controls[0].removeAttribute('title');
  controls[0].onclick = function (e) {
    if (e) e.preventDefault();
  };

  controls[1].removeAttribute('title');
  controls[1].onclick = function (e) {
    if (e) e.preventDefault();
  };

  controls[2].setAttribute('title', 'Phóng to / Khôi phục cửa sổ CMD');
  controls[2].onclick = function () {
    cmdWindow.classList.toggle('maximized');
  };
}

export function showScreen(screen) {
  if (!terminalScreen || !profileScreen) return;
  [terminalScreen, profileScreen].forEach((item) => item.classList.remove('active'));
  screen.classList.add('active');
  document.body.classList.toggle('terminal-active', screen === terminalScreen);
  if (player) player.classList.toggle('hidden', screen !== profileScreen);
}

export function enterConsole() {
  if (typeof playUISound === 'function') {
    playUISound('page');
  }
  showScreen(profileScreen);
  startMusic();
}

export function typeTextForTab(tab, text, speed = 14, onDone = () => {}) {
  let index = 0;
  const prefix = tab.log;
  tab.typing = true;
  const timer = setInterval(() => {
    tab.log = prefix + text.slice(0, index);
    if (tab.id === activeTabId) renderCmdBody();
    index += 1;
    if (index > text.length) {
      tab.typing = false;
      clearInterval(timer);
      onDone();
      if (tab.id === activeTabId) renderCmdBody();
    }
  }, speed);
}

export function openCmdTab() {
  const existingInteractiveTab = cmdTabsState.find((tab) => tab.interactive || tab.id === 'cmd-input-tab');
  if (existingInteractiveTab) {
    switchCmdTab(existingInteractiveTab.id);
    return;
  }

  tabCount += 1;
  const id = 'cmd-input-tab';
  const staticHeader = [
    'Microsoft Windows [Version 11.0.22631.0000]',
    '(c) Microsoft Corporation. All rights reserved.',
    '',
  ].join('\n');
  const tips = [
    '\nGợi ý: nhập website như youtube.com rồi nhấn Enter để mở tab mới.',
    'Gợi ý: thử nhập các lệnh help, status, ping, dir, profile, clear.',
    '',
  ].join('\n');
  const tab = {
    id,
    title: 'cmd 2',
    log: staticHeader,
    input: '',
    boot: false,
    interactive: false,
    typing: true,
  };
  cmdTabsState.push(tab);
  switchCmdTab(id);
  typeTextForTab(tab, tips, 12, () => {
    tab.interactive = true;
  });
}

export function closeCmdTab(tabId) {
  if (cmdTabsState.length === 1) return;
  const index = cmdTabsState.findIndex((tab) => tab.id === tabId);
  if (index === -1 || cmdTabsState[index].boot) return;
  cmdTabsState.splice(index, 1);
  if (activeTabId === tabId) activeTabId = cmdTabsState[Math.max(0, index - 1)].id;
  renderCmd();
}

export function normalizeUrl(value) {
  if (/^https?:\/\//i.test(value)) return value;
  if (/^[\w-]+(\.[\w-]+)+/.test(value)) return `https://${value}`;
  return '';
}

export function fakeCommand(command) {
  const lower = command.toLowerCase();
  if (['help', '?'].includes(lower)) return 'Available: help, clear, profile, status, ping, dir, scan, run <anything>, or paste a URL.';
  if (lower === 'profile') return 'Opening Chinatsu Kamado profile interface... done. Press Enter outside this input to continue.';
  if (lower === 'status') return 'Discord presence daemon: ONLINE\nAnime energy: 98%\nCute cursor: armed.';
  if (lower === 'ping') return 'Pinging moonlight.anime [127.0.0.1]... Reply: time=7ms TTL=uwu';
  if (lower === 'dir') return ' Directory of C:\\Users\\Chinatsu Kamado\n\n<DIR> anime\n<DIR> lofi\n<DIR> minecraft\n<DIR> secrets\nprofile.exe';
  if (lower.startsWith('run ') || lower.startsWith('npm ') || lower.startsWith('python ') || lower.startsWith('git ')) {
    return `Executing "${command}"...\n[OK] Pretending very professionally. No errors found.`;
  }
  return `"${command}" is not recognized... but it looks cool, so I will allow it. ✦`;
}

export function initTerminal() {
  terminalScreen = document.getElementById('terminal-screen');
  profileScreen = document.getElementById('profile-screen');
  enterButton = document.getElementById('enter-console-btn');
  player = document.getElementById('music-player');
  cmdTabs = document.getElementById('cmd-tabs');
  cmdNewTab = document.getElementById('cmd-new-tab');
  cmdLog = document.getElementById('cmd-log');
  cmdForm = document.getElementById('cmd-form');
  cmdInput = document.getElementById('cmd-input');

  window.initCmd = function () {
    renderCmd();
    typeIntro();
    initCmdWindowControls();
  };

  if (enterButton) {
    enterButton.addEventListener('click', enterConsole);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && terminalScreen && terminalScreen.classList.contains('active') && document.activeElement !== cmdInput) {
      enterConsole();
    }
  });

  if (cmdTabs) {
    cmdTabs.addEventListener('click', (event) => {
      const tabButton = event.target.closest('.cmd-tab');
      if (!tabButton) return;
      const tabId = tabButton.dataset.tabId;
      if (event.target.closest('[data-close-tab]')) closeCmdTab(tabId);
      else switchCmdTab(tabId);
    });
  }

  if (cmdNewTab) cmdNewTab.addEventListener('click', openCmdTab);

  if (cmdInput) {
    cmdInput.addEventListener('input', () => {
      activeCmdTab().input = cmdInput.value;
    });
  }

  if (cmdForm) {
    cmdForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const tab = activeCmdTab();
      const command = cmdInput.value.trim();
      if (!command) return;
      if (['cls', 'clear'].includes(command.toLowerCase())) {
        tab.log = '';
        tab.input = '';
        renderCmdBody();
        return;
      }
      tab.log += `${tab.log.endsWith('\n') ? '' : '\n'}C:\\Users\\Chinatsu Kamado> ${command}\n`;
      const url = normalizeUrl(command);
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
        tab.log += `Opening ${url} in a new tab...\n`;
      } else {
        tab.log += `${fakeCommand(command)}\n`;
      }
      tab.input = '';
      renderCmdBody();
    });
  }
}
