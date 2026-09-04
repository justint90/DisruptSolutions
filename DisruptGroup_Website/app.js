/* ==========================================================================
   Disrupt Solutions - Frontend Core Application Script
   Contains: Particle Canvas, Navigation Routing, Modals, & Form Submissions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initNavigation();
  initContactForm();
  initCinematicShowcase();
});

/* ==========================================================================
   1. Cinematic Particle Canvas Background
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null, radius: 120 };

  // Adjust canvas bounds
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    createParticles();
  }
  
  // Track cursor coordinates
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Blueprint
  class Particle {
    constructor(x, y, vx, vy, size) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.size = size;
      this.alpha = Math.random() * 0.5 + 0.1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(6, 182, 212, ${this.alpha})`;
      ctx.fill();
    }

    update() {
      // Bounce against edges
      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

      // Update positions
      this.x += this.vx;
      this.y += this.vy;

      // Push particles away from mouse
      if (mouse.x !== null && mouse.y !== null) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouse.radius) {
          let force = (mouse.radius - dist) / mouse.radius;
          let dirX = dx / dist;
          let dirY = dy / dist;
          this.x += dirX * force * 3;
          this.y += dirY * force * 3;
        }
      }
    }
  }

  // Populate network nodes
  function createParticles() {
    particles = [];
    // Adjust density based on screen size
    const particleCount = Math.floor((canvas.width * canvas.height) / 14000);
    
    for (let i = 0; i < Math.min(particleCount, 120); i++) {
      const size = Math.random() * 1.5 + 1;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const vx = (Math.random() - 0.5) * 0.4;
      const vy = (Math.random() - 0.5) * 0.4;
      particles.push(new Particle(x, y, vx, vy, size));
    }
  }

  // Render & link nodes
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Connect close particles with lines
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 110) {
          // Adjust line visibility based on proximity
          let lineAlpha = (110 - dist) / 110 * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Connect particle to mouse
      if (mouse.x !== null && mouse.y !== null) {
        let dx = particles[i].x - mouse.x;
        let dy = particles[i].y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let lineAlpha = (mouse.radius - dist) / mouse.radius * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  // Bind Listeners
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  animate();
}

/* ==========================================================================
   2. Navigation System & Interactive UI Links
   ========================================================================== */
function initNavigation() {
  const sections = document.querySelectorAll('main > section');
  const navItems = document.querySelectorAll('.nav-item');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  // Highlight navigation item on scroll
  window.addEventListener('scroll', () => {
    let currentId = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        currentId = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentId}`) {
        item.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggling
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      mobileNav.classList.toggle('active');
    });

    // Close mobile nav when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        mobileNav.classList.remove('active');
      });
    });
  }
}

/* ==========================================================================
   3. Portfolio Library & Modal Logic
   ========================================================================== */
const PORTFOLIO_ITEMS = {
  'hazel': {
    title: 'Hazel: Autonomous Trading Engine',
    subtitle: 'Disrupt Solutions · Production AI & Scalable Tech',
    tags: ['Deterministic Trading Strategy', 'Autonomous Agent Engine', 'Zero-Latency Execution', 'Production AI'],
    metrics: [
      { val: '100%', lbl: 'Deterministic Engine' },
      { val: 'Live', lbl: 'Production AI' },
      { val: '&lt; 15ms', lbl: 'Order Routing Latency' }
    ],
    content: `
      <h3>The Interception Thesis</h3>
      <p>Financial trading infrastructure traditionally required sprawling developer headcounts and expensive manual monitoring shifts. The Disrupt Solutions thesis was simple: a completely deterministic, autonomous trading engine could execute and manage complex risk-bounded strategies without human friction or drift.</p>

      <h3>System Architecture & Engineering</h3>
      <p>Hazel was architected as an autonomous trading agent running end-to-end deterministic quantitative strategies. Built on a low-latency execution harness with strict invariant validation, Hazel manages automated risk calculations, tick data stream ingestion, and millisecond-grade execution without runtime human intervention.</p>

      <h3>Proof in Production</h3>
      <p>Hazel is live in production — serving as tangible evidence that Disrupt Solutions ships AI agents that operate reliably under live capital conditions rather than sandboxed prototypes.</p>
    `
  },
  'disruptors': {
    title: 'The Disruptors: Documentary Series',
    subtitle: 'Disrupt Media · Story & Narrative Infrastructure',
    tags: ['Faceless Documentary Series', 'Brand OS', 'Content Intelligence', 'Campaign Media'],
    metrics: [
      { val: 'Global', lbl: 'Audience Reach' },
      { val: 'Series', lbl: 'Campaign Media' },
      { val: '100%', lbl: 'Editorial Autonomy' }
    ],
    content: `
      <h3>The Interception Thesis</h3>
      <p>A brand is the story people tell when you're not in the room. Standard agency video production focuses on ephemeral corporate ads that leave zero lasting cultural footprint. Disrupt Media created <em>The Disruptors</em> as a cinematic documentary vehicle to dissect how category-defining operators intercept markets.</p>

      <h3>Media & Narrative Architecture</h3>
      <p>Engineered using Disrupt Media's proprietary Brand Operating System (BOS), the series combines faceless storytelling, high-contrast visual pacing, deep archival investigative research, and synchronized digital distribution across global streaming channels.</p>

      <h3>Proof of Impact</h3>
      <p><em>The Disruptors</em> proved that high-depth intellectual media builds deeper institutional trust and audience compounding than traditional paid advertising campaigns.</p>
    `
  },
  'meta-research': {
    title: "Meta's Legal Exposure: Market Interception Teardown",
    subtitle: 'Disrupt Group · Market Signals & POV Research',
    tags: ['Regulatory Exposure Teardown', 'Pre-Market Analysis', 'Market Signals', 'Category Repricing'],
    metrics: [
      { val: 'Pre-Market', lbl: 'Analysis Timing' },
      { val: 'Published', lbl: 'Signal Whitepaper' },
      { val: '100%', lbl: 'Original Research' }
    ],
    content: `
      <h3>The Interception Thesis</h3>
      <p>Disrupt Group publishes research before the market reprices. When antitrust, privacy, and regulatory litigations mounted against major social tech monopolies, we conducted a structural teardown of Meta's legal exposure and the fragility of ad-funded social data graphs.</p>

      <h3>Research Methodology & Findings</h3>
      <p>Our research revealed that systemic regulatory fines, app-tracking transparency constraints, and rising litigation risks would force an irreversible shift towards private federated infrastructure, decentralized monetization, and sovereign AI tooling.</p>

      <h3>The Receipt</h3>
      <p>This teardown serves as a published receipt of how Disrupt Group identifies tectonic market shifts months before they become mainstream consensus.</p>
    `
  },
  'slu-eats': {
    title: 'SLU Eats Delivery Engine',
    subtitle: 'Disrupt Solutions · Autonomous Logistics & Real-Time Dispatch',
    tags: ['Real-Time Dispatching', 'Interactive Drivers Map', 'Merchant Portals', 'Operational Logistics'],
    metrics: [
      { val: '50K+', lbl: 'Monthly Deliveries' },
      { val: '&lt; 1.2s', lbl: 'Dispatch Coordination' },
      { val: '+94%', lbl: 'Driver Utilization' }
    ],
    content: `
      <h3>The Challenge</h3>
      <p>As a key logistics subsidiary within the Disrupt Group ecosystem, SLU Eats required an on-demand food logistics system capable of handling high-velocity concurrent delivery orders without human dispatch bottlenecks.</p>

      <h3>Our Solution & System Architecture</h3>
      <p>Disrupt Solutions engineered a real-time WebSockets dispatching engine backed by spatial indexing. The engine automatically matches orders to the nearest optimal drivers within 1.2 seconds and computes intelligent multi-stop route batching to reduce trip latency and fuel overhead.</p>

      <h3>Quantified Production Value</h3>
      <p>In live production, SLU Eats scales past 50,000 monthly orders with automated dispatch coordination latency under 1.2 seconds and a 94% improvement in driver utilization.</p>
    `
  },
  'disrupt-marketplace': {
    title: 'Disrupt Marketplace Platform',
    subtitle: 'Disrupt Solutions · Payment Mesh & Enterprise Infrastructure',
    tags: ['E-Commerce Engines', 'Payment Gateways', 'Multi-Currency Processing', 'Merchant Settlement'],
    metrics: [
      { val: '8 States', lbl: 'Payment Coverage' },
      { val: '99.99%', lbl: 'Gateway Uptime' },
      { val: '-40%', lbl: 'Transaction Fees' }
    ],
    content: `
      <h3>The Challenge</h3>
      <p>Regional merchants faced fragmented banking rails, complex multi-currency settlements, and high processing fees from international payment gateways.</p>

      <h3>Our Solution & System Architecture</h3>
      <p>Disrupt Solutions built a unified multi-territory e-commerce engine and custom payment aggregation gateway. The infrastructure connects Caribbean bank clearing networks into a single API endpoint with multi-currency handling, automatic tax calculation, and automated merchant settlements.</p>

      <h3>Quantified Production Value</h3>
      <p>The gateway maintains 99.99% verified uptime across 8 Caribbean island states, reducing processing overhead by 40% for active vendors.</p>
    `
  }
};

function openPortfolio(key) {
  const data = PORTFOLIO_ITEMS[key];
  if (!data) return;

  const modal = document.getElementById('portfolio-modal');
  const container = document.getElementById('modal-body-content');

  // Build metrics HTML
  const metricsHTML = data.metrics.map(m => `
    <div class="metric">
      <span class="metric-val">${m.val}</span>
      <span class="metric-lbl">${m.lbl}</span>
    </div>
  `).join('');

  // Build tags HTML
  const tagsHTML = data.tags.map(t => `
    <span class="tech-tag">${t}</span>
  `).join('');

  container.innerHTML = `
    <div class="modal-header-section">
      <span class="section-subtitle">${data.subtitle}</span>
      <h2>${data.title}</h2>
      <div style="margin-top: 12px; display: flex; flex-wrap: wrap;">
        ${tagsHTML}
      </div>
    </div>
    <div class="card-metrics" style="margin-bottom: 30px;">
      ${metricsHTML}
    </div>
    <div class="modal-body-section">
      ${data.content}
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Stop scrolling behind modal
}

function closePortfolio() {
  const modal = document.getElementById('portfolio-modal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modal if user clicks outside of container
window.addEventListener('click', (e) => {
  const modal = document.getElementById('portfolio-modal');
  if (e.target === modal) {
    closePortfolio();
  }
});

// Close modal on Escape key press
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    const modal = document.getElementById('portfolio-modal');
    if (modal && modal.classList.contains('active')) {
      closePortfolio();
    }
  }
});

/* ==========================================================================
   4. Contact Form Submission (MySQL Integration)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset feedback layout
    feedback.className = 'form-feedback hidden';
    feedback.innerText = '';

    // Show loading indicator
    const submitBtn = form.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('span');
    const loader = submitBtn.querySelector('.loader');

    submitBtn.disabled = true;
    loader.classList.remove('hidden');
    const originalText = btnText.innerText;
    btnText.innerText = 'Transmitting Request...';

    // Build payload
    const formData = new FormData(form);
    const selectedService = formData.get('service') || 'General Inquiry';
    const descriptionText = formData.get('description');
    const combinedDescription = `[Service Interest: ${selectedService}]\n${descriptionText}`;

    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      description: combinedDescription
    };

    try {
      console.log('[Contact Form] Sending submission to local API server...');
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        feedback.innerText = result.message;
        feedback.classList.remove('hidden');
        feedback.className = 'form-feedback success';
        
        // Log storage information
        if (result.storage === 'mysql') {
          console.log('[Contact Form] Success: Saved in local MySQL database.');
        } else {
          console.log('[Contact Form] Success: Saved in local JSON file (Database Fallback).');
        }

        form.reset(); // Clear input fields
      } else {
        feedback.innerText = result.message || 'Submission failed. Please verify your details.';
        feedback.classList.remove('hidden');
        feedback.className = 'form-feedback error';
      }
    } catch (error) {
      console.error('[Contact Form Error] Server request failed:', error);
      feedback.innerText = 'Network error: Connection to backend API server refused. Please check if server.js is running.';
      feedback.classList.remove('hidden');
      feedback.className = 'form-feedback error';
    } finally {
      // Re-enable form controls
      submitBtn.disabled = false;
      loader.classList.add('hidden');
      btnText.innerText = originalText;
    }
  });

  // Service Selection Pills Handler
  const pillButtons = document.querySelectorAll('.pill-btn');
  const serviceInput = document.getElementById('selected-service');

  pillButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      pillButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (serviceInput) {
        serviceInput.value = btn.getAttribute('data-service');
      }
    });
  });
}

/* ==========================================================================
   5. Cinematic Remotion Scroll Showcase Engine (Hero Integration)
   ========================================================================== */
function initCinematicShowcase() {
  const section = document.getElementById('hero') || document.getElementById('cinematic-experience');
  const video = document.getElementById('cinematic-video');
  if (!section || !video) return;

  const hudPhaseLabel = document.getElementById('hud-phase-label');
  const hudProgressText = document.getElementById('hud-progress-text');
  const hudFrameText = document.getElementById('hud-frame-text');
  const timelineFill = document.getElementById('timeline-fill');
  const timelineNodes = document.querySelectorAll('.timeline-node');
  const storyCards = document.querySelectorAll('.narrative-layer, .story-card');
  const playToggleBtn = document.getElementById('cinematic-play-toggle');
  const playBtnText = document.getElementById('play-btn-text');

  let isAutoplaying = false;
  let targetProgress = 0;
  let currentProgress = 0;
  let videoDuration = 8.0; // 240 frames at 30 fps
  let isSeeking = false;
  let animationFrameId = null;

  // Ensure video metadata is loaded
  video.addEventListener('loadedmetadata', () => {
    if (video.duration && !isNaN(video.duration)) {
      videoDuration = video.duration;
    }
  });

  // Prepare video element
  video.muted = true;
  video.playsInline = true;
  video.currentTime = 0.001;

  // Calculate target progress from scroll position
  function calculateScrollProgress() {
    if (isAutoplaying) return;

    const rect = section.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const sectionHeight = section.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollableDistance = sectionHeight - windowHeight;

    if (scrollableDistance <= 0) {
      targetProgress = 0;
      return;
    }

    const scrolled = window.scrollY - sectionTop;
    const rawProgress = scrolled / scrollableDistance;
    targetProgress = Math.max(0, Math.min(1, rawProgress));
  }

  // Phase Definitions for Disrupt Solutions
  const phases = [
    { name: 'PHASE 01: INTELLIGENCE FIRST', min: 0.0, max: 0.25, phaseIndex: 1, nodeIdx: 0 },
    { name: 'PHASE 02: CAPABILITIES', min: 0.25, max: 0.60, phaseIndex: 2, nodeIdx: 1 },
    { name: 'PHASE 03: RECEIPTS', min: 0.60, max: 0.85, phaseIndex: 3, nodeIdx: 2 },
    { name: 'PHASE 04: DEPLOY & SCALE', min: 0.85, max: 1.01, phaseIndex: 4, nodeIdx: 3 }
  ];

  function updateHUDAndStory(progress) {
    const percent = Math.round(progress * 100);
    const frame = Math.min(240, Math.round(progress * 240));

    if (hudProgressText) hudProgressText.innerText = `SCROLL: ${percent}%`;
    if (hudFrameText) hudFrameText.innerText = `FRAME: ${frame} / 240`;
    if (timelineFill) timelineFill.style.width = `${percent}%`;

    // Find current active phase
    const activePhase = phases.find(p => progress >= p.min && progress < p.max) || phases[0];

    if (hudPhaseLabel && hudPhaseLabel.innerText !== activePhase.name) {
      hudPhaseLabel.innerText = activePhase.name;
    }

    // Update story cards
    storyCards.forEach(card => {
      const cardPhase = parseInt(card.getAttribute('data-phase'), 10);
      if (cardPhase === activePhase.phaseIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Update timeline node buttons
    timelineNodes.forEach((node, idx) => {
      if (idx === activePhase.nodeIdx) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });
  }

  // Smooth render loop using Linear Interpolation (lerp)
  function renderLoop() {
    if (isAutoplaying) {
      // In autoplay mode, progress is driven by video playback
      if (video.duration) {
        currentProgress = video.currentTime / video.duration;
        updateHUDAndStory(currentProgress);
      }
    } else {
      if (!video.paused) {
        video.pause();
      }

      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0005) {
        currentProgress += diff * 0.22;
      } else {
        currentProgress = targetProgress;
      }

      // Sync video currentTime
      const targetTime = currentProgress * videoDuration;
      if (Math.abs(video.currentTime - targetTime) > 0.03 && !isSeeking) {
        isSeeking = true;
        if ('fastSeek' in video) {
          video.fastSeek(targetTime);
          isSeeking = false;
        } else {
          video.currentTime = targetTime;
          isSeeking = false;
        }
      }

      updateHUDAndStory(currentProgress);
    }

    animationFrameId = requestAnimationFrame(renderLoop);
  }

  // Scroll listener
  window.addEventListener('scroll', calculateScrollProgress, { passive: true });
  window.addEventListener('resize', calculateScrollProgress, { passive: true });

  // Initial calculation and start loop
  calculateScrollProgress();
  currentProgress = targetProgress;
  renderLoop();

  // Timeline node click navigation
  timelineNodes.forEach(node => {
    node.addEventListener('click', () => {
      if (isAutoplaying) {
        toggleAutoplay(false);
      }
      const targetNodeProgress = parseFloat(node.getAttribute('data-target-progress'));
      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const scrollableDistance = section.offsetHeight - window.innerHeight;
      const targetScrollY = sectionTop + targetNodeProgress * scrollableDistance;

      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth'
      });
    });
  });

  // Autoplay / Scroll Scrub toggle
  function toggleAutoplay(forceState) {
    isAutoplaying = typeof forceState === 'boolean' ? forceState : !isAutoplaying;
    
    if (isAutoplaying) {
      video.loop = true;
      video.play().catch(err => console.log('Autoplay was prevented:', err));
      if (playBtnText) playBtnText.innerText = 'Pause & Scrub';
      if (playToggleBtn) playToggleBtn.classList.add('playing');
    } else {
      video.pause();
      if (playBtnText) playBtnText.innerText = 'Autoplay Video';
      if (playToggleBtn) playToggleBtn.classList.remove('playing');
      calculateScrollProgress();
    }
  }

  if (playToggleBtn) {
    playToggleBtn.addEventListener('click', () => toggleAutoplay());
  }
}

