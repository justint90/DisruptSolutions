// Gamepad Controller API & Keyboard Nav Engine for Gaming HUD

class GamepadNav {
  constructor() {
    this.gamepadConnected = false;
    this.activeGamepadIndex = null;
    this.lastButtonPressTime = 0;
    this.debounceMs = 220;
    this.konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA'
    ];
    this.konamiIndex = 0;

    this.init();
  }

  init() {
    this.bindKeyboard();
    this.bindGamepad();
  }

  bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Don't intercept if user is typing inside the AI terminal input or contact textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        return;
      }

      // Check Konami Code
      if (e.code === this.konamiCode[this.konamiIndex]) {
        this.konamiIndex++;
        if (this.konamiIndex === this.konamiCode.length) {
          this.konamiIndex = 0;
          if (window.triggerSecretAchievement) window.triggerSecretAchievement();
        }
      } else {
        this.konamiIndex = 0;
      }

      // Shortcut keys
      switch (e.key) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
          e.preventDefault();
          const tabIdx = parseInt(e.key) - 1;
          if (window.switchTabByIndex) window.switchTabByIndex(tabIdx);
          break;
        case 'q':
        case 'Q':
          if (window.switchTabRelative) window.switchTabRelative(-1);
          break;
        case 'e':
        case 'E':
          if (window.switchTabRelative) window.switchTabRelative(1);
          break;
        case 'm':
        case 'M':
          if (window.soundEngine) {
            const isMuted = window.soundEngine.toggleMute();
            if (window.updateAudioUI) window.updateAudioUI(isMuted);
          }
          break;
        case 'c':
        case 'C':
          if (window.toggleCRT) window.toggleCRT();
          break;
        case 'Escape':
          if (window.closeInspectModal) window.closeInspectModal();
          break;
      }
    });
  }

  bindGamepad() {
    window.addEventListener('gamepadconnected', (e) => {
      this.gamepadConnected = true;
      this.activeGamepadIndex = e.gamepad.index;
      this.showGamepadBanner(`GAMEPAD CONNECTED: ${e.gamepad.id.split('(')[0].trim()}`);
      if (window.soundEngine) window.soundEngine.playSelect();
      this.pollGamepad();
    });

    window.addEventListener('gamepaddisconnected', () => {
      this.gamepadConnected = false;
      this.activeGamepadIndex = null;
      this.showGamepadBanner('GAMEPAD DISCONNECTED');
    });
  }

  showGamepadBanner(text) {
    const banner = document.getElementById('gamepadBanner');
    if (banner) {
      banner.textContent = text;
      banner.classList.add('visible');
      setTimeout(() => banner.classList.remove('visible'), 3500);
    }
  }

  pollGamepad() {
    if (!this.gamepadConnected) return;

    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = gamepads[this.activeGamepadIndex];

    if (gp) {
      const now = performance.now();
      if (now - this.lastButtonPressTime > this.debounceMs) {
        // Shoulder buttons: LB (4) and RB (5) switch tabs
        if (gp.buttons[4] && gp.buttons[4].pressed) {
          if (window.switchTabRelative) window.switchTabRelative(-1);
          this.lastButtonPressTime = now;
        } else if (gp.buttons[5] && gp.buttons[5].pressed) {
          if (window.switchTabRelative) window.switchTabRelative(1);
          this.lastButtonPressTime = now;
        }
        // D-Pad Left (14) / Right (15)
        else if (gp.buttons[14] && gp.buttons[14].pressed) {
          if (window.switchTabRelative) window.switchTabRelative(-1);
          this.lastButtonPressTime = now;
        } else if (gp.buttons[15] && gp.buttons[15].pressed) {
          if (window.switchTabRelative) window.switchTabRelative(1);
          this.lastButtonPressTime = now;
        }
        // B Button (1) closes modal
        else if (gp.buttons[1] && gp.buttons[1].pressed) {
          if (window.closeInspectModal) window.closeInspectModal();
          this.lastButtonPressTime = now;
        }
      }
    }

    requestAnimationFrame(() => this.pollGamepad());
  }
}

window.GamepadNav = GamepadNav;
