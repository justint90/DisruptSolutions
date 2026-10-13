// Cutting-Edge Neural AI Co-Pilot Terminal Component for JT Gaming HUD

class NeuralTerminal {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.history = [];
    this.isStreaming = false;
    this.streamTimer = null;

    this.knowledgeBase = [
      {
        keywords: ['gov', 'government', 'jamaica', 'gov.jm', 'customs', 'jswift', 'trade'],
        response: `[NATIONAL INFRASTRUCTURE REPORT]
Justin Taylor has engineered mission-critical platforms of national importance:
1. Jamaica Single Window for Trade (JSWIFT - 2018-Present): Lead web & BI developer for Jamaica Customs Agency, enabling digital border clearance, trade facilitation, and executive Tableau telemetry across all cross-border regulatory bodies.
2. GOV.JM (2017-2018): Lead Developer who architected Jamaica's primary government portal and authored the official 'Web Design Standards for GOJ Websites' adopted across ministries.`
      },
      {
        keywords: ['ai', 'agent', 'swarm', 'agentic', 'voice', 'bland', 'llm', 'deepseek', 'gpt', 'claude'],
        response: `[NEURAL AGENTIC ARCHITECTURE REPORT]
Justin specializes in production-grade autonomous AI systems and deterministic agent swarms:
• Autonomous Multi-Agent Swarms: Orchestrated agent networks executing deterministic business workflows with self-healing execution loops.
• Voice AI Telephony: Real-time dynamic speech agents via Bland.ai and low-latency WebSockets.
• Automated Agentic Web Agency: Built an 11-step autonomous pipeline from Google Places discovery to automated Vite code generation and checkout.
• Local Inference & Quantization: DeepSeek fine-tuning, LoRA adapters, Unsloth, and vector memory retrieval meshes.`
      },
      {
        keywords: ['bi', 'tableau', 'business intelligence', 'data', 'jasper', 'crystal', 'reports', 'analytics'],
        response: `[TELEMETRY & BUSINESS INTELLIGENCE REPORT]
Dual-threat capabilities:
• Enterprise BI: Tableau Desktop & Server, Jasper Reports, and Crystal Reports for mission-critical government compliance and executive KPIs.
• Real-Time Telemetry: High-frequency data pipelines, streaming WebSockets, node performance graphs, and database connection pooling.`
      },
      {
        keywords: ['skills', 'stack', 'tech', 'languages', 'frameworks', 'code'],
        response: `[CORE TECH ARSENAL]
• Frontier AI: LangGraph, DeepSeek, Claude 3.7 / GPT-4o, Bland.ai, Unsloth, Vector DBs
• Frontend: TypeScript, React 19, Next.js 15, Vite, Angular 8+, WebGL/Canvas, SCSS
• Backend: Node.js, Bun runtime, Java EE, PHP / Headless CMS, RESTful / WebSockets
• Systems: Linux/Windows Admin, Nginx reverse proxies, Docker, Vercel Edge, MySQL/Postgres`
      },
      {
        keywords: ['hire', 'contact', 'consult', 'email', 'phone', 'collaborate', 'book', 'co-op'],
        response: `[CO-OP DIRECT LINK AVAILABLE]
Justin is open to selective enterprise contracts, high-leverage AI architectures, and executive consultancies:
• Direct Email: justin.jaytaylor@gmail.com
• Phone: +1 (876) 404-4543
• Headquarters: Kingston, Jamaica
• Parent Entity: Disrupt Group (disruptgrp.com)`
      },
      {
        keywords: ['disrupt', 'disrupt group', 'disrupt solutions', 'disrupt media', 'hazel', 'slu eats'],
        response: `[DISRUPT ECOSYSTEM OVERVIEW]
Justin is the Founder & Principal Systems Architect of Disrupt Group:
• Disrupt Solutions: Frontier AI, Hazel Autonomous Trading Engine (100% deterministic), SLU Eats Real-Time Dispatch (50K+ monthly orders, <1.2s matching), and Caribbean Banking Payment Mesh (8 jurisdictions).
• Disrupt Media: Cinema-grade brand films, 4K/6K anamorphic production, and omnichannel video engines.`
      }
    ];

    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="terminal-shell">
        <div class="terminal-header">
          <div class="term-status-dot"></div>
          <span class="term-title">JT-CO-PILOT // NEURAL RUNTIME v4.2.0</span>
          <span class="term-badge">MODEL: CLAUDE/DEEPSEEK AGENTIC SIMULATOR</span>
        </div>
        
        <div class="terminal-quick-pills">
          <button class="term-pill" data-prompt="What national projects did Justin build?">🇯🇲 National GovTech</button>
          <button class="term-pill" data-prompt="Explain Justin's autonomous AI swarms">🤖 AI & Agentic Stack</button>
          <button class="term-pill" data-prompt="What are his Business Intelligence & Tableau skills?">📊 BI & Telemetry</button>
          <button class="term-pill" data-prompt="What systems does Disrupt Solutions run?">⚡ Disrupt Ecosystem</button>
          <button class="term-pill" data-prompt="/stats">📈 Operator Stats</button>
          <button class="term-pill" data-prompt="/secret">🎮 Easter Egg</button>
        </div>

        <div class="terminal-screen" id="termScreen" aria-live="polite">
          <div class="term-line term-system">SYSTEM READY. NEURAL LINK ESTABLISHED TO KINGSTON NODE [18.0179° N, 76.8099° W].</div>
          <div class="term-line term-system">TYPE A COMMAND (e.g. /help, /stats, /quests, /ai, /contact, /secret) OR INQUIRE FREELY:</div>
        </div>

        <form class="terminal-input-bar" id="termForm">
          <span class="term-prompt-symbol">&gt;</span>
          <input type="text" id="termInput" class="term-input" placeholder="Query JT-Co-Pilot (e.g. 'Can Justin build an autonomous AI agent?')..." autocomplete="off" />
          <button type="submit" class="term-send-btn" id="termSendBtn" aria-label="Send query">
            <span>EXEC</span>
          </button>
        </form>
      </div>
    `;
  }

  bindEvents() {
    const form = this.container.querySelector('#termForm');
    const input = this.container.querySelector('#termInput');
    const pills = this.container.querySelectorAll('.term-pill');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val || this.isStreaming) return;
      input.value = '';
      this.handleInput(val);
    });

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        if (this.isStreaming) return;
        const prompt = pill.getAttribute('data-prompt');
        if (window.soundEngine) window.soundEngine.playSelect();
        this.handleInput(prompt);
      });
      pill.addEventListener('mouseenter', () => {
        if (window.soundEngine) window.soundEngine.playHover();
      });
    });
  }

  handleInput(rawQuery) {
    const screen = this.container.querySelector('#termScreen');
    
    // Add user query
    const userLine = document.createElement('div');
    userLine.className = 'term-line term-user';
    userLine.textContent = `> ${rawQuery}`;
    screen.appendChild(userLine);
    this.scrollToBottom();

    if (window.soundEngine) window.soundEngine.playTerminalKey();

    const query = rawQuery.toLowerCase();

    // Check special slash commands
    if (query === '/help') {
      this.streamResponse(`[NEURAL COMMAND MATRIX]
• /stats    - View operator RPG attribute hexagon & levels
• /quests   - Inspect national boss raids & enterprise missions
• /ai       - Deep dive into Justin's agentic swarm architectures
• /disrupt  - Examine Disrupt Group holdings & tech subsidiaries
• /contact  - Open immediate co-op link & verified communication lines
• /secret   - Unlock secret Easter egg achievement
• /clear    - Flush terminal buffer`);
      return;
    }

    if (query === '/stats') {
      this.streamResponse(`[OPERATOR STAT MATRIX // ARCHITECT CLASS]
• System Architecture: 98/100 [S-TIER]
• AI & Autonomous Swarms: 97/100 [S-TIER]
• Business Intelligence: 95/100 [S-TIER]
• Full-Stack Web Dev: 94/100 [S-TIER]
• Cloud & Cyber DevOps: 92/100 [A-TIER]
• UI/UX & Design Systems: 93/100 [A-TIER]
OVERALL COMBAT RATING: S+ PRINCIPAL ARCHITECT`);
      return;
    }

    if (query === '/quests') {
      this.streamResponse(`[CAMPAIGN RAID LOGS]
1. QUEST-01: Jamaica Single Window for Trade (JSWIFT) [ACTIVE]
2. QUEST-02: GOV.JM National Government Portal [STANDARD SET]
3. QUEST-03: Disrupt Solutions & Hazel Trading Engine [PRODUCTION]
4. QUEST-04: Automated Agentic AI Web Agency [OPERATIONAL]
5. QUEST-05: Disrupt Media Cinema Engine [ACTIVE]
Switch to TAB [03 // MISSIONS] to inspect full architectural blueprints.`);
      return;
    }

    if (query === '/clear') {
      screen.innerHTML = `
        <div class="term-line term-system">TERMINAL BUFFER FLUSHED. NEURAL LINK STABLE.</div>
      `;
      return;
    }

    if (query === '/secret' || query.includes('konami')) {
      if (window.triggerSecretAchievement) window.triggerSecretAchievement();
      this.streamResponse(`[SECRET TERMINAL ACCESS GRANTED]
Achievement Unlocked: "GOD MODE // VIBE CODER SUPREME"
Neural bandwidth overclocked by 300%. Sound effects and visual scanlines enhanced.`);
      return;
    }

    // Natural Language matching
    let matched = null;
    for (const item of this.knowledgeBase) {
      if (item.keywords.some(kw => query.includes(kw))) {
        matched = item.response;
        break;
      }
    }

    if (matched) {
      this.streamResponse(matched);
    } else {
      this.streamResponse(`[NEURAL AGENT SYNTHESIS]
Query received: "${rawQuery}".
Justin Taylor operates at the intersection of high-leverage autonomous AI agents, enterprise Business Intelligence (Tableau, real-time analytics), and national digital platforms (GOV.JM, Jamaica Single Window for Trade).
For specific inquiries or co-op proposals, reach out directly at justin.jaytaylor@gmail.com or type /help for command shortcuts.`);
    }
  }

  streamResponse(text) {
    const screen = this.container.querySelector('#termScreen');
    const respLine = document.createElement('div');
    respLine.className = 'term-line term-bot';
    screen.appendChild(respLine);

    this.isStreaming = true;
    let idx = 0;
    const speed = 12;

    const streamInterval = setInterval(() => {
      respLine.textContent = text.slice(0, idx + 1) + ' █';
      this.scrollToBottom();
      idx++;

      if (idx % 4 === 0 && window.soundEngine) {
        window.soundEngine.playTerminalKey();
      }

      if (idx >= text.length) {
        clearInterval(streamInterval);
        respLine.textContent = text;
        this.isStreaming = false;
        this.scrollToBottom();
      }
    }, speed);
  }

  scrollToBottom() {
    const screen = this.container.querySelector('#termScreen');
    if (screen) screen.scrollTop = screen.scrollHeight;
  }
}

window.NeuralTerminal = NeuralTerminal;
