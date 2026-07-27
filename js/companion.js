/* ============================================================
   INTERACTIVE COMPANION (CHIBI & SLEEPING CAT) MODULE
   ============================================================ */
'use strict';

export function initCompanion() {
  const companion = document.getElementById('companion');
  const cat = document.querySelector('.css-cat');
  let catSleepTimer = null;

  if (companion) {
    const eyes = companion.querySelectorAll('.comp-eye');
    const catEyes = cat ? cat.querySelectorAll('.cat-eye') : [];

    document.addEventListener('mousemove', (e) => {
      const gameContainer = document.getElementById('runner-game-container');
      if (gameContainer && gameContainer.classList.contains('active')) return;

      const rect = companion.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 300;
      const factor = Math.min(dist / maxDist, 1);

      const ex = dist > 0 ? (dx / dist) * factor * 4 : 0;
      const ey = dist > 0 ? (dy / dist) * factor * 4 : 0;

      eyes.forEach(eye => {
        eye.style.setProperty('--eye-x', `${ex}px`);
        eye.style.setProperty('--eye-y', `${ey}px`);
      });

      if (cat && cat.classList.contains('awake')) {
        const cRect = cat.getBoundingClientRect();
        const ccx = cRect.left + cRect.width / 2;
        const ccy = cRect.top + cRect.height / 2;
        const cdx = e.clientX - ccx;
        const cdy = e.clientY - ccy;
        const cDist = Math.sqrt(cdx * cdx + cdy * cdy);
        const cFactor = Math.min(cDist / 200, 1);
        const cex = cDist > 0 ? (cdx / cDist) * cFactor * 3 : 0;
        const cey = cDist > 0 ? (cdy / cDist) * cFactor * 3 : 0;

        catEyes.forEach(eye => {
          eye.style.setProperty('--cat-eye-x', `${cex}px`);
          eye.style.setProperty('--cat-eye-y', `${cey}px`);
        });

        if (cDist < 100) resetCatSleepTimer();
      }
    });

    if (cat) {
      cat.addEventListener('click', wakeUpCat);
    }

    const meowAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/86/86-preview.mp3');
    meowAudio.volume = 0.4;

    function wakeUpCat(e) {
      cat.classList.add('awake');
      resetCatSleepTimer();

      meowAudio.cloneNode().play().catch(err => console.log("Audio not allowed yet", err));

      const heart = document.createElement('div');
      heart.textContent = '❤️';
      heart.style.position = 'fixed';
      heart.style.left = (e.clientX || cat.getBoundingClientRect().left + 15) + 'px';
      heart.style.top = (e.clientY || cat.getBoundingClientRect().top) + 'px';
      heart.style.fontSize = '20px';
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = '9999';
      heart.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
      heart.style.transform = 'translate(-50%, -50%) scale(0.5)';
      heart.style.opacity = '1';
      document.body.appendChild(heart);

      requestAnimationFrame(() => {
        heart.style.transform = `translate(-50%, calc(-50% - 80px)) scale(1.5) rotate(${Math.random() * 40 - 20}deg)`;
        heart.style.opacity = '0';
      });

      setTimeout(() => heart.remove(), 1200);
    }

    function resetCatSleepTimer() {
      clearTimeout(catSleepTimer);
      catSleepTimer = setTimeout(() => {
        if (cat) cat.classList.remove('awake');
      }, 5000);
    }

    companion.addEventListener('click', () => {
      eyes.forEach(eye => {
        eye.style.background = 'var(--pink)';
        eye.style.boxShadow = '0 0 14px var(--pink)';
        setTimeout(() => {
          eye.style.background = 'var(--cyan)';
          eye.style.boxShadow = '0 0 8px var(--cyan)';
        }, 600);
      });
      showChat();
    });

    companion.addEventListener('dblclick', () => {
      const chibiParent = document.querySelector('.css-chibi');
      if (chibiParent && !chibiParent.classList.contains('backflip')) {
        chibiParent.classList.add('backflip');
        setTimeout(() => {
          chibiParent.classList.remove('backflip');
        }, 1800);
      }
    });

    const chatBubble = document.getElementById('comp-chat');
    const quotes = [
      "Bấm vào mình đi!",
      "Hôm nay bạn thế nào?",
      "Chúc một ngày tốt lành! ✨",
      "Cố gắng lên nhé!",
      "Mình đang nhìn bạn đó 👀"
    ];
    let hideTimer = null;
    let typingTimer = null;

    function showChat() {
      if (!chatBubble) return;
      clearTimeout(hideTimer);
      clearTimeout(typingTimer);

      chatBubble.innerHTML = '<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>';
      chatBubble.classList.add('show');

      typingTimer = setTimeout(() => {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        chatBubble.textContent = randomQuote;

        hideTimer = setTimeout(() => {
          chatBubble.classList.remove('show');
        }, 3500);
      }, 1500);
    }

    setInterval(() => {
      showChat();
    }, 12000);

    const chibiParent = document.querySelector('.css-chibi');
    const chibiHat = document.querySelector('.chibi-hat');
    const hatTypes = ['hat-cap', 'hat-crown', 'hat-wizard', 'hat-catears', 'hat-visor'];
    let currentHatIndex = -1;

    if (chibiParent && chibiHat) {
      setInterval(() => {
        chibiParent.classList.add('chibi-changing-hat');

        setTimeout(() => {
          if (currentHatIndex >= 0) {
            chibiHat.classList.remove(hatTypes[currentHatIndex]);
          }

          let newHatIndex;
          do {
            newHatIndex = Math.floor(Math.random() * hatTypes.length);
          } while (newHatIndex === currentHatIndex && hatTypes.length > 1);

          currentHatIndex = newHatIndex;
          chibiHat.classList.add(hatTypes[currentHatIndex]);
        }, 500);

        setTimeout(() => {
          chibiParent.classList.remove('chibi-changing-hat');
        }, 1000);
      }, 7000);

      setInterval(() => {
        if (!chibiParent.classList.contains('chibi-changing-hat')) {
          chibiParent.classList.add('chibi-petting');

          setTimeout(() => {
            chibiParent.classList.remove('chibi-petting');
          }, 2000);
        }
      }, 6000);
    }
  }

  document.querySelectorAll('.mini-btn, .copy-btn, .social-row a, .profile-footer a').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.05s linear';
    });

    btn.addEventListener('mousemove', (e) => {
      const gameContainer = document.getElementById('runner-game-container');
      if (gameContainer && gameContainer.classList.contains('active')) return;

      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      const moveX = dx * 0.35;
      const moveY = dy * 0.35;

      btn.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transition = '';
      btn.style.transform = '';
    });
  });
}
