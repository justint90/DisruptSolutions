// Justin Taylor (JT) - Comprehensive Profile & Quest Catalog Data

const JT_PROFILE = {
  codename: 'JUSTIN TAYLOR',
  callsign: 'JT',
  classTitle: 'PRINCIPAL SYSTEMS ARCHITECT',
  location: 'Kingston, Jamaica',
  email: 'justin.jaytaylor@gmail.com',
  phone: '+1 (876) 404-4543',
  linkedin: 'https://jm.linkedin.com/in/justin-taylor-061b6a224',
  github: 'https://github.com/justin-taylor',
  uptime: '99.99%',
  status: 'ONLINE // READY FOR CO-OP',
  
  bio: `Experienced Systems Architect & Senior IT Professional with a proven track record of architecting digital platforms of national importance for the Government of Jamaica, and founding Disrupt Group to deploy autonomous enterprise AI agents, multi-agent swarms, and resilient full-stack platforms. Specializing in bridging the frontier of generative AI, high-throughput web engineering, and enterprise Business Intelligence.`,
  
  perks: [
    {
      id: 'perk-gov',
      name: 'NATIONAL PILLAR',
      icon: '🏛️',
      tier: 'LEGENDARY',
      desc: 'Authored official Web Design Standards for the Government of Jamaica (GOV.JM) and architected core modules for Jamaica Single Window for Trade.'
    },
    {
      id: 'perk-ai',
      name: 'AGENTIC OVERMIND',
      icon: '🧠',
      tier: 'MYTHIC',
      desc: 'Engineers autonomous multi-agent swarms, voice agents (Bland.ai), tool use, LLM fine-tuning, and end-to-end self-driving business pipelines.'
    },
    {
      id: 'perk-bi',
      name: 'TELEMETRY ORACLE',
      icon: '📊',
      tier: 'ELITE',
      desc: 'Advanced Business Intelligence analytics mastery across Tableau Desktop, Jasper Reports, Crystal Reports, and real-time command center telemetry.'
    },
    {
      id: 'perk-eng',
      name: 'BARE-METAL DISCIPLINE',
      icon: '⚡',
      tier: 'MASTER',
      desc: 'Formally trained in Linux/Windows Server Administration, enterprise Java, DevOps CI/CD pipelines, and high-concurrency WebSockets.'
    }
  ],

  skillTree: [
    {
      branchId: 'ai',
      branchName: 'Frontier AI & Autonomous Swarms',
      branchIcon: '🤖',
      color: '#00f2fe',
      skills: [
        { name: 'Multi-Agent Swarms & Orchestration', level: 98, exp: 'Production', desc: 'LangChain, LangGraph, autonomous role assignment, self-healing execution loops' },
        { name: 'Autonomous Voice Agents', level: 95, exp: 'Production', desc: 'Bland.ai, WebSockets audio stream, dynamic STT/TTS prompt-driven telephony' },
        { name: 'LLM Fine-Tuning & Quantization', level: 92, exp: 'Advanced', desc: 'DeepSeek, LLaMA, Unsloth, LoRA adapters, local inference optimization' },
        { name: 'RAG & Vector Memory Mesh', level: 94, exp: 'Production', desc: 'Context retrieval, hybrid embeddings, document chunking, semantic memory' },
        { name: 'Autonomous Web Agencies', level: 96, exp: 'Enterprise', desc: 'End-to-end pipeline: lead discovery -> AI copy -> Vite build -> voice pitch -> checkout' }
      ]
    },
    {
      branchId: 'fullstack',
      branchName: 'Full-Stack & Web Engineering',
      branchIcon: '💻',
      color: '#a855f7',
      skills: [
        { name: 'TypeScript & Modern JavaScript', level: 96, exp: '10+ Yrs', desc: 'Type-safe scalable architectures, modern ESNext patterns, performance optimization' },
        { name: 'React, Next.js & Vite', level: 94, exp: '7+ Yrs', desc: 'Component architectures, dynamic client state, streaming SSR, canvas integrations' },
        { name: 'Angular 8+ & Enterprise SPA', level: 90, exp: '6+ Yrs', desc: 'RxJS reactive pipelines, dependency injection, modular enterprise dashboards' },
        { name: 'Node.js, Express & Microservices', level: 95, exp: '8+ Yrs', desc: 'High-concurrency RESTful APIs, WebSockets, connection pools, queue workers' },
        { name: 'Java Enterprise Edition (Java EE)', level: 86, exp: 'Formal', desc: 'Enterprise middleware, robust transaction handling, backend services' },
        { name: 'PHP, WordPress & Headless CMS', level: 92, exp: '10+ Yrs', desc: 'Custom plugin development, Drupal, Liferay CMS, headless content delivery' }
      ]
    },
    {
      branchId: 'bi',
      branchName: 'Business Intelligence & Telemetry',
      branchIcon: '📈',
      color: '#38ef7d',
      skills: [
        { name: 'Tableau Desktop & Server', level: 95, exp: 'Enterprise', desc: 'Executive KPI dashboards, complex LOD calculations, live database connections' },
        { name: 'Real-Time Telemetry & Command Centers', level: 96, exp: 'Production', desc: 'Streaming metrics, custom node-link visualizations, sub-second telemetry' },
        { name: 'Jasper Reports & Crystal Reports', level: 90, exp: 'Enterprise', desc: 'Enterprise document generation, parameterized compliance reports for government' },
        { name: 'SQL Schema Architecture & Tuning', level: 94, exp: '10+ Yrs', desc: 'MySQL, PostgreSQL, indexing strategies, connection pooling, failover fallback' },
        { name: 'Conversion Rate & SEO Analytics', level: 91, exp: 'Practitioner', desc: 'Traffic pattern analysis, conversion funnels, search indexing optimization' }
      ]
    },
    {
      branchId: 'infra',
      branchName: 'Cloud, Systems & Cyber Infrastructure',
      branchIcon: '🛡️',
      color: '#f59e0b',
      skills: [
        { name: 'Linux & Windows Server Admin', level: 92, exp: 'Certified', desc: 'System hardening, firewall rules, automated bash/powershell scripting, cron jobs' },
        { name: 'Web Server Administration', level: 94, exp: 'Production', desc: 'Nginx reverse proxies, Apache tuning, IIS configuration, SSL/TLS certificates' },
        { name: 'DevOps & CI/CD Pipelines', level: 93, exp: 'Enterprise', desc: 'Automated test runners, build pipelines, GitOps, zero-downtime deployment' },
        { name: 'Cloud & Edge Infrastructure', level: 95, exp: 'Production', desc: 'Vercel edge functions, Cloudflare Workers, AWS microservices, database pools' },
        { name: 'Mail & Communications Infrastructure', level: 90, exp: 'Enterprise', desc: 'Enterprise email server routing, MX/SPF/DKIM/DMARC protocols' }
      ]
    }
  ],

  missions: [
    {
      id: 'mission-jswift',
      code: 'QUEST-01',
      title: 'Jamaica Single Window for Trade (JSWIFT)',
      org: 'Jamaica Customs Agency / Government of Jamaica',
      role: 'Web Developer & Business Intelligence Developer',
      period: '2018 - PRESENT',
      tier: 'NATIONAL BOSS QUEST',
      status: 'MISSION ACTIVE // IN PRODUCTION',
      tags: ['National GovTech', 'Tableau', 'Web Applications', 'DevOps', 'Data Pipelines'],
      summary: 'Architecting and developing critical components of the national trade portal that enables Jamaican businesses and cross-border regulatory agencies to process imports, exports, and transit permits electronically.',
      deliverables: [
        'Designed and implemented citizen-facing & officer web applications.',
        'Engineered enterprise Business Intelligence dashboards and compliance reporting using Tableau and report engines.',
        'Maintained secure DevOps continuous deployment pipelines and server infrastructure.',
        'Directly reduced trade friction and regulatory delays across Jamaican ports.'
      ],
      metrics: {
        'Platform Scale': 'National Trade Platform',
        'Impact': 'All Border Clearance Agencies',
        'Availability': 'High-Availability Production'
      }
    },
    {
      id: 'mission-govjm',
      code: 'QUEST-02',
      title: 'GOV.JM - Government of Jamaica Portal',
      org: 'eGov Jamaica Limited',
      role: 'Lead Developer',
      period: '2017 - 2018',
      tier: 'NATIONAL BOSS QUEST',
      status: 'COMPLETED // NATIONAL STANDARD',
      tags: ['Lead Developer', 'Web Design Standards', 'Portal Architecture', 'Accessibility'],
      summary: 'Spearheaded the redesign and core engineering of Jamaica’s primary governmental portal, setting the definitive visual and architectural standards for all Jamaican ministry websites.',
      deliverables: [
        'Served as Lead Developer overseeing design, development, and system rollout.',
        'Authored the official "Web Design Standards for Government of Jamaica Websites".',
        'Built accessible, responsive digital service hubs for millions of Jamaican citizens and diaspora members.',
        'Established design patterns adopted across government ministries and executive departments.'
      ],
      metrics: {
        'Standard Authored': 'Official GOJ Standards',
        'Reach': 'Entire Citizenry & Diaspora',
        'Status': 'Benchmark Portal'
      }
    },
    {
      id: 'mission-disrupt-solutions',
      code: 'QUEST-03',
      title: 'Disrupt Solutions & Live Systems',
      org: 'Disrupt Group',
      role: 'Founder & Principal Systems Architect',
      period: '2020 - PRESENT',
      tier: 'ENTERPRISE CAMPAIGN',
      status: 'SCALING // HIGH VELOCITY',
      tags: ['Autonomous AI', 'Hazel Engine', 'SLU Eats', 'Payment Mesh', 'Distributed Systems'],
      summary: 'Founded Disrupt Solutions to engineer autonomous AI agents, enterprise SaaS, and mission-critical cloud software systems that operate with uncompromising reliability.',
      deliverables: [
        'Hazel: Built an autonomous algorithmic quantitative trading agent with 100% deterministic strategy execution.',
        'SLU Eats: Engineered real-time on-demand logistics dispatch handling 50,000+ monthly orders with sub-1.2s driver matching.',
        'Disrupt Marketplace: Architected Caribbean banking mesh aggregating payment clearing across 8 regional territories.',
        'Waterfall.UI: Invented dynamic cascading masonry catalog engine with real-time balance algorithms.'
      ],
      metrics: {
        'Verified Uptime': '99.99% Production',
        'Dispatch Speed': '< 1.2s Matching',
        'Monthly Deliveries': '50,000+ Orders'
      }
    },
    {
      id: 'mission-agentic-agency',
      code: 'QUEST-04',
      title: 'Automated Agentic AI Web Agency',
      org: 'Disrupt AI Labs',
      role: 'AI Systems Architect',
      period: '2024 - PRESENT',
      tier: 'FRONTIER AI RAID',
      status: 'OPERATIONAL // AUTONOMOUS',
      tags: ['Agentic Swarms', 'Bland.ai Voice', 'Vite Generation', 'Self-Closing Pipeline'],
      summary: 'Architected a fully autonomous multi-agent swarm that discovers businesses without websites, writes copy, builds Vite websites, deploys to Vercel, calls the owner with an AI voice agent, and collects payment via Stripe.',
      deliverables: [
        '11-step autonomous pipeline connecting Google Places API, AI copywriter, code review, and Bland.ai voice agent.',
        'Interactive CEO command center with live office view, queue controls, and HITL approvals.',
        'Pioneered zero-friction autonomous agency workflow powered by modern LLMs.'
      ],
      metrics: {
        'Autonomy Level': '11-Step Self-Driving',
        'Voice Latency': 'Ultra-Low Real-Time',
        'Tech Stack': 'Vite, Bun, Bland.ai, Stripe'
      }
    },
    {
      id: 'mission-disrupt-media',
      code: 'QUEST-05',
      title: 'Disrupt Media & Cinema Engine',
      org: 'Disrupt Group',
      role: 'Executive Director & Media Architect',
      period: '2022 - PRESENT',
      tier: 'CREATIVE EXPEDITION',
      status: 'ACTIVE PRODUCTIONS',
      tags: ['Cinematic Brand Films', '4K/6K Anamorphic', '3D CGI Motion', 'Omnichannel Video'],
      summary: 'Unifying high-end cinematic narrative with software engineering: 4K/6K anamorphic brand films, category-creation manifestos, and high-velocity automated omnichannel video engines.',
      deliverables: [
        'Directed category-defining brand films and tech product visual reveals.',
        'Engineered high-velocity automated video rendering pipelines for social distribution.',
        'Integrated cinematic narrative with digital software product launches.'
      ],
      metrics: {
        'Capture Fidelity': '4K / 6K Anamorphic',
        'Output Velocity': 'Omnichannel Engines',
        'Visual Grade': 'Commercial Standard'
      }
    }
  ],

  arsenal: [
    { category: 'AI & Frontier Swarms', items: ['LangGraph', 'Claude 3.7 / GPT-4o', 'DeepSeek-V3 / R1', 'Bland.ai Voice Agents', 'Unsloth LoRA', 'Vector Databases (Pinecone/Chroma)', 'HuggingFace'] },
    { category: 'Frontend & UI Frameworks', items: ['TypeScript', 'React 19', 'Next.js 15', 'Vite', 'Tailwind CSS', 'Angular 8+', 'WebGL / HTML5 Canvas', 'SCSS / PostCSS'] },
    { category: 'Backend & APIs', items: ['Node.js (ESM)', 'Express', 'Bun Runtime', 'Java Enterprise Edition', 'PHP / Modern WordPress', 'WebSockets', 'GraphQL', 'RESTful Architectures'] },
    { category: 'Data & Telemetry', items: ['Tableau Desktop / Server', 'Jasper Reports', 'Crystal Reports', 'MySQL / MariaDB', 'PostgreSQL', 'Redis Cache', 'Time-Series Telemetry'] },
    { category: 'DevOps & Infrastructure', items: ['Linux (Ubuntu/Debian/RHEL)', 'Windows Server', 'Nginx & Apache', 'Docker', 'Vercel Edge', 'Cloudflare Workers', 'Git / GitHub Actions'] }
  ],

  achievements: [
    { id: 'ach-1', title: 'National Codebase Architect', desc: 'Deployed core software for Government of Jamaica', icon: '🇯🇲', unlocked: true },
    { id: 'ach-2', title: 'Agentic Hivemind Creator', desc: 'Engineered self-driving 11-step autonomous AI agency', icon: '🤖', unlocked: true },
    { id: 'ach-3', title: 'Sub-Second Logistics Maestro', desc: 'Scaled SLU Eats dispatch engine to sub-1.2s matching', icon: '⚡', unlocked: true },
    { id: 'ach-4', title: 'Vibe Coder Supreme', desc: 'Bridged frontier AI prompts, bare-metal servers, and design', icon: '✨', unlocked: true },
    { id: 'ach-5', title: 'Secret Konami Unlock', desc: 'Discovered the hidden operator terminal easter egg', icon: '🎮', unlocked: false }
  ]
};

window.JT_PROFILE = JT_PROFILE;
