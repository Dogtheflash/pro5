/* ============================================================
   MINIGAMES & EASTER EGGS MODULE
   ============================================================ */
'use strict';

export function initCursorTrails() {
  if (window.__LOW_PERF) return;
  return;
}

export function initShatteredGlass() {
  if (window.__LOW_PERF) return;
  let avatarClickCount = 0;
  let avatarClickTimer = null;
  const avatarWrap = document.querySelector('.avatar-wrap');

  if (!avatarWrap) return;

  avatarWrap.addEventListener('click', (e) => {
    avatarClickCount++;
    clearTimeout(avatarClickTimer);

    if (avatarClickCount >= 5) {
      triggerShatterEffect(e.clientX, e.clientY);
      avatarClickCount = 0;
    } else {
      avatarClickTimer = setTimeout(() => {
        avatarClickCount = 0;
      }, 400);
    }
  });

  function triggerShatterEffect(x, y) {
    if (document.getElementById('glass-shatter')) return;

    document.body.classList.add('shaking');
    const chibi = document.querySelector('.css-chibi');
    if (chibi) chibi.classList.add('chibi-scared');

    const canvas = document.createElement('canvas');
    canvas.id = 'glass-shatter';
    canvas.style.cssText = 'position:fixed; inset:0; z-index:9999; pointer-events:none; opacity:1; transition:opacity 0.5s;';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    const numCracks = 15 + Math.floor(Math.random() * 10);
    for (let i = 0; i < numCracks; i++) {
      const angle = (Math.PI * 2 / numCracks) * i + (Math.random() * 0.4);
      let cx = x;
      let cy = y;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      const length = Math.max(window.innerWidth, window.innerHeight);
      let dist = 0;

      while (dist < length) {
        const step = 30 + Math.random() * 60;
        dist += step;
        const angleJitter = angle + (Math.random() - 0.5) * 0.6;
        cx += Math.cos(angleJitter) * step;
        cy += Math.sin(angleJitter) * step;
        ctx.lineTo(cx, cy);

        if (Math.random() > 0.6) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          const branchAngle = angleJitter + (Math.random() > 0.5 ? 0.6 : -0.6);
          ctx.lineTo(cx + Math.cos(branchAngle) * 120, cy + Math.sin(branchAngle) * 120);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 + Math.random() * 0.5})`;
          ctx.lineWidth = 1 + Math.random() * 1.5;
          ctx.stroke();
          ctx.restore();
        }
      }
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.6 + Math.random() * 0.4})`;
      ctx.lineWidth = 1.5 + Math.random() * 2.5;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(x, y, 10 + Math.random() * 15, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fill();

    setTimeout(() => {
      canvas.style.opacity = '0';
      document.body.classList.remove('shaking');
      if (chibi) chibi.classList.remove('chibi-scared');
      setTimeout(() => canvas.remove(), 500);
    }, 2000);
  }
}

export function initChibiRunner() {
  const aboutCard = document.querySelector('.about-card');
  if (!aboutCard) return;

  const gameContainer = document.createElement('div');
  gameContainer.id = 'runner-game-container';
  gameContainer.innerHTML = `
    <div class="runner-close" title="Đóng game">✖</div>
    <div class="runner-score">00000</div>
    <div class="runner-ground"></div>
    <div class="runner-chibi-wrap" id="runner-chibi"></div>
    <div class="runner-game-over" id="runner-game-over">
      GAME OVER
      <span>Bấm Phím Cách (Space) để chơi lại</span>
    </div>
  `;
  aboutCard.appendChild(gameContainer);

  const chibiWrap = document.getElementById('runner-chibi');
  const scoreEl = gameContainer.querySelector('.runner-score');
  const gameOverEl = document.getElementById('runner-game-over');
  const closeBtn = gameContainer.querySelector('.runner-close');

  const originalChibi = document.querySelector('.css-chibi');
  if (originalChibi) {
    const clone = originalChibi.cloneNode(true);
    const chat = clone.querySelector('.comp-chat');
    if (chat) chat.remove();
    clone.style.position = 'relative';
    clone.style.bottom = '0';
    clone.style.right = 'auto';
    clone.style.left = '0';
    clone.style.zIndex = '1';
    clone.style.transform = 'scale(0.6)';
    clone.style.transformOrigin = 'bottom left';
    chibiWrap.appendChild(clone);
  }

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx;

  function playSound(type) {
    if (!audioCtx) {
      try { audioCtx = new AudioContext(); } catch (e) { return; }
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'jump') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'die') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'score') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);

      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(1200, audioCtx.currentTime);
        gain2.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.1);
      }, 100);
    }
  }

  let isPlaying = false;
  let isGameOver = false;
  let score = 0;
  let gameSpeed = 4;
  let gravity = 0.6;
  let velocityY = 0;
  let chibiY = 22;
  let isJumping = false;
  let obstacles = [];
  let frameCount = 0;
  let reqId;

  function startGame() {
    gameContainer.classList.add('active');
    aboutCard.classList.add('game-active');
    aboutCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0)';
    const glare = aboutCard.querySelector('.glare');
    if (glare) glare.style.opacity = '0';
    resetGame();
  }

  function resetGame() {
    isPlaying = true;
    isGameOver = false;
    score = 0;
    gameSpeed = 4;
    velocityY = 0;
    chibiY = 22;
    isJumping = false;
    frameCount = 0;
    scoreEl.innerText = "00000";
    gameOverEl.classList.remove('show');

    obstacles.forEach(obs => obs.el.remove());
    obstacles = [];

    updateChibiPos();
    cancelAnimationFrame(reqId);
    reqId = requestAnimationFrame(gameLoop);
  }

  function stopGame() {
    isPlaying = false;
    gameContainer.classList.remove('active');
    aboutCard.classList.remove('game-active');
    cancelAnimationFrame(reqId);
  }

  function jump() {
    if (!isPlaying && !isGameOver) return;
    if (isGameOver) {
      resetGame();
      return;
    }
    if (!isJumping) {
      isJumping = true;
      velocityY = 10;
      playSound('jump');
    }
  }

  function updateChibiPos() {
    chibiWrap.style.bottom = chibiY + 'px';
  }

  function spawnObstacle() {
    const obsEl = document.createElement('div');
    obsEl.className = 'runner-obstacle';
    obsEl.style.left = gameContainer.offsetWidth + 'px';
    gameContainer.appendChild(obsEl);
    obstacles.push({ el: obsEl, x: gameContainer.offsetWidth, passed: false });
  }

  function gameLoop() {
    if (!isPlaying) return;

    frameCount++;

    if (isJumping) {
      chibiY += velocityY;
      velocityY -= gravity;
      if (chibiY <= 22) {
        chibiY = 22;
        isJumping = false;
        velocityY = 0;
      }
      updateChibiPos();
    }

    if (frameCount % Math.max(50, 120 - Math.floor(score / 15)) === 0) {
      spawnObstacle();
    }

    const chibiRect = chibiWrap.getBoundingClientRect();
    const hitBox = {
      left: chibiRect.left + 6,
      right: chibiRect.right - 6,
      top: chibiRect.top + 4,
      bottom: chibiRect.bottom
    };

    for (let i = 0; i < obstacles.length; i++) {
      let obs = obstacles[i];
      obs.x -= gameSpeed;
      obs.el.style.left = obs.x + 'px';

      if (!obs.passed && obs.x < 30) {
        obs.passed = true;
        score += 10;
        scoreEl.innerText = score.toString().padStart(5, '0');
        if (score % 100 === 0) {
          playSound('score');
          gameSpeed += 0.5;
        }
      }

      const obsRect = obs.el.getBoundingClientRect();
      const obsHitBox = {
        left: obsRect.left + 4,
        right: obsRect.right - 4,
        top: obsRect.top + 6,
        bottom: obsRect.bottom
      };

      if (hitBox.left < obsHitBox.right &&
          hitBox.right > obsHitBox.left &&
          hitBox.bottom > obsHitBox.top &&
          hitBox.top < obsHitBox.bottom) {
        isGameOver = true;
        isPlaying = false;
        gameOverEl.classList.add('show');
        playSound('die');
        cancelAnimationFrame(reqId);
        return;
      }
    }

    if (obstacles.length > 0 && obstacles[0].x < -30) {
      obstacles[0].el.remove();
      obstacles.shift();
    }

    reqId = requestAnimationFrame(gameLoop);
  }

  let arrowUpCount = 0;
  let arrowUpTimer;
  document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowUp') {
      arrowUpCount++;
      clearTimeout(arrowUpTimer);
      if (arrowUpCount >= 2) {
        if (!gameContainer.classList.contains('active')) {
          startGame();
        }
        arrowUpCount = 0;
      } else {
        arrowUpTimer = setTimeout(() => { arrowUpCount = 0; }, 400);
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      if (gameContainer.classList.contains('active')) {
        e.preventDefault();
        jump();
      }
    }
  });

  gameContainer.addEventListener('click', (e) => {
    if (e.target !== closeBtn) {
      jump();
    }
  });

  closeBtn.addEventListener('click', () => {
    stopGame();
  });
}

export function initWarp() {
  const warpBtn = document.getElementById('warp-btn');
  const canvas = document.getElementById('warp-canvas');
  const easterEgg = document.getElementById('easter-egg');
  const returnBtn = document.getElementById('return-warp-btn');
  if (!warpBtn || !canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let numStars = 400;
  let warpSpeed = 0;
  let isWarping = false;
  let rafId;

  function initStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * canvas.width
      });
    }
  }

  function drawStars() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    for (let i = 0; i < stars.length; i++) {
      let s = stars[i];
      s.z -= warpSpeed;
      if (s.z <= 0) {
        s.z = canvas.width;
        s.x = Math.random() * canvas.width - cx;
        s.y = Math.random() * canvas.height - cy;
      }

      let x = cx + (s.x / s.z) * canvas.width;
      let y = cy + (s.y / s.z) * canvas.width;
      let r = Math.max(1, (1 - s.z / canvas.width) * 3);

      ctx.beginPath();
      ctx.fillStyle = '#fff';
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      if (warpSpeed > 5) {
        let prevZ = s.z + warpSpeed * 2;
        let px = cx + (s.x / prevZ) * canvas.width;
        let py = cy + (s.y / prevZ) * canvas.width;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${1 - s.z / canvas.width})`;
        ctx.lineWidth = r;
        ctx.moveTo(x, y);
        ctx.lineTo(px, py);
        ctx.stroke();
      }
    }
    rafId = requestAnimationFrame(drawStars);
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (isWarping && !rafId) initStars();
  }
  window.addEventListener('resize', resize);

  warpBtn.addEventListener('click', () => {
    isWarping = true;
    resize();
    initStars();
    canvas.classList.add('active');
    document.body.classList.add('warping');

    let acc = setInterval(() => {
      warpSpeed += 1.5;
      if (warpSpeed > 30) {
        clearInterval(acc);
        if (easterEgg) {
          easterEgg.classList.remove('hidden');
          setTimeout(() => easterEgg.classList.add('show'), 100);
        }
      }
    }, 50);
    drawStars();
  });

  if (returnBtn) {
    returnBtn.addEventListener('click', () => {
      if (easterEgg) {
        easterEgg.classList.remove('show');
        setTimeout(() => easterEgg.classList.add('hidden'), 500);
      }

      let dec = setInterval(() => {
        warpSpeed -= 2;
        if (warpSpeed <= 0) {
          clearInterval(dec);
          warpSpeed = 0;
          isWarping = false;
          canvas.classList.remove('active');
          document.body.classList.remove('warping');
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }, 50);
    });
  }
}
