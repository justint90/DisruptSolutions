// Interactive RPG Attribute Hexagon / Radar Chart Engine (Pure SVG)

class OperatorRadar {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.stats = [
      { key: 'AI_SWARMS', label: 'AI & Swarms', value: 97, max: 100, desc: 'Multi-agent orchestration, LLM swarms, Autonomous workforces' },
      { key: 'ARCH', label: 'Sys Architecture', value: 98, max: 100, desc: 'National-scale digital platforms, distributed systems, resilient APIs' },
      { key: 'BI_DATA', label: 'BI & Telemetry', value: 95, max: 100, desc: 'Tableau, Jasper, Crystal Reports, Real-time BI data pipelines' },
      { key: 'FULLSTACK', label: 'Full-Stack Dev', value: 94, max: 100, desc: 'TypeScript, Vite/React, Angular, Java EE, Node, PHP' },
      { key: 'SYS_OPS', label: 'Cloud & DevOps', value: 92, max: 100, desc: 'Linux/Win Admin, Web/Mail servers, CI/CD, WebSockets' },
      { key: 'DESIGN', label: 'UI/UX & Design', value: 93, max: 100, desc: 'GOJ Web Standards, Design systems, Cyberpunk HUDs, Micro-interactions' }
    ];

    this.center = { x: 150, y: 150 };
    this.radius = 105;
    this.init();
  }

  init() {
    this.render();
  }

  getPolygonPoints(factor = 1) {
    const points = [];
    const count = this.stats.length;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
      const statFactor = (this.stats[i].value / this.stats[i].max) * factor;
      const r = this.radius * statFactor;
      const x = this.center.x + r * Math.cos(angle);
      const y = this.center.y + r * Math.sin(angle);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return points.join(' ');
  }

  getGridPoints(level) {
    const points = [];
    const count = this.stats.length;
    const r = this.radius * level;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
      const x = this.center.x + r * Math.cos(angle);
      const y = this.center.y + r * Math.sin(angle);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return points.join(' ');
  }

  render() {
    const count = this.stats.length;
    let gridSvg = '';

    // Concentric grid rings (20%, 40%, 60%, 80%, 100%)
    [0.25, 0.5, 0.75, 1.0].forEach((lvl) => {
      gridSvg += `<polygon points="${this.getGridPoints(lvl)}" fill="none" stroke="rgba(0, 242, 254, ${lvl === 1 ? 0.35 : 0.12})" stroke-width="1" />`;
    });

    // Radial spokes
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
      const x = this.center.x + this.radius * Math.cos(angle);
      const y = this.center.y + this.radius * Math.sin(angle);
      gridSvg += `<line x1="${this.center.x}" y1="${this.center.y}" x2="${x}" y2="${y}" stroke="rgba(0, 242, 254, 0.2)" stroke-width="1" />`;
    }

    // Outer vertex labels and interactive node dots
    let labelsSvg = '';
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
      const stat = this.stats[i];
      const r = this.radius * (stat.value / stat.max);
      const dotX = this.center.x + r * Math.cos(angle);
      const dotY = this.center.y + r * Math.sin(angle);

      // Label offset
      const labelR = this.radius + 28;
      const lx = this.center.x + labelR * Math.cos(angle);
      const ly = this.center.y + labelR * Math.sin(angle);

      labelsSvg += `
        <g class="radar-node" data-stat="${stat.key}" tabindex="0">
          <circle cx="${dotX}" cy="${dotY}" r="4.5" fill="#00f2fe" class="stat-vertex" />
          <circle cx="${dotX}" cy="${dotY}" r="9" fill="none" stroke="rgba(0, 242, 254, 0.5)" class="stat-vertex-pulse" />
          <text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" class="radar-label">
            ${stat.label} <tspan class="radar-val" fill="#38ef7d">[${stat.value}]</tspan>
          </text>
        </g>
      `;
    }

    const svg = `
      <svg viewBox="0 0 300 300" class="radar-svg" aria-label="Operator Attribute Radar Chart">
        <defs>
          <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(0, 242, 254, 0.55)" />
            <stop offset="100%" stop-color="rgba(168, 85, 247, 0.35)" />
          </linearGradient>
          <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        ${gridSvg}
        <polygon points="${this.getPolygonPoints()}" fill="url(#radarGrad)" stroke="#00f2fe" stroke-width="2" filter="url(#radarGlow)" class="radar-polygon" />
        ${labelsSvg}
      </svg>
    `;

    this.container.innerHTML = svg;

    // Attach hover sound to vertices
    this.container.querySelectorAll('.radar-node').forEach(node => {
      node.addEventListener('mouseenter', () => {
        if (window.soundEngine) window.soundEngine.playHover();
      });
    });
  }
}

window.OperatorRadar = OperatorRadar;
