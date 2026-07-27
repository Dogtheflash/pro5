/* ============================================================
   MUSIC PLAYER & REAL WEB AUDIO VISUALIZER MODULE
   ============================================================ */
'use strict';

export let audio;
export let playToggle;
export let player;
export let trackTitle;
export let nextTrackButton;
export let currentTimeEl;
export let durationTimeEl;
export let progressBar;
export let volumeControl;
export let volumeToggle;
export let volumeSlider;

export const tracks = [
  { title: 'Nightcore - Rise Up', src: './Audio/Nightcore-Rise-Up.mp3' },
  { title: 'Esoa (Ballad Version)', src: './Audio/Esoa-Ballad-version.mp3' },
  { title: 'My Music', src: './Audio/Music.mp3' }
];

export let currentTrackIndex = 0;
export let playing = false;

export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remaining}`;
}

export function renderTrackMeta() {
  if (!trackTitle || !currentTimeEl || !durationTimeEl || !audio) return;
  const track = tracks[currentTrackIndex];
  trackTitle.textContent = track.title;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationTimeEl.textContent = formatTime(audio.duration);
}

export function loadTrack(index) {
  if (!audio || !progressBar || !currentTimeEl || !durationTimeEl) return;
  currentTrackIndex = (index + tracks.length) % tracks.length;
  const track = tracks[currentTrackIndex];
  audio.src = track.src;
  progressBar.style.width = '0%';
  currentTimeEl.textContent = '0:00';
  durationTimeEl.textContent = '0:00';
  renderTrackMeta();
}

export async function playCurrentTrack() {
  if (!audio || !playToggle || !player) return;
  await audio.play();
  playing = true;
  playToggle.textContent = '❚❚';
  player.classList.remove('paused');
  renderTrackMeta();
}

export async function startMusic() {
  if (!audio || !volumeSlider) return;
  try {
    audio.volume = 0.15;
    volumeSlider.value = 15;
    await playCurrentTrack();
  } catch (error) {
    console.warn('Autoplay blocked:', error);
  }
}

export function pauseMusic() {
  if (!audio || !playToggle || !player) return;
  audio.pause();
  playing = false;
  playToggle.textContent = '▶';
  player.classList.add('paused');
  renderTrackMeta();
}

let volumeAutoCloseTimer;

export function scheduleVolumeAutoClose() {
  clearTimeout(volumeAutoCloseTimer);
  if (!volumeControl || !volumeControl.classList.contains('open')) return;
  volumeAutoCloseTimer = setTimeout(() => {
    volumeControl.classList.remove('open');
  }, 2000);
}

export function initAudioVisualizerCanvas() {
  var canvas = document.getElementById('audio-visualizer');
  var audioEl = document.getElementById('audio-player');
  if (!canvas || !audioEl) return;

  var ctx = canvas.getContext('2d');
  var audioCtx = null;
  var analyser = null;
  var source = null;
  var dataArray = null;
  var bufferLength = 0;
  var rafId = null;
  var connected = false;
  var lastBassPush = 0;
  var lastBassValue = -1;

  function ensureAudioContext() {
    if (connected) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.78;
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      source = audioCtx.createMediaElementSource(audioEl);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      connected = true;
    } catch (e) {
      console.warn('AudioContext init failed:', e);
    }
  }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw() {
    if (!analyser) return;
    rafId = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    var nowMs = performance.now();
    if (nowMs - lastBassPush > 50) {
      lastBassPush = nowMs;
      var bassSum = 0;
      for (var j = 0; j < 8; j++) bassSum += dataArray[j];
      var bass = Math.round((bassSum / 8 / 255) * 100) / 100;
      if (bass !== lastBassValue) {
        lastBassValue = bass;
        document.body.style.setProperty('--audio-bass', bass);
      }
    }
  }

  function startVisualizer() {
    ensureAudioContext();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    resize();
    canvas.classList.add('active');
    if (!rafId) draw();
  }

  function stopVisualizer() {
    canvas.classList.remove('active');
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  audioEl.addEventListener('play', startVisualizer);
  audioEl.addEventListener('pause', stopVisualizer);
  audioEl.addEventListener('ended', stopVisualizer);

  window.addEventListener('resize', function () {
    if (canvas.classList.contains('active')) resize();
  });

  if (!audioEl.paused) startVisualizer();
}

export function initMusicPlayer() {
  playToggle = document.getElementById('play-toggle');
  player = document.getElementById('music-player');
  audio = document.getElementById('audio-player');
  trackTitle = document.getElementById('track-title');
  nextTrackButton = document.getElementById('next-track');
  currentTimeEl = document.getElementById('current-time');
  durationTimeEl = document.getElementById('duration-time');
  progressBar = document.getElementById('progress-bar');
  volumeControl = document.getElementById('volume-control');
  volumeToggle = document.getElementById('volume-toggle');
  volumeSlider = document.getElementById('volume-slider');

  if (!audio) return;

  audio.volume = Number(volumeSlider.value) / 100;
  playToggle.textContent = '▶';
  player.classList.add('paused');

  renderTrackMeta();

  playToggle.addEventListener('click', async () => {
    try {
      if (playing) {
        pauseMusic();
      } else {
        await playCurrentTrack();
      }
    } catch (error) {
      console.warn('Audio playback blocked or file missing:', error);
      if (trackTitle) trackTitle.textContent = 'Không mở được file nhạc';
    }
  });

  if (nextTrackButton) {
    nextTrackButton.addEventListener('click', async () => {
      const shouldResume = playing;
      loadTrack(currentTrackIndex + 1);
      if (!shouldResume) return;
      try {
        await playCurrentTrack();
      } catch (error) {
        console.warn('Unable to switch track:', error);
        if (trackTitle) trackTitle.textContent = 'Không mở được file nhạc';
      }
    });
  }

  audio.addEventListener('loadedmetadata', renderTrackMeta);
  audio.addEventListener('error', () => {
    if (trackTitle) trackTitle.textContent = 'Không tìm thấy file nhạc';
  });
  audio.addEventListener('ended', () => {
    if (currentTrackIndex === 0) {
      audio.currentTime = 0;
    } else {
      loadTrack(0);
    }
    playCurrentTrack().catch((error) => console.warn('Unable to autoplay next track:', error));
  });
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration || !progressBar) return;
    progressBar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
    renderTrackMeta();
  });

  if (volumeToggle && volumeControl) {
    volumeToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      volumeControl.classList.toggle('open');
      if (volumeControl.classList.contains('open')) {
        if (volumeSlider) volumeSlider.focus();
        scheduleVolumeAutoClose();
      } else {
        clearTimeout(volumeAutoCloseTimer);
      }
    });

    volumeControl.addEventListener('pointermove', scheduleVolumeAutoClose);
    volumeControl.addEventListener('pointerdown', scheduleVolumeAutoClose);
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      const volume = Number(volumeSlider.value) / 100;
      audio.volume = volume;
      const icon = volume === 0 ? '🔇' : volume < 0.45 ? '🔉' : '🔊';
      if (volumeToggle) volumeToggle.textContent = icon;
      scheduleVolumeAutoClose();
    });
  }

  const progressEl = document.querySelector('.music-player .progress');
  if (progressEl) {
    progressEl.setAttribute('role', 'slider');
    progressEl.setAttribute('aria-label', 'Tua bài hát');
    progressEl.tabIndex = 0;

    const seekTo = (clientX) => {
      const r = progressEl.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      if (Number.isFinite(audio.duration)) audio.currentTime = ratio * audio.duration;
    };
    let dragging = false;
    progressEl.addEventListener('pointerdown', (e) => {
      dragging = true; progressEl.setPointerCapture(e.pointerId); seekTo(e.clientX);
    });
    progressEl.addEventListener('pointermove', (e) => { if (dragging) seekTo(e.clientX); });
    progressEl.addEventListener('pointerup', () => { dragging = false; });
    progressEl.addEventListener('keydown', (e) => {
      if (!Number.isFinite(audio.duration)) return;
      if (e.key === 'ArrowRight') { audio.currentTime = Math.min(audio.duration, audio.currentTime + 5); e.preventDefault(); }
      if (e.key === 'ArrowLeft')  { audio.currentTime = Math.max(0, audio.currentTime - 5); e.preventDefault(); }
    });
  }

  initAudioVisualizerCanvas();
}
