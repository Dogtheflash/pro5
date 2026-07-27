/* ============================================================
   THEME SWITCHER & YOUTUBE LOFI BACKGROUND MODULE
   ============================================================ */
'use strict';

export const THEMES = ['cyber', 'sakura', 'ocean', 'fire'];
export const THEME_ICONS = { cyber: '🌙', sakura: '🌸', ocean: '🌊', fire: '🔥' };

export const AMBIENT_SOUNDS = {
  cyber: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_a0f2834b92.mp3?filename=cyberpunk-street-114300.mp3',
  sakura: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_1f298711de.mp3?filename=nature-sounds-birds-singing-106560.mp3',
  ocean: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_27ed90023a.mp3?filename=ocean-waves-112906.mp3',
  fire: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_3d1a3f69fc.mp3?filename=crackling-fire-14498.mp3'
};

export const STORAGE_KEY = 'profile-theme';
export let ambientPlayer = null;

export function applyTheme(theme) {
  if (THEMES.indexOf(theme) === -1) theme = 'cyber';
  document.documentElement.setAttribute('data-theme', theme);
  const toggleBtn = document.getElementById('theme-toggle');
  const options = document.querySelectorAll('.theme-option');
  if (toggleBtn) toggleBtn.textContent = THEME_ICONS[theme] || '🌙';
  options.forEach(function (opt) {
    opt.classList.toggle('active', opt.dataset.theme === theme);
  });
  try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}

  if (ambientPlayer && AMBIENT_SOUNDS[theme]) {
    if (ambientPlayer.src !== AMBIENT_SOUNDS[theme]) {
      ambientPlayer.src = AMBIENT_SOUNDS[theme];
    }
    
    var playPromise = ambientPlayer.play();
    if (playPromise !== undefined) {
      playPromise.catch(function() {
        var resumeAmbient = function() {
          if (ambientPlayer) ambientPlayer.play().catch(function(){});
          document.removeEventListener('click', resumeAmbient);
        };
        document.addEventListener('click', resumeAmbient);
      });
    }
  } else if (ambientPlayer) {
    ambientPlayer.pause();
  }
}

export function initThemeSwitcher() {
  var toggleBtn = document.getElementById('theme-toggle');
  var menu = document.getElementById('theme-menu');
  var options = document.querySelectorAll('.theme-option');

  ambientPlayer = new Audio();
  ambientPlayer.loop = true;
  ambientPlayer.volume = 0.2;

  if (!toggleBtn || !menu) return;

  var saved = '';
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  applyTheme(saved || 'cyber');

  toggleBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    menu.classList.toggle('hidden');
  });

  options.forEach(function (opt) {
    opt.addEventListener('click', function () {
      applyTheme(opt.dataset.theme);
      setTimeout(function () {
        menu.classList.add('hidden');
      }, 150);
    });
  });

  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && e.target !== toggleBtn) {
      menu.classList.add('hidden');
    }
  });
}

export function postYtCommand(ytIframe, func, args) {
  if (ytIframe && ytIframe.contentWindow) {
    ytIframe.contentWindow.postMessage(JSON.stringify({
      event: 'command',
      func: func,
      args: args || []
    }), '*');
  }
}

export function initYtBgToggle() {
  const toggleBtn = document.getElementById('yt-bg-toggle');
  const restartBtn = document.getElementById('yt-restart-btn');
  const mp4Video = document.getElementById('bg-video');
  const ytContainer = document.getElementById('bg-yt-container');
  const ytIframe = document.getElementById('bg-yt-player');
  if (!toggleBtn || !mp4Video || !ytContainer || !ytIframe) return;

  let isYtMode = false;

  toggleBtn.addEventListener('click', () => {
    isYtMode = !isYtMode;

    if (isYtMode) {
      mp4Video.pause();
      mp4Video.classList.add('hidden');
      ytContainer.classList.remove('hidden');
      if (restartBtn) restartBtn.classList.remove('hidden');

      toggleBtn.style.background = 'rgba(53, 232, 255, 0.2)';
      toggleBtn.style.borderColor = '#35e8ff';
      toggleBtn.style.boxShadow = '0 0 10px #35e8ff';

      postYtCommand(ytIframe, 'playVideo');
      postYtCommand(ytIframe, 'unMute');
      postYtCommand(ytIframe, 'setVolume', [50]);
    } else {
      postYtCommand(ytIframe, 'pauseVideo');
      ytContainer.classList.add('hidden');
      if (restartBtn) restartBtn.classList.add('hidden');
      mp4Video.classList.remove('hidden');
      mp4Video.play();

      toggleBtn.style.background = '';
      toggleBtn.style.borderColor = '';
      toggleBtn.style.boxShadow = '';
    }
  });

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      postYtCommand(ytIframe, 'seekTo', [0, true]);
      postYtCommand(ytIframe, 'playVideo');
      postYtCommand(ytIframe, 'unMute');

      restartBtn.style.transform = 'scale(1.2) rotate(-360deg)';
      restartBtn.style.transition = 'transform 0.5s ease';
      setTimeout(() => {
        restartBtn.style.transform = '';
      }, 500);
    });
  }
}
