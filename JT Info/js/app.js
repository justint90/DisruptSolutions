// Main Application Controller for Justin Taylor Gaming HUD Website

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Canvas
  if (window.CyberCanvas) {
    new window.CyberCanvas('bgCanvas');
  }

  // 2. Initialize Radar Chart
  if (window.OperatorRadar) {
    new window.OperatorRadar('radarChartContainer');
  }

  // 3. Initialize AI Terminal
  if (window.NeuralTerminal) {
    new window.NeuralTerminal('terminalContainer');
  }

  // 4. Initialize Gamepad / Keyboard Engine
  if (window.GamepadNav) {
    new window.GamepadNav();
  }

  // 5. Populate Dynamic Content
  populateSkillMatrix();
  populateMissions();
  populateArsenal();
  populateAchievements();

  // 6. Setup Tabs
  setupNavigation();

  // 7. Setup Live Telemetry & FPS Counter
  setupTelemetry();

  // 8. Setup HUD Controls & Audio
  setupHUDControls();

  // 9. Setup Contact Form
  setupContactForm();
});

// Current active tab index
let currentTabIndex = 0;
const TABS = ['tab-profile', 'tab-skills', 'tab-missions', 'tab-terminal', 'tab-arsenal', 'tab-comms'];

function setupNavigation() {
  const desktopBtns = document.querySelectorAll('.menu-nav-btn');
  const drawerBtns = document.querySelectorAll('.mobile-drawer-btn');
  const bottomBtns = document.querySelectorAll('.m-bottom-btn');
  const drawerOverlay = document.getElementById('mobileNavOverlay');
  const navToggleBtn = document.getElementById('mobileNavToggle');
  const navCloseBtn = document.getElementById('mobileNavClose');

  // Desktop side rail clicks
  desktopBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => switchTabByIndex(idx));
    btn.addEventListener('mouseenter', () => {
      if (window.soundEngine) window.soundEngine.playHover();
    });
  });

  // Mobile drawer clicks
  drawerBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      switchTabByIndex(idx);
      closeMobileDrawer();
    });
    btn.addEventListener('mouseenter', () => {
      if (window.soundEngine) window.soundEngine.playHover();
    });
  });

  // Mobile bottom quick bar clicks
  bottomBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      switchTabByIndex(idx);
    });
  });

  // Mobile drawer open / close handlers
  if (navToggleBtn && drawerOverlay) {
    navToggleBtn.addEventListener('click', () => {
      toggleMobileDrawer();
    });
  }

  if (navCloseBtn) {
    navCloseBtn.addEventListener('click', () => {
      closeMobileDrawer();
    });
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', (e) => {
      if (e.target === drawerOverlay) {
        closeMobileDrawer();
      }
    });
  }
}

function openMobileDrawer() {
  const overlay = document.getElementById('mobileNavOverlay');
  const toggleBtn = document.getElementById('mobileNavToggle');
  if (overlay) {
    overlay.classList.add('visible');
    if (toggleBtn) toggleBtn.classList.add('active');
    if (window.soundEngine) window.soundEngine.playSelect();
  }
}

function closeMobileDrawer() {
  const overlay = document.getElementById('mobileNavOverlay');
  const toggleBtn = document.getElementById('mobileNavToggle');
  if (overlay) {
    overlay.classList.remove('visible');
    if (toggleBtn) toggleBtn.classList.remove('active');
  }
}

function toggleMobileDrawer() {
  const overlay = document.getElementById('mobileNavOverlay');
  if (overlay && overlay.classList.contains('visible')) {
    closeMobileDrawer();
  } else {
    openMobileDrawer();
  }
}

window.switchTabByIndex = function(idx) {
  if (idx < 0 || idx >= TABS.length) return;
  if (currentTabIndex === idx) return;

  const desktopBtns = document.querySelectorAll('.menu-nav-btn');
  const drawerBtns = document.querySelectorAll('.mobile-drawer-btn');
  const bottomBtns = document.querySelectorAll('.m-bottom-btn');
  const tabPanels = document.querySelectorAll('.menu-panel');

  // Synchronize all navigation elements
  desktopBtns.forEach((btn, i) => btn.classList.toggle('active', i === idx));
  drawerBtns.forEach((btn, i) => btn.classList.toggle('active', i === idx));
  bottomBtns.forEach((btn, i) => btn.classList.toggle('active', i === idx));

  tabPanels.forEach((panel, i) => {
    panel.classList.toggle('active', i === idx);
  });

  currentTabIndex = idx;

  if (window.soundEngine) {
    window.soundEngine.playTabSwitch();
  }

  // Scroll main view container to top smoothly
  const viewContainer = document.querySelector('.main-viewport');
  if (viewContainer) viewContainer.scrollTop = 0;
};

window.switchTabRelative = function(dir) {
  let nextIdx = (currentTabIndex + dir + TABS.length) % TABS.length;
  window.switchTabByIndex(nextIdx);
};

// Populate Skills
function populateSkillMatrix() {
  const container = document.getElementById('skillsContainer');
  if (!container || !window.JT_PROFILE) return;

  let html = '';
  window.JT_PROFILE.skillTree.forEach(branch => {
    let skillItems = '';
    branch.skills.forEach(skill => {
      skillItems += `
        <div class="skill-node glass-card" tabindex="0">
          <div class="skill-head">
            <span class="skill-name">${skill.name}</span>
            <span class="skill-level" style="color: ${branch.color}">${skill.level}% <small>(${skill.exp})</small></span>
          </div>
          <div class="skill-meter">
            <div class="skill-fill" style="width: ${skill.level}%; background: linear-gradient(90deg, ${branch.color}88, ${branch.color});"></div>
          </div>
          <div class="skill-desc">${skill.desc}</div>
        </div>
      `;
    });

    html += `
      <div class="skill-branch">
        <div class="branch-header" style="border-left-color: ${branch.color}">
          <span class="branch-icon">${branch.branchIcon}</span>
          <h3 class="branch-title" style="color: ${branch.color}">${branch.branchName}</h3>
        </div>
        <div class="skill-grid">
          ${skillItems}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Sound effects on hover
  container.querySelectorAll('.skill-node').forEach(node => {
    node.addEventListener('mouseenter', () => {
      if (window.soundEngine) window.soundEngine.playHover();
    });
  });
}

// Populate Missions (Quests)
function populateMissions() {
  const container = document.getElementById('missionsContainer');
  if (!container || !window.JT_PROFILE) return;

  let html = '';
  window.JT_PROFILE.missions.forEach(mission => {
    const tagsHtml = mission.tags.map(t => `<span class="mission-tag">${t}</span>`).join('');
    
    let metricsHtml = '';
    for (const [key, val] of Object.entries(mission.metrics)) {
      metricsHtml += `
        <div class="mission-metric">
          <span class="metric-key">${key}</span>
          <span class="metric-val">${val}</span>
        </div>
      `;
    }

    const deliverablesHtml = mission.deliverables.map(d => `<li>${d}</li>`).join('');

    html += `
      <div class="mission-card glass-card" data-mission-id="${mission.id}">
        <div class="mission-top-bar">
          <span class="mission-code">${mission.code}</span>
          <span class="mission-tier">${mission.tier}</span>
          <span class="mission-status">${mission.status}</span>
        </div>
        <div class="mission-header">
          <h3 class="mission-title">${mission.title}</h3>
          <div class="mission-meta">
            <span class="mission-org">🏛️ ${mission.org}</span>
            <span class="mission-period">⏱️ ${mission.period}</span>
            <span class="mission-role">👤 ${mission.role}</span>
          </div>
        </div>
        <p class="mission-summary">${mission.summary}</p>
        <div class="mission-metrics-strip">
          ${metricsHtml}
        </div>
        <div class="mission-tags-wrap">
          ${tagsHtml}
        </div>
        <ul class="mission-deliverables">
          ${deliverablesHtml}
        </ul>
        <div class="mission-actions">
          <button class="inspect-btn hud-button" onclick="openMissionModal('${mission.id}')">
            <span>INSPECT ARCHITECTURE &rarr;</span>
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  container.querySelectorAll('.mission-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (window.soundEngine) window.soundEngine.playHover();
    });
  });
}

// Populate Arsenal
function populateArsenal() {
  const container = document.getElementById('arsenalContainer');
  if (!container || !window.JT_PROFILE) return;

  let html = '';
  window.JT_PROFILE.arsenal.forEach(group => {
    const pills = group.items.map(item => `
      <span class="arsenal-pill">
        <span class="pill-dot"></span>${item}
      </span>
    `).join('');

    html += `
      <div class="arsenal-card glass-card">
        <h4 class="arsenal-cat">${group.category}</h4>
        <div class="arsenal-pills">
          ${pills}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Populate Achievements
function populateAchievements() {
  const container = document.getElementById('achievementsContainer');
  if (!container || !window.JT_PROFILE) return;

  let html = '';
  window.JT_PROFILE.achievements.forEach(ach => {
    html += `
      <div class="ach-item glass-card ${ach.unlocked ? 'unlocked' : 'locked'}" id="${ach.id}">
        <div class="ach-icon">${ach.icon}</div>
        <div class="ach-info">
          <div class="ach-title">${ach.title}</div>
          <div class="ach-desc">${ach.desc}</div>
        </div>
        <div class="ach-status">${ach.unlocked ? 'UNLOCKED' : 'LOCKED'}</div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Inspect Mission Modal
window.openMissionModal = function(missionId) {
  const mission = window.JT_PROFILE.missions.find(m => m.id === missionId);
  if (!mission) return;

  if (window.soundEngine) window.soundEngine.playSelect();

  const modal = document.getElementById('inspectModal');
  const modalBody = document.getElementById('inspectModalBody');

  let metricsDetail = '';
  for (const [k, v] of Object.entries(mission.metrics)) {
    metricsDetail += `<div class="detail-metric-badge"><strong>${k}:</strong> ${v}</div>`;
  }

  modalBody.innerHTML = `
    <div class="blueprint-modal">
      <div class="blueprint-header">
        <span class="modal-badge">${mission.tier}</span>
        <span class="modal-code">${mission.code}</span>
        <h2>${mission.title}</h2>
        <div class="modal-org">${mission.org} &bull; ${mission.period}</div>
      </div>
      
      <div class="blueprint-section">
        <h3>MISSION OBJECTIVE</h3>
        <p>${mission.summary}</p>
      </div>

      <div class="blueprint-section">
        <h3>KEY METRICS & PRODUCTION DISPATCH</h3>
        <div class="modal-metrics-grid">
          ${metricsDetail}
        </div>
      </div>

      <div class="blueprint-section">
        <h3>ARCHITECTURAL DELIVERABLES</h3>
        <ul class="modal-list">
          ${mission.deliverables.map(d => `<li>${d}</li>`).join('')}
        </ul>
      </div>

      <div class="blueprint-section">
        <h3>TECH ARSENAL APPLIED</h3>
        <div class="modal-tags">
          ${mission.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `;

  modal.classList.add('visible');
};

window.closeInspectModal = function() {
  const modal = document.getElementById('inspectModal');
  if (modal && modal.classList.contains('visible')) {
    modal.classList.remove('visible');
    if (window.soundEngine) window.soundEngine.playSelect();
  }
};

// Telemetry & FPS Counter
function setupTelemetry() {
  const fpsEl = document.getElementById('fpsValue');
  let frameCount = 0;
  let lastTime = performance.now();

  function calcFps() {
    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (now - lastTime));
      if (fpsEl) fpsEl.textContent = `${fps} FPS`;
      frameCount = 0;
      lastTime = now;
    }
    requestAnimationFrame(calcFps);
  }
  requestAnimationFrame(calcFps);

  // Live timestamp clock
  const timeEl = document.getElementById('hudTime');
  function updateTime() {
    if (timeEl) {
      const d = new Date();
      timeEl.textContent = d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    }
  }
  setInterval(updateTime, 1000);
  updateTime();
}

// HUD Controls (Desktop & Mobile Drawer)
function setupHUDControls() {
  const audioBtns = [document.getElementById('toggleAudioBtn'), document.getElementById('mAudioBtn')];
  const crtBtns = [document.getElementById('toggleCrtBtn'), document.getElementById('mCrtBtn')];

  audioBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        if (window.soundEngine) {
          const isMuted = window.soundEngine.toggleMute();
          updateAudioUI(isMuted);
        }
      });
    }
  });

  crtBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        toggleCRT();
      });
    }
  });
}

window.updateAudioUI = function(isMuted) {
  const btns = [document.getElementById('toggleAudioBtn'), document.getElementById('mAudioBtn')];
  btns.forEach(btn => {
    if (btn) {
      btn.classList.toggle('active', !isMuted);
      const textEl = btn.querySelector('.hud-ctrl-text');
      if (textEl) textEl.textContent = isMuted ? 'SFX: OFF' : 'SFX: ON';
    }
  });
};

window.toggleCRT = function() {
  const body = document.body;
  const isCrt = body.classList.toggle('crt-active');
  const btns = [document.getElementById('toggleCrtBtn'), document.getElementById('mCrtBtn')];
  btns.forEach(btn => {
    if (btn) {
      btn.classList.toggle('active', isCrt);
      const textEl = btn.querySelector('.hud-ctrl-text');
      if (textEl) textEl.textContent = isCrt ? 'CRT: ON' : 'CRT: OFF';
    }
  });
  if (window.soundEngine) window.soundEngine.playSelect();
};

// Secret Easter Egg Achievement
window.triggerSecretAchievement = function() {
  const achEl = document.getElementById('ach-5');
  if (achEl) {
    achEl.classList.remove('locked');
    achEl.classList.add('unlocked');
    achEl.querySelector('.ach-status').textContent = 'UNLOCKED';
  }

  const banner = document.getElementById('achievementBanner');
  if (banner) {
    banner.classList.add('visible');
    if (window.soundEngine) window.soundEngine.playAchievement();
    setTimeout(() => {
      banner.classList.remove('visible');
    }, 4500);
  }
};

// Contact Form & Quick Copy
function setupContactForm() {
  const form = document.getElementById('commsForm');
  const statusEl = document.getElementById('commsStatus');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (window.soundEngine) window.soundEngine.playSelect();

      const name = form.querySelector('#commName').value;
      const email = form.querySelector('#commEmail').value;
      const subject = form.querySelector('#commSubject').value;
      const message = form.querySelector('#commMessage').value;

      statusEl.innerHTML = `<span class="sending">ENCRYPTING & DISPATCHING PACKET TO KINGSTON HUB...</span>`;

      setTimeout(() => {
        statusEl.innerHTML = `<span class="success">TRANSMISSION CONFIRMED. PACKET DELIVERED TO JUSTIN.JAYTAYLOR@GMAIL.COM</span>`;
        if (window.soundEngine) window.soundEngine.playAchievement();
        form.reset();

        // Also prepare mailto link as instant fallback
        const mailto = `mailto:justin.jaytaylor@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
        window.open(mailto, '_blank');
      }, 1000);
    });
  }

  // Copy Email Button
  const copyBtn = document.getElementById('copyEmailBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('justin.jaytaylor@gmail.com').then(() => {
        if (window.soundEngine) window.soundEngine.playSelect();
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'COPIED TO CLIPBOARD!';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2200);
      });
    });
  }
}
