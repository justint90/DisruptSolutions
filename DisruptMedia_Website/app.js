/* ==========================================================================
   Disrupt Media - Frontend Core Application Script
   Contains: Media Particle Canvas, Navigation Routing, Lightbox Modals & Form
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMediaCanvas();
  initNavigation();
  initContactForm();
  initServicePills();
});

/* ==========================================================================
   1. Cinematic Media Particle & Wave Canvas Background
   ========================================================================== */
function initMediaCanvas() {
  const canvas = document.getElementById('media-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    createParticles();
  }

  window.addEventListener('resize', resize);

  class MediaParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.color = Math.random() > 0.4 ? '244, 63, 94' : '251, 113, 133';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 16000), 80);
    for (let i = 0; i < count; i++) {
      particles.push(new MediaParticle());
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw ambient cinematic wave curves
    const time = Date.now() * 0.001;
    ctx.beginPath();
    for (let x = 0; x < width; x += 10) {
      const y = Math.sin(x * 0.005 + time) * 35 + Math.cos(x * 0.008 - time) * 20 + height * 0.5;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.08)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Render particles and connecting energy vectors
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(244, 63, 94, ${(1 - dist / 120) * 0.12})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  resize();
  render();
}

/* ==========================================================================
   2. Navigation & Mobile Menu Handler
   ========================================================================== */
function initNavigation() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-item, .mobile-nav-btn');

  if (toggleBtn && mobileNav) {
    toggleBtn.addEventListener('click', () => {
      toggleBtn.classList.toggle('open');
      mobileNav.classList.toggle('active');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleBtn.classList.remove('open');
        mobileNav.classList.remove('active');
      });
    });
  }

  // Active section scroll tracking
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   3. Service Pills Selector
   ========================================================================== */
function initServicePills() {
  const pills = document.querySelectorAll('.pill-btn');
  const hiddenInput = document.getElementById('selected-service');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (hiddenInput) {
        hiddenInput.value = pill.getAttribute('data-service');
      }
    });
  });
}

/* ==========================================================================
   4. Production Modal / Lightbox Deep Dives
   ========================================================================== */
const productionsData = {
  sovereign: {
    title: "The Sovereign Narrative Series",
    badge: "Docu-Series · 8K Cine",
    overview: "A flagship 4-part episodic documentary produced by Disrupt Media, profiling institutional modernization, sovereign digital identity, and technological autonomy in emerging economies.",
    deliverables: ["4x 12-Minute 8K Master Films", "24x Vertical Syndicate Cuts", "Custom Orchestral & Electronic Score", "Global Press Media Kit"],
    metrics: { views: "4.2M+", retention: "88%", channels: "14 Global Outlets" },
    directorNote: "Filmed over 60 shooting days with custom anamorphic optics. Engineered to reposition institutional perception with cinematic gravitas."
  },
  apex: {
    title: "Apex Velocity Launch Campaign",
    badge: "Commercial Film · Broadcast",
    overview: "High-octane commercial campaign combining high-speed tracking vehicle rigs, practical neon lighting installations, and sound design engineered for maximum sensory capture.",
    deliverables: ["60s Cinema Broadcast Master", "30s TV Spot", "15s High-Frequency Social Cuts", "Dolby Atmos Audio Master"],
    metrics: { views: "3.1M+", completion: "92%", roi: "4.8x Direct Conversion" },
    directorNote: "Paced to rhythm. Every cut, camera whip, and sound transient was synchronized to psychological engagement beats."
  },
  interception: {
    title: "Market Interception Manifesto",
    badge: "Brand Story BOS · Flagship",
    overview: "A comprehensive brand narrative transformation for an established regional financial enterprise, replacing legacy corporate messaging with a fierce cultural manifesto.",
    deliverables: ["Brand Manifesto Film (3m 30s)", "Executive Keynote Visual Package", "Brand Story BOS Book", "Cross-Platform Social Grid"],
    metrics: { reach: "8 Island States", sentiment: "+74% Positive Lift", duration: "Compounds Over Years" },
    directorNote: "Media designed to hold a market position. When an enterprise speaks with absolute clarity, market inertia shifts."
  }
};

function openProductionModal(id) {
  const modal = document.getElementById('production-modal');
  const body = document.getElementById('modal-body-content');
  const data = productionsData[id];

  if (!modal || !body || !data) return;

  body.innerHTML = `
    <div style="margin-bottom: 20px;">
      <span style="font-family: var(--font-mono); font-size: 10px; font-weight: 700; color: var(--accent-rose); letter-spacing: 0.16em; text-transform: uppercase;">
        ${data.badge}
      </span>
      <h2 style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; color: #ffffff; margin-top: 6px; margin-bottom: 12px;">
        ${data.title}
      </h2>
      <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.65; margin-bottom: 20px;">
        ${data.overview}
      </p>
    </div>

    <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px; margin-bottom: 20px;">
      <h3 style="font-family: var(--font-mono); font-size: 11.5px; font-weight: 700; color: var(--accent-rose-light); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 12px;">
        Key Production Deliverables
      </h3>
      <ul style="list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        ${data.deliverables.map(d => `<li style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px;"><span style="color: var(--accent-rose);">▹</span> ${d}</li>`).join('')}
      </ul>
    </div>

    <div style="border-left: 3px solid var(--accent-rose); padding-left: 16px; margin-bottom: 24px;">
      <span style="font-family: var(--font-mono); font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 4px;">Director's Point of View</span>
      <p style="font-size: 0.90rem; color: #ffffff; font-style: italic; line-height: 1.55;">"${data.directorNote}"</p>
    </div>

    <div style="display: flex; gap: 12px; justify-content: flex-end;">
      <a href="#contact" class="btn-primary" onclick="closeProductionModal()">Commission Similar Project ➔</a>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductionModal() {
  const modal = document.getElementById('production-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close on modal backdrop click
window.addEventListener('click', (e) => {
  const modal = document.getElementById('production-modal');
  if (e.target === modal) {
    closeProductionModal();
  }
});

// Close on Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProductionModal();
  }
});

/* ==========================================================================
   5. Consultation Intake Form Submission Handler
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    feedback.className = 'form-feedback hidden';
    feedback.innerText = '';

    const submitBtn = form.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('span');
    const loader = submitBtn.querySelector('.loader');

    submitBtn.disabled = true;
    loader.classList.remove('hidden');
    const originalText = btnText.innerText;
    btnText.innerText = 'Transmitting Brief...';

    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      service: formData.get('service') || 'Commercial Video Production',
      budget: formData.get('budget') || 'Flexible',
      description: formData.get('description')
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        feedback.innerText = result.message;
        feedback.className = 'form-feedback success';
        feedback.classList.remove('hidden');
        form.reset();
      } else {
        feedback.innerText = result.message || 'Submission failed. Please verify your details.';
        feedback.className = 'form-feedback error';
        feedback.classList.remove('hidden');
      }
    } catch (error) {
      console.error('[Disrupt Media Form Error]', error);
      feedback.innerText = 'Network error: Connection to media server failed. Please check your connection.';
      feedback.className = 'form-feedback error';
      feedback.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      loader.classList.add('hidden');
      btnText.innerText = originalText;
    }
  });
}
