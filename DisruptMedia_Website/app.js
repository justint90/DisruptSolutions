/* ==========================================================================
   Disrupt Media — Core Application Script
   Engineered under design-taste-frontend standards
   Features: Active Nav Spy, Interactive Cinema Modals & Consultation API
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initServicePills();
  initContactForm();
});

/* ==========================================================================
   1. Navigation & Mobile Menu Controller
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

  // Active section scroll spy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   2. Service Focus Pills Selector
   ========================================================================== */
function initServicePills() {
  const pills = document.querySelectorAll('.service-pill');
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
   3. Production Modal / Blueprint Deep Dives
   ========================================================================== */
const productionsData = {
  sovereign: {
    title: "The Sovereign Narrative Series",
    badge: "Docu-Series · 8K Cine Capture",
    image: "assets/sovereign_doc_still.jpg",
    overview: "A flagship 4-part episodic documentary produced by Disrupt Media, profiling institutional modernization, sovereign digital identity, and technological autonomy in emerging economies.",
    deliverables: [
      "4x 12-Minute 8K Master Films",
      "24x Vertical Syndication Cuts",
      "Custom Orchestral & Electronic Score",
      "Global Institutional Press Kit"
    ],
    metrics: [
      { label: "Organic Reach", value: "4.2M+" },
      { label: "Completion Rate", value: "88%" },
      { label: "Syndication", value: "14 Global Outlets" }
    ],
    directorNote: "Filmed over 60 shooting days with custom anamorphic optics. Engineered to reposition institutional perception with cinematic gravitas."
  },
  apex: {
    title: "Apex Velocity Launch Campaign",
    badge: "Commercial Film · Broadcast 60s",
    image: "assets/apex_velocity_still.jpg",
    overview: "High-octane commercial campaign combining precision camera vehicle tracking rigs, practical neon lighting installations, and spatial sound design engineered for maximum sensory capture.",
    deliverables: [
      "60s Cinema Broadcast Master",
      "30s TV Commercial Spot",
      "15s High-Frequency Social Cuts",
      "Dolby Atmos Audio Master"
    ],
    metrics: [
      { label: "Total Views", value: "3.1M+" },
      { label: "Completion Rate", value: "92%" },
      { label: "Direct Lift", value: "4.8x Conversion" }
    ],
    directorNote: "Paced to rhythm. Every cut, camera whip, and sound transient was synchronized to psychological engagement beats."
  },
  interception: {
    title: "Market Interception Manifesto",
    badge: "Brand Story BOS · Flagship Campaign",
    image: "assets/manifesto_bos_still.jpg",
    overview: "A comprehensive brand narrative transformation for an established regional financial enterprise, replacing legacy corporate messaging with a fierce cultural manifesto.",
    deliverables: [
      "Brand Manifesto Film (3m 30s)",
      "Executive Keynote Visual Package",
      "Brand Story BOS Architectural Guide",
      "Cross-Platform Social Grid Matrix"
    ],
    metrics: [
      { label: "Territory Reach", value: "8 States" },
      { label: "Positive Sentiment Lift", value: "+74%" },
      { label: "Brand Equity Duration", value: "Multi-Year" }
    ],
    directorNote: "Media designed to hold a market position. When an enterprise speaks with absolute clarity, category inertia shifts."
  }
};

window.openProductionModal = function(id) {
  const modal = document.getElementById('production-modal');
  const body = document.getElementById('modal-body-content');
  const data = productionsData[id];

  if (!modal || !body || !data) return;

  body.innerHTML = `
    <div class="mb-6">
      <div class="rounded-xl overflow-hidden mb-5 border border-white/10 relative max-h-60 bg-black">
        <img src="${data.image}" alt="${data.title}" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-[#0e0c15] via-transparent to-transparent opacity-70"></div>
        <span class="absolute top-3 left-3 font-mono text-[10px] font-bold text-rose-300 tracking-[0.14em] uppercase px-2.5 py-1 rounded bg-[#07070a]/90 border border-rose-500/40">
          ${data.badge}
        </span>
      </div>
      
      <h2 class="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight mb-3">
        ${data.title}
      </h2>
      <p class="text-sm sm:text-base text-slate-300 leading-relaxed">
        ${data.overview}
      </p>
    </div>

    <!-- Metrics Ribbon -->
    <div class="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#07070a] border border-white/10 mb-6 text-center font-mono">
      ${data.metrics.map(m => `
        <div>
          <span class="font-display font-extrabold text-lg sm:text-xl text-rose-400 block">${m.value}</span>
          <span class="text-[10px] text-slate-400 uppercase tracking-wider">${m.label}</span>
        </div>
      `).join('')}
    </div>

    <div class="bg-[#07070a] border border-white/10 rounded-xl p-5 mb-6">
      <h3 class="font-mono text-xs font-bold text-slate-300 tracking-wider uppercase mb-3">
        Production Deliverables
      </h3>
      <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300">
        ${data.deliverables.map(d => `<li class="flex items-center gap-2"><span class="text-rose-500 font-bold">▹</span> ${d}</li>`).join('')}
      </ul>
    </div>

    <div class="border-l-2 border-rose-500 pl-4 py-1 mb-6">
      <span class="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Director's POV</span>
      <p class="text-xs sm:text-sm text-slate-200 italic leading-relaxed">"${data.directorNote}"</p>
    </div>

    <div class="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
      <a href="#contact" class="tactile-btn inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-display font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow-crimson-btn" onclick="closeProductionModal()">
        Book Consultation ➔
      </a>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeProductionModal = function() {
  const modal = document.getElementById('production-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Close on backdrop click
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
   4. Consultation Intake Form Handler
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    feedback.className = 'hidden mt-4 p-3.5 rounded-lg text-sm text-center';
    feedback.innerText = '';

    const submitBtn = form.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('span:first-child');
    const loader = submitBtn.querySelector('.loader');

    submitBtn.disabled = true;
    loader.classList.remove('hidden');
    const originalText = btnText.innerText;
    btnText.innerText = 'Transmitting Production Brief...';

    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      service: formData.get('service') || 'Commercial Video Production',
      budget: formData.get('budget') || '$25,000 – $50,000',
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
        feedback.innerText = result.message || 'Thank you. Your inquiry has been received by our executive producers.';
        feedback.className = 'feedback-box success mt-4 p-3.5 rounded-lg text-sm text-center block';
        form.reset();
      } else {
        feedback.innerText = result.message || 'Submission failed. Please verify your details.';
        feedback.className = 'feedback-box error mt-4 p-3.5 rounded-lg text-sm text-center block';
      }
    } catch (error) {
      console.error('[Disrupt Media Form Error]', error);
      feedback.innerText = 'Network connection failed. Please contact media@disruptgrp.com directly.';
      feedback.className = 'feedback-box error mt-4 p-3.5 rounded-lg text-sm text-center block';
    } finally {
      submitBtn.disabled = false;
      loader.classList.add('hidden');
      btnText.innerText = originalText;
    }
  });
}

