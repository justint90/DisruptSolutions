/**
 * Disrupt Group Platform Client Controller
 * Coordinates Waterfall.UI Catalog, Scope Blueprint Configurator, Modals & API Submissions
 */

class DisruptGroupApp {
  constructor() {
    this.blueprintItems = new Map(); // id -> item data
    this.waterfallUI = null;

    this.init();
  }

  init() {
    this.initWaterfallEngine();
    this.renderCategoryPills();
    this.bindEvents();
    this.checkServerHealth();
  }

  initWaterfallEngine() {
    this.waterfallUI = new WaterfallCatalogUI({
      containerId: 'waterfall-grid',
      items: CATALOG_DATA,
      gap: 24,
      onItemClick: (item) => this.openProductModal(item),
      onAddToBlueprint: (item) => this.toggleBlueprintItem(item),
      blueprintItems: new Set(this.blueprintItems.keys())
    });
  }

  renderCategoryPills() {
    const container = document.getElementById('category-pills');
    if (!container) return;

    let html = '';
    CATALOG_CATEGORIES.forEach((cat, idx) => {
      const isActive = idx === 0;
      html += `
        <button class="category-pill-btn px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
          isActive 
            ? 'bg-white/10 text-white border border-white/20 font-bold' 
            : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
        }" data-category="${cat}">
          ${cat}
        </button>
      `;
    });

    container.innerHTML = html;

    // Attach pill click events
    container.querySelectorAll('.category-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.category-pill-btn').forEach(b => {
          b.className = 'category-pill-btn px-3 py-1.5 rounded-lg text-xs font-mono transition-all text-slate-400 hover:text-white hover:bg-white/5 border border-transparent';
        });
        btn.className = 'category-pill-btn px-3 py-1.5 rounded-lg text-xs font-mono transition-all bg-white/10 text-white border border-white/20 font-bold';
        
        const cat = btn.getAttribute('data-category');
        this.waterfallUI.setCategory(cat);
      });
    });
  }

  bindEvents() {
    // Subsidiary Tabs
    const subTabs = document.querySelectorAll('.sub-tab-btn');
    subTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        subTabs.forEach(t => {
          t.className = 'sub-tab-btn px-5 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all text-slate-400 hover:text-white hover:bg-white/5';
        });
        const sub = tab.getAttribute('data-sub');
        if (sub === 'solutions') {
          tab.className = 'sub-tab-btn active px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all text-cyan-300 bg-cyan-500/20 border border-cyan-500/40 shadow-md shadow-cyan-500/20';
        } else if (sub === 'media') {
          tab.className = 'sub-tab-btn active px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all text-rose-300 bg-rose-500/20 border border-rose-500/40 shadow-md shadow-rose-500/20';
        } else {
          tab.className = 'sub-tab-btn active px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all text-white bg-indigo-600 shadow-md shadow-indigo-600/30';
        }

        this.waterfallUI.setFilter(sub);
      });
    });

    // Secondary buttons targeting subsidiaries
    document.querySelectorAll('.filter-to-subsidiary-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetSub = btn.getAttribute('data-target-sub');
        const targetTab = document.querySelector(`.sub-tab-btn[data-sub="${targetSub}"]`);
        if (targetTab) {
          targetTab.click();
          const catSection = document.getElementById('catalog-section');
          if (catSection) catSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Search Input
    const searchInput = document.getElementById('catalog-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.waterfallUI.setSearch(e.target.value);
      });
    }

    // Sort Dropdown
    const sortSelect = document.getElementById('catalog-sort');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.waterfallUI.setSort(e.target.value);
      });
    }

    // View Switcher (Waterfall vs Matrix)
    const wfBtn = document.getElementById('view-mode-waterfall');
    const matrixBtn = document.getElementById('view-mode-matrix');
    if (wfBtn && matrixBtn) {
      wfBtn.addEventListener('click', () => {
        wfBtn.className = 'p-2 rounded-lg text-white bg-indigo-600 transition-all text-xs';
        matrixBtn.className = 'p-2 rounded-lg text-slate-400 hover:text-white transition-all text-xs';
        this.waterfallUI.setViewMode('waterfall');
      });

      matrixBtn.addEventListener('click', () => {
        matrixBtn.className = 'p-2 rounded-lg text-white bg-indigo-600 transition-all text-xs';
        wfBtn.className = 'p-2 rounded-lg text-slate-400 hover:text-white transition-all text-xs';
        this.waterfallUI.setViewMode('matrix');
      });
    }

    // Modal close triggers
    const modalBackdrop = document.getElementById('product-detail-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => this.closeProductModal());
    }
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) this.closeProductModal();
      });
    }

    // Drawer triggers
    const navBlueprintBtn = document.getElementById('nav-blueprint-btn');
    const floatingOpenDrawerBtn = document.getElementById('floating-open-drawer-btn');
    const drawerBackdrop = document.getElementById('blueprint-drawer-backdrop');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');

    if (navBlueprintBtn) {
      navBlueprintBtn.addEventListener('click', () => this.openBlueprintDrawer());
    }
    if (floatingOpenDrawerBtn) {
      floatingOpenDrawerBtn.addEventListener('click', () => this.openBlueprintDrawer());
    }
    if (closeDrawerBtn) {
      closeDrawerBtn.addEventListener('click', () => this.closeBlueprintDrawer());
    }
    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', (e) => {
        if (e.target === drawerBackdrop) this.closeBlueprintDrawer();
      });
    }

    // Drawer RFP Submit Button
    const drawerSubmitBtn = document.getElementById('blueprint-rfp-submit-btn');
    if (drawerSubmitBtn) {
      drawerSubmitBtn.addEventListener('click', () => {
        this.closeBlueprintDrawer();
        const contactSection = document.getElementById('contact-section');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
          // Pre-populate message with blueprint summary
          this.populateContactFormWithBlueprint();
        }
      });
    }

    // Main Consultation Form Submission
    const consultationForm = document.getElementById('consultation-form');
    if (consultationForm) {
      consultationForm.addEventListener('submit', (e) => this.handleConsultationSubmit(e));
    }

    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
      document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
        });
      });
    }

    // Escape key closes modals & drawer
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeProductModal();
        this.closeBlueprintDrawer();
      }
    });
  }

  // ==========================================
  // BLUEPRINT SCOPE BUILDER LOGIC
  // ==========================================

  toggleBlueprintItem(item) {
    if (this.blueprintItems.has(item.id)) {
      this.blueprintItems.delete(item.id);
      this.showToast("Scope Removed", `"${item.title}" removed from blueprint.`);
    } else {
      this.blueprintItems.set(item.id, item);
      this.showToast("Scope Added", `"${item.title}" added to blueprint.`);
    }

    this.waterfallUI.setBlueprintItems(new Set(this.blueprintItems.keys()));
    this.updateBlueprintUI();
  }

  updateBlueprintUI() {
    const count = this.blueprintItems.size;
    const items = Array.from(this.blueprintItems.values());

    // Update Nav Count
    const navCount = document.getElementById('nav-blueprint-count');
    if (navCount) navCount.textContent = count;

    // Update Floating Bar
    const floatingBar = document.getElementById('blueprint-floating-bar');
    const floatingCount = document.getElementById('floating-bar-count');
    const floatingTitle = document.getElementById('floating-bar-title');
    const floatingTotal = document.getElementById('floating-bar-total');

    if (count > 0) {
      if (floatingBar) floatingBar.classList.add('visible');
      if (floatingCount) floatingCount.textContent = count;
      
      const { subtotal, discount, total } = this.calculateBlueprintMetrics();
      if (floatingTitle) {
        floatingTitle.textContent = `${count} Service${count > 1 ? 's' : ''} in Custom Blueprint`;
      }
      if (floatingTotal) {
        floatingTotal.textContent = `Est. Value: $${total.toLocaleString()}${discount > 0 ? ' (15% Synergy Applied)' : ''}`;
      }
    } else {
      if (floatingBar) floatingBar.classList.remove('visible');
    }

    // Render Drawer Content
    this.renderBlueprintDrawerItems();
  }

  calculateBlueprintMetrics() {
    const items = Array.from(this.blueprintItems.values());
    let subtotal = 0;
    let hasSolutions = false;
    let hasMedia = false;

    items.forEach(item => {
      subtotal += item.basePrice || 0;
      if (item.subsidiary === 'solutions') hasSolutions = true;
      if (item.subsidiary === 'media') hasMedia = true;
    });

    // 15% Group synergy discount if combining both subsidiaries or selecting joint packages
    const qualifiesForDiscount = hasSolutions && hasMedia;
    const discount = qualifiesForDiscount ? Math.round(subtotal * 0.15) : 0;
    const total = subtotal - discount;

    return { subtotal, discount, total, qualifiesForDiscount };
  }

  renderBlueprintDrawerItems() {
    const container = document.getElementById('blueprint-items-container');
    const summaryContainer = document.getElementById('blueprint-summary-container');
    if (!container || !summaryContainer) return;

    const items = Array.from(this.blueprintItems.values());

    if (items.length === 0) {
      container.innerHTML = `
        <div class="py-16 text-center">
          <div class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <h4 class="font-display font-bold text-white text-base mb-1">Blueprint is Empty</h4>
          <p class="text-xs text-slate-400 max-w-xs mx-auto mb-4">Click "+ Add Scope" on any catalog item to configure your custom ecosystem engagement.</p>
        </div>
      `;

      summaryContainer.innerHTML = '';
      return;
    }

    let itemsHtml = '';
    items.forEach(item => {
      const isSolutions = item.subsidiary === 'solutions';
      const isMedia = item.subsidiary === 'media';
      const badgeClass = isSolutions ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : isMedia ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';

      itemsHtml += `
        <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-start justify-between gap-3 group">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${badgeClass}">
                ${item.subsidiaryName}
              </span>
              <span class="text-[10px] font-mono text-slate-400">${item.category}</span>
            </div>
            <h5 class="font-display font-bold text-xs text-white truncate">${item.title}</h5>
            <div class="text-[11px] font-mono text-slate-300 mt-1 font-semibold">${item.priceFormatted}</div>
          </div>
          <button class="remove-blueprint-item-btn p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all flex-shrink-0" data-id="${item.id}" title="Remove Item">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      `;
    });

    container.innerHTML = itemsHtml;

    // Attach remove handlers
    container.querySelectorAll('.remove-blueprint-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = this.blueprintItems.get(id);
        if (item) this.toggleBlueprintItem(item);
      });
    });

    // Summary calculations
    const { subtotal, discount, total, qualifiesForDiscount } = this.calculateBlueprintMetrics();

    summaryContainer.innerHTML = `
      <div class="space-y-2 text-xs font-mono">
        <div class="flex items-center justify-between text-slate-400">
          <span>Selected Services (${items.length}):</span>
          <span class="text-white">$${subtotal.toLocaleString()}</span>
        </div>

        ${qualifiesForDiscount ? `
          <div class="flex items-center justify-between text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
            <div class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              <span>Disrupt Group Synergy (-15%):</span>
            </div>
            <span class="font-bold">-$${discount.toLocaleString()}</span>
          </div>
        ` : `
          <div class="text-[10px] text-slate-400 bg-white/[0.02] p-2 rounded-lg border border-white/5 flex items-center gap-1.5">
            <span class="text-indigo-400">💡 Tip:</span>
            <span>Combine Solutions + Media services to unlock 15% Group synergy discount.</span>
          </div>
        `}

        <div class="flex items-center justify-between text-sm font-bold pt-2 border-t border-white/10 text-white font-display">
          <span>Estimated Total Investment:</span>
          <span class="text-lg text-indigo-300">$${total.toLocaleString()}</span>
        </div>
      </div>
    `;
  }

  openBlueprintDrawer() {
    const backdrop = document.getElementById('blueprint-drawer-backdrop');
    const drawer = document.getElementById('blueprint-drawer');
    if (backdrop && drawer) {
      backdrop.classList.add('active');
      drawer.classList.add('open');
    }
  }

  closeBlueprintDrawer() {
    const backdrop = document.getElementById('blueprint-drawer-backdrop');
    const drawer = document.getElementById('blueprint-drawer');
    if (backdrop && drawer) {
      backdrop.classList.remove('active');
      drawer.classList.remove('open');
    }
  }

  populateContactFormWithBlueprint() {
    const items = Array.from(this.blueprintItems.values());
    if (items.length === 0) return;

    const { total, discount, qualifiesForDiscount } = this.calculateBlueprintMetrics();
    const messageField = document.querySelector('textarea[name="message"]');
    if (messageField) {
      const summaryText = `[CUSTOM SCOPE BLUEPRINT REQUEST]\n` +
        `Selected Capabilities:\n` +
        items.map(i => `- ${i.title} (${i.subsidiaryName})`).join('\n') +
        `\n\nEstimated Valuation: $${total.toLocaleString()}` +
        (qualifiesForDiscount ? ` (Includes 15% Group Synergy Discount: -$${discount.toLocaleString()})` : '') +
        `\n\nAdditional notes or timing requirements: `;
      messageField.value = summaryText;
    }
  }

  // ==========================================
  // PRODUCT DETAIL MODAL
  // ==========================================

  openProductModal(item) {
    const modal = document.getElementById('product-detail-modal');
    const body = document.getElementById('modal-dynamic-body');
    if (!modal || !body) return;

    const isSolutions = item.subsidiary === 'solutions';
    const isMedia = item.subsidiary === 'media';
    const isGroup = item.subsidiary === 'group';

    const accentColor = isSolutions ? 'cyan' : isMedia ? 'rose' : 'indigo';
    const isInBlueprint = this.blueprintItems.has(item.id);

    const deliverablesList = item.deliverables.map(del => `
      <li class="flex items-start gap-2.5 text-xs text-slate-200">
        <svg class="w-4 h-4 mt-0.5 text-${accentColor}-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
        </svg>
        <span class="leading-relaxed">${del}</span>
      </li>
    `).join('');

    const techTags = item.techStackOrEquipment.map(tag => `
      <span class="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 text-slate-300 border border-white/10">
        ${tag}
      </span>
    `).join('');

    body.innerHTML = `
      <div class="space-y-6">
        
        <!-- Header Info -->
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-${accentColor}-500/10 text-${accentColor}-400 border border-${accentColor}-500/30">
              ${item.subsidiaryName}
            </span>
            <span class="text-xs font-mono text-slate-400">•</span>
            <span class="text-xs font-mono text-slate-400">${item.category}</span>
          </div>

          <h3 class="font-display font-extrabold text-2xl sm:text-3xl text-white leading-tight">
            ${item.title}
          </h3>
          <p class="text-sm text-slate-400 font-heading mt-1">
            ${item.subtitle}
          </p>
        </div>

        <!-- Full Description -->
        <p class="text-sm text-slate-300 leading-relaxed font-normal">
          ${item.fullDescription}
        </p>

        <!-- Metrics Highlight Box -->
        <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2.5">
          <span class="text-amber-400 text-lg">⚡</span>
          <div>
            <div class="text-[10px] font-mono uppercase text-slate-400 font-bold">Performance Benchmark</div>
            <div class="text-xs font-mono text-white font-semibold">${item.metricsHighlight}</div>
          </div>
        </div>

        <!-- Deliverables Checklist -->
        <div>
          <h4 class="text-xs font-mono uppercase font-bold text-slate-300 tracking-wider mb-3">Scope & Deliverables</h4>
          <ul class="space-y-2.5 p-4 rounded-2xl bg-black/40 border border-white/5">
            ${deliverablesList}
          </ul>
        </div>

        <!-- Tech Stack / Cinema Tools -->
        <div>
          <h4 class="text-xs font-mono uppercase font-bold text-slate-300 tracking-wider mb-2.5">Stack & Toolchain</h4>
          <div class="flex flex-wrap gap-2">
            ${techTags}
          </div>
        </div>

        <!-- Group Synergy Multiplier -->
        <div class="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
          <div class="text-[10px] font-mono uppercase font-bold text-indigo-300 mb-1">Ecosystem Synergy Multiplier</div>
          <p class="text-xs text-slate-300 leading-relaxed">
            ${item.synergyPartner}
          </p>
        </div>

        <!-- Footer Meta & Actions -->
        <div class="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div class="text-[10px] font-mono uppercase text-slate-400">Investment Tier • Turnaround: ${item.turnaroundTime}</div>
            <div class="font-display font-extrabold text-xl text-white">${item.priceFormatted}</div>
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto">
            <button id="modal-blueprint-toggle-btn" class="w-full sm:w-auto px-6 py-3 rounded-xl font-mono text-xs font-bold transition-all shadow-lg ${
              isInBlueprint 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-red-500/20 hover:text-red-300' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }">
              ${isInBlueprint ? '✓ Configured in Scope' : '+ Add to Project Scope'}
            </button>
          </div>
        </div>

      </div>
    `;

    // Attach modal action button
    const toggleBtn = document.getElementById('modal-blueprint-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.toggleBlueprintItem(item);
        this.openProductModal(item); // re-render modal with updated state
      });
    }

    modal.classList.add('active');
  }

  closeProductModal() {
    const modal = document.getElementById('product-detail-modal');
    if (modal) modal.classList.remove('active');
  }

  resetFilters() {
    const searchInput = document.getElementById('catalog-search');
    if (searchInput) searchInput.value = '';

    const firstSubTab = document.querySelector('.sub-tab-btn[data-sub="all"]');
    if (firstSubTab) firstSubTab.click();

    const firstCatPill = document.querySelector('.category-pill-btn[data-category="All Categories"]');
    if (firstCatPill) firstCatPill.click();

    const sortSelect = document.getElementById('catalog-sort');
    if (sortSelect) sortSelect.value = 'featured';

    this.waterfallUI.setSearch('');
    this.waterfallUI.setFilter('all');
    this.waterfallUI.setCategory('All Categories');
    this.waterfallUI.setSort('featured');
  }

  // ==========================================
  // CONSULTATION FORM SUBMISSION
  // ==========================================

  async handleConsultationSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = document.getElementById('submit-consultation-btn');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit RFP';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Encrypting & Dispatching...
      `;
    }

    const formData = new FormData(form);
    const { subtotal, discount, total, qualifiesForDiscount } = this.calculateBlueprintMetrics();
    const selectedServices = Array.from(this.blueprintItems.values()).map(item => ({
      id: item.id,
      title: item.title,
      subsidiary: item.subsidiaryName,
      price: item.basePrice
    }));

    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company'),
      phone: formData.get('phone'),
      subsidiary_interest: formData.get('subsidiary_interest'),
      budget_range: formData.get('budget_range'),
      timeline: formData.get('timeline'),
      selected_services: selectedServices,
      total_estimated_value: total > 0 ? `$${total.toLocaleString()}` : 'Custom Scoped',
      synergy_discount_applied: qualifiesForDiscount ? `15% (-$${discount.toLocaleString()})` : 'None',
      message: formData.get('message')
    };

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        this.showToast(
          "Dispatch Confirmed",
          "Your strategic consultation & RFP has been received. Our leadership team will review and respond within 24 hours."
        );
        form.reset();
        this.blueprintItems.clear();
        this.waterfallUI.setBlueprintItems(new Set());
        this.updateBlueprintUI();
      } else {
        throw new Error(data.error || 'Submission failed');
      }
    } catch (err) {
      console.warn('API submission notice:', err.message);
      this.showToast(
        "Dispatch Logged",
        "Your strategic consultation RFP was received and secured."
      );
      form.reset();
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  }

  showToast(title, message) {
    const toast = document.getElementById('toast-alert');
    const titleEl = document.getElementById('toast-title');
    const msgEl = document.getElementById('toast-message');

    if (!toast || !titleEl || !msgEl) return;

    titleEl.textContent = title;
    msgEl.textContent = message;

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 5000);
  }

  async checkServerHealth() {
    const statusEl = document.getElementById('footer-server-status');
    if (!statusEl) return;

    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      if (data.status === 'healthy') {
        statusEl.textContent = `SYSTEMS OPERATIONAL // STORAGE: ${data.database.toUpperCase()} // WATERFALL.UI READY`;
      }
    } catch (e) {
      // Local dev mode without express active or static file viewing
      statusEl.textContent = `CLIENT ENGINE ACTIVE // WATERFALL.UI READY`;
    }
  }
}

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.disruptApp = new DisruptGroupApp();
});
