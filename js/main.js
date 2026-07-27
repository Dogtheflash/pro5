/* ============================================================
   MAIN ENTRY POINT MODULE — Chinatsu Kamado Profile + iOS 26
   ============================================================ */
'use strict';

import { runIOS26Loading } from './ios26-loading.js';
import { initTerminal } from './terminal.js';
import { initDiscordPresence } from './discord.js';
import { initMinecraftModule } from './minecraft.js';
import { initSteamModule } from './steam.js';
import { initMusicPlayer } from './music-player.js';
import { initColorTool, showInnerPage, hideInnerPage } from './color-tool.js';
import { initCompanion } from './companion.js';
import { initCursorTrails, initShatteredGlass, initChibiRunner, initWarp } from './minigames.js';
import { initThemeSwitcher, initYtBgToggle } from './theme.js';
import { initPointerGlow } from './parallax.js';
import { refinementLayer, pauseBgVideoWhenHidden } from './refinement.js';

function initApp() {
  runIOS26Loading();
  initTerminal();
  initDiscordPresence();
  initMusicPlayer();
  initColorTool();
  initMinecraftModule(showInnerPage, hideInnerPage);
  initSteamModule(showInnerPage, hideInnerPage);
  initCompanion();
  initCursorTrails();
  initShatteredGlass();
  initChibiRunner();
  initWarp();
  initThemeSwitcher();
  initYtBgToggle();
  initPointerGlow();
  refinementLayer();
  pauseBgVideoWhenHidden();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
