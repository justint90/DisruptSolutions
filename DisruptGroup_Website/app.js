/* ==========================================================================
   Disrupt Solutions - Frontend Core Application Script
   Contains: Particle Canvas, Navigation Routing, Modals, & Form Submissions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initNavigation();
  initContactForm();
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
  'slu-eats': {
    title: 'SLU Eats Delivery Engine',
    subtitle: 'On-Demand Food Logistics System under Disrupt Group',
    tags: ['Real-Time Dispatching', 'Interactive Drivers Map', 'Merchant Portals', 'Operational Logistics'],
    metrics: [
      { val: '50K+', lbl: 'Monthly Deliveries' },
      { val: '&lt; 1.2s', lbl: 'Dispatch Coordination' },
      { val: '+94%', lbl: 'Driver Utilization' }
    ],
    content: `
      <h3>The Challenge</h3>
      <p>As a key subsidiary of the Disrupt Group, SLU Eats needed to coordinate on-demand food deliveries across a rapidly growing network of restaurants, drivers, and consumers. Fragmented scheduling, inaccurate driver tracking, and manual order dispatching caused high latency, resulting in cold deliveries and low driver utilization rates.</p>

      <h3>Our Solution & System Architecture</h3>
      <p>We engineered a highly responsive, custom dispatching and delivery system. Built with real-time WebSockets and spatial indexing, the dispatcher matches orders to nearby active drivers within seconds. The system provides restaurants with dedicated tablets to confirm prep speeds and manages driver payouts automatically. Restaurants and delivery agents can sign up through our <a href="https://partners.slueats.com/" target="_blank" rel="noopener noreferrer">partner site</a>.</p>

      <h3>Workflow Tooling</h3>
      <p>We designed an intelligent route-batching utility that groups nearby orders going to the same neighborhood. Drivers receive optimal multi-stop route suggestions, which reduces overall delivery trip times and saves fuel.</p>

      <h3>Quantified Business Value</h3>
      <p>Since launch, SLU Eats scales to over 50,000 monthly orders smoothly. Automated dispatch latency fell below 1.2 seconds, and active driver utilization improved by 94%, establishing SLU Eats as St. Lucia's leading food delivery application. You can follow their latest updates on their <a href="https://www.instagram.com/slueatsdelivery/" target="_blank" rel="noopener noreferrer">Instagram page</a>.</p>
    `
  },
  'disrupt-marketplace': {
    title: 'Disrupt Marketplace Platform',
    subtitle: 'Caribbean Multi-Territory Online Marketplace & Payment Gateway',
    tags: ['E-Commerce Engines', 'Payment Gateways', 'Multi-Currency Processing', 'Merchant Settlement'],
    metrics: [
      { val: '8 States', lbl: 'Payment Coverage' },
      { val: '99.99%', lbl: 'Gateway Uptime' },
      { val: '-40%', lbl: 'Transaction Fees' }
    ],
    content: `
      <h3>The Challenge</h3>
      <p>Caribbean merchants face high barriers when setting up e-commerce stores due to fragmented national banking systems, complex multi-currency conversions, and high transaction processing fees from international gateways.</p>

      <h3>Our Solution & System Architecture</h3>
      <p>We designed and built Disrupt Marketplace: a unified e-commerce platform that enables regional vendors to set up custom storefronts instantly. Core to this platform is our custom-built payment gateway, which aggregates Caribbean bank clearing networks into a single API endpoint. The system supports multi-territory currency handling, local tax calculations, and merchant payouts.</p>

      <h3>Workflow Tooling</h3>
      <p>The platform features an automated merchant onboarding wizard, drag-and-drop catalog managers, and a real-time order tracking dashboard that synchronizes with local regional shipping carriers.</p>

      <h3>Quantified Business Value</h3>
      <p>The payment gateway now provides transaction processing across 8 Caribbean island states with a verified 99.99% uptime benchmark. Local merchants reduced transaction processing overhead by 40% compared to international alternatives, accelerating regional digital trade.</p>
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
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      description: formData.get('description')
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
}
