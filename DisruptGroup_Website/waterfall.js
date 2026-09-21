/**
 * Waterfall.UI - Dynamic Masonry & Catalog Rendering Engine
 * Developed for Disrupt Group Catalog System
 */

class WaterfallCatalogUI {
  constructor(options = {}) {
    this.containerId = options.containerId || 'waterfall-grid';
    this.container = document.getElementById(this.containerId);
    this.items = options.items || [];
    this.filteredItems = [...this.items];
    this.activeFilter = 'all'; // 'all', 'solutions', 'media', 'group'
    this.activeCategory = 'All Categories';
    this.searchQuery = '';
    this.currentSort = 'featured'; // 'featured', 'popular', 'price-low', 'price-high', 'turnaround'
    this.viewMode = 'waterfall'; // 'waterfall' | 'matrix'
    this.gap = options.gap || 24;
    this.onItemClick = options.onItemClick || null;
    this.onAddToBlueprint = options.onAddToBlueprint || null;
    this.blueprintItems = options.blueprintItems || new Set();

    this.init();
  }

  init() {
    if (!this.container) {
      console.warn(`WaterfallUI: Element #${this.containerId} not found.`);
      return;
    }

    // Window resize handler with debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (this.viewMode === 'waterfall') {
          this.layout();
        }
      }, 100);
    });

    this.render();
  }

  setItems(newItems) {
    this.items = newItems;
    this.applyFiltersAndSort();
  }

  setBlueprintItems(blueprintSet) {
    this.blueprintItems = blueprintSet;
    this.updateBlueprintButtonStates();
  }

  setFilter(subsidiary) {
    this.activeFilter = subsidiary;
    this.applyFiltersAndSort();
  }

  setCategory(category) {
    this.activeCategory = category;
    this.applyFiltersAndSort();
  }

  setSearch(query) {
    this.searchQuery = (query || '').toLowerCase().trim();
    this.applyFiltersAndSort();
  }

  setSort(sortType) {
    this.currentSort = sortType;
    this.applyFiltersAndSort();
  }

  setViewMode(mode) {
    this.viewMode = mode;
    this.render();
  }

  applyFiltersAndSort() {
    let result = this.items.filter(item => {
      // Filter by subsidiary
      if (this.activeFilter !== 'all' && item.subsidiary !== this.activeFilter) {
        return false;
      }
      // Filter by category
      if (this.activeCategory !== 'All Categories' && item.category !== this.activeCategory) {
        return false;
      }
      // Filter by search query
      if (this.searchQuery) {
        const matchTitle = item.title.toLowerCase().includes(this.searchQuery);
        const matchSub = item.subtitle.toLowerCase().includes(this.searchQuery);
        const matchDesc = item.shortDescription.toLowerCase().includes(this.searchQuery);
        const matchCategory = item.category.toLowerCase().includes(this.searchQuery);
        const matchSubsidiary = item.subsidiaryName.toLowerCase().includes(this.searchQuery);
        const matchTags = item.techStackOrEquipment.some(tag => tag.toLowerCase().includes(this.searchQuery));
        if (!matchTitle && !matchSub && !matchDesc && !matchCategory && !matchSubsidiary && !matchTags) {
          return false;
        }
      }
      return true;
    });

    // Sort result
    if (this.currentSort === 'featured') {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.popularityScore - a.popularityScore));
    } else if (this.currentSort === 'popular') {
      result.sort((a, b) => b.popularityScore - a.popularityScore);
    } else if (this.currentSort === 'price-low') {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (this.currentSort === 'price-high') {
      result.sort((a, b) => b.basePrice - a.basePrice);
    }

    this.filteredItems = result;
    this.render();
  }

  getColumnCount() {
    const width = this.container.getBoundingClientRect().width || window.innerWidth;
    if (width < 640) return 1;
    if (width < 1024) return 2;
    return 3;
  }

  render() {
    if (!this.container) return;

    if (this.filteredItems.length === 0) {
      this.container.innerHTML = `
        <div class="col-span-full py-20 text-center w-full">
          <div class="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <h3 class="font-display font-bold text-xl text-white mb-2">No Matching Offerings Found</h3>
          <p class="text-slate-400 text-sm max-w-md mx-auto mb-6">Try adjusting your subsidiary selection, category filters, or search keywords.</p>
          <button id="reset-filters-btn" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-semibold uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/30">
            Reset Filters
          </button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (window.disruptApp) window.disruptApp.resetFilters();
        });
      }
      return;
    }

    if (this.viewMode === 'matrix') {
      this.renderMatrixView();
    } else {
      this.renderWaterfallView();
    }
  }

  renderWaterfallView() {
    const numCols = this.getColumnCount();
    
    // Create column wrapper containers for optimal CSS / flex masonry
    let columnsHtml = '';
    for (let c = 0; c < numCols; c++) {
      columnsHtml += `<div class="waterfall-column flex flex-col gap-6 flex-1 min-w-0" data-col="${c}"></div>`;
    }

    this.container.className = "waterfall-masonry-wrapper flex flex-col sm:flex-row gap-6 items-start w-full relative";
    this.container.innerHTML = columnsHtml;

    const columnElements = this.container.querySelectorAll('.waterfall-column');

    // Distribute items into shortest column
    const colHeights = new Array(numCols).fill(0);

    this.filteredItems.forEach((item, index) => {
      // Find index of column with minimum height
      let minColIndex = 0;
      let minHeight = colHeights[0];
      for (let i = 1; i < numCols; i++) {
        if (colHeights[i] < minHeight) {
          minHeight = colHeights[i];
          minColIndex = i;
        }
      }

      const cardHtml = this.createCardElementHtml(item, index);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = cardHtml;
      const cardEl = tempDiv.firstElementChild;

      columnElements[minColIndex].appendChild(cardEl);

      // Estimate item height for distribution
      const approxHeight = 360 + (item.deliverables.length * 28) + (item.techStackOrEquipment.length * 8);
      colHeights[minColIndex] += approxHeight;

      this.attachCardEvents(cardEl, item);
    });
  }

  renderMatrixView() {
    this.container.className = "waterfall-matrix-wrapper grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full";
    this.container.innerHTML = '';

    this.filteredItems.forEach((item, index) => {
      const cardHtml = this.createCardElementHtml(item, index, true);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = cardHtml;
      const cardEl = tempDiv.firstElementChild;
      this.container.appendChild(cardEl);
      this.attachCardEvents(cardEl, item);
    });
  }

  createCardElementHtml(item, index, isMatrix = false) {
    const isSolutions = item.subsidiary === 'solutions';
    const isMedia = item.subsidiary === 'media';
    const isGroup = item.subsidiary === 'group';

    let borderHoverClass = "hover:border-indigo-500/60 hover:shadow-indigo-500/10";
    let glowBg = "from-indigo-500/10 to-transparent";
    let badgeBg = "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
    let iconGlow = "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
    let accentDot = "bg-indigo-400";

    if (isSolutions) {
      borderHoverClass = "hover:border-cyan-500/60 hover:shadow-cyan-500/10";
      glowBg = "from-cyan-500/10 to-transparent";
      badgeBg = "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      iconGlow = "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      accentDot = "bg-cyan-400";
    } else if (isMedia) {
      borderHoverClass = "hover:border-rose-500/60 hover:shadow-rose-500/10";
      glowBg = "from-rose-500/10 to-transparent";
      badgeBg = "bg-rose-500/10 text-rose-400 border-rose-500/30";
      iconGlow = "bg-rose-500/20 text-rose-300 border-rose-500/30";
      accentDot = "bg-rose-400";
    }

    const isInBlueprint = this.blueprintItems.has(item.id);

    // Icon SVG resolver
    const iconSvg = this.getIconSvg(item.icon, item.subsidiary);

    // Tech tags
    const tagsHtml = item.techStackOrEquipment.slice(0, 4).map(tag => 
      `<span class="px-2 py-0.5 rounded text-[10.5px] font-mono bg-white/[0.04] text-slate-300 border border-white/[0.06] whitespace-nowrap">${tag}</span>`
    ).join('');

    const extraTagsCount = item.techStackOrEquipment.length > 4 ? `<span class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/[0.03] text-slate-500">+${item.techStackOrEquipment.length - 4}</span>` : '';

    // Key deliverables preview
    const deliverablesPreview = item.deliverables.slice(0, 3).map(del => `
      <li class="flex items-start gap-2 text-xs text-slate-300">
        <svg class="w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${isSolutions ? 'text-cyan-400' : isMedia ? 'text-rose-400' : 'text-indigo-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
        </svg>
        <span class="line-clamp-1 leading-snug">${del}</span>
      </li>
    `).join('');

    return `
      <div class="waterfall-card group relative rounded-2xl bg-[#0c0c12]/90 backdrop-blur-xl border border-white/[0.09] transition-all duration-300 ${borderHoverClass} hover:-translate-y-1 overflow-hidden shadow-xl"
           data-id="${item.id}" 
           data-subsidiary="${item.subsidiary}"
           style="animation: cardFadeIn 0.4s ease-out forwards; animation-delay: ${index * 0.05}s;">
        
        <!-- Ambient Top Gradient -->
        <div class="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-gradient-to-br ${glowBg} blur-2xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"></div>

        <div class="p-6 relative z-10 flex flex-col h-full">
          
          <!-- Card Header Telemetry -->
          <div class="flex items-center justify-between gap-2 mb-4">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full ${accentDot} animate-pulse"></span>
              <span class="text-[10px] font-mono tracking-wider uppercase font-semibold text-slate-400">
                ${item.subsidiaryName}
              </span>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${badgeBg}">
              ${item.badge}
            </span>
          </div>

          <!-- Title & Subtitle with Icon -->
          <div class="flex items-start gap-3.5 mb-3">
            <div class="w-10 h-10 rounded-xl ${iconGlow} border flex items-center justify-center flex-shrink-0 shadow-md">
              ${iconSvg}
            </div>
            <div>
              <h3 class="font-display font-bold text-lg text-white group-hover:text-indigo-200 transition-colors leading-tight">
                ${item.title}
              </h3>
              <p class="text-xs text-slate-400 font-heading mt-0.5 line-clamp-1">
                ${item.subtitle}
              </p>
            </div>
          </div>

          <!-- Short Description -->
          <p class="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
            ${item.shortDescription}
          </p>

          <!-- Deliverables Checklist -->
          <div class="py-3 px-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-4">
            <div class="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-2">Key Deliverables</div>
            <ul class="space-y-1.5">
              ${deliverablesPreview}
            </ul>
          </div>

          <!-- Metrics / Output highlight -->
          <div class="mb-4 text-[11px] font-mono text-slate-300 flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/[0.05]">
            <svg class="w-3.5 h-3.5 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path>
            </svg>
            <span class="truncate font-medium">${item.metricsHighlight}</span>
          </div>

          <!-- Tech Tags -->
          <div class="flex flex-wrap gap-1.5 mb-5 mt-auto">
            ${tagsHtml}
            ${extraTagsCount}
          </div>

          <!-- Footer: Pricing & Action Controls -->
          <div class="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3 mt-auto">
            <div>
              <div class="text-[10px] font-mono text-slate-400 uppercase">${item.pricingModel}</div>
              <div class="font-display font-extrabold text-sm text-white">${item.priceFormatted}</div>
            </div>

            <div class="flex items-center gap-2">
              <button class="view-details-btn p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] text-slate-300 hover:text-white transition-all text-xs font-mono" 
                      title="Inspect Scope & Specs"
                      aria-label="View Details for ${item.title}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>

              <button class="add-blueprint-btn px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                isInBlueprint 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40' 
                  : (isSolutions 
                      ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm' 
                      : isMedia 
                        ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/30')
              }"
                      data-action="toggle-blueprint">
                <span class="btn-label">${isInBlueprint ? '✓ Added' : '+ Add Scope'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  attachCardEvents(cardEl, item) {
    // Detail click
    const detailsBtn = cardEl.querySelector('.view-details-btn');
    if (detailsBtn) {
      detailsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.onItemClick) this.onItemClick(item);
      });
    }

    // Card click opens detail
    cardEl.addEventListener('click', (e) => {
      // Don't trigger if clicked on add button
      if (e.target.closest('.add-blueprint-btn')) return;
      if (this.onItemClick) this.onItemClick(item);
    });

    // Add / Remove blueprint
    const blueprintBtn = cardEl.querySelector('.add-blueprint-btn');
    if (blueprintBtn) {
      blueprintBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.onAddToBlueprint) this.onAddToBlueprint(item);
      });
    }
  }

  updateBlueprintButtonStates() {
    if (!this.container) return;
    const cards = this.container.querySelectorAll('.waterfall-card');
    cards.forEach(card => {
      const id = card.getAttribute('data-id');
      const sub = card.getAttribute('data-subsidiary');
      const btn = card.querySelector('.add-blueprint-btn');
      const label = card.querySelector('.btn-label');
      if (!btn || !label) return;

      const isIn = this.blueprintItems.has(id);
      if (isIn) {
        btn.className = 'add-blueprint-btn px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40';
        label.textContent = '✓ Added';
      } else {
        if (sub === 'solutions') {
          btn.className = 'add-blueprint-btn px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm';
        } else if (sub === 'media') {
          btn.className = 'add-blueprint-btn px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm';
        } else {
          btn.className = 'add-blueprint-btn px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/30';
        }
        label.textContent = '+ Add Scope';
      }
    });
  }

  layout() {
    // Re-render when column breakdown changes on resize
    this.render();
  }

  getIconSvg(iconName, subsidiary) {
    switch (iconName) {
      case 'bot':
        return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`;
      case 'globe':
        return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>`;
      case 'smartphone':
        return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>`;
      case 'bar-chart-3':
        return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>`;
      case 'server':
        return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path></svg>`;
      case 'video':
        return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>`;
      case 'compass':
        return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm3.5 6.5l-2 5.5-5.5 2 2-5.5 5.5-2z"></path></svg>`;
      case 'zap':
        return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`;
      case 'layers':
        return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>`;
      case 'trending-up':
        return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>`;
      case 'rocket':
        return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.84 2.58m-.12-8.54a6 6 0 00-7.38 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m0 0l-5.41 5.41"></path></svg>`;
      case 'sparkles':
        return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>`;
      default:
        return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`;
    }
  }
}

// Export to global scope
window.WaterfallCatalogUI = WaterfallCatalogUI;
