// Cutting-Edge Cybernetic Neural Grid & Particle Shimmer Canvas Engine

class CyberCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.nodeCount = 65;
    this.connectionDist = 140;
    this.mouse = { x: -1000, y: -1000, radius: 160 };
    this.width = 0;
    this.height = 0;
    this.animationFrame = null;
    this.dataPackets = [];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
      } else {
        this.animate();
      }
    });

    this.createNodes();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Adjust node density based on screen size
    if (this.width < 768) {
      this.nodeCount = 35;
      this.connectionDist = 95;
    } else {
      this.nodeCount = 70;
      this.connectionDist = 150;
    }
  }

  createNodes() {
    this.nodes = [];
    for (let i = 0; i < this.nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.65,
        vy: (Math.random() - 0.5) * 0.65,
        radius: Math.random() * 2 + 1,
        baseAlpha: Math.random() * 0.5 + 0.3,
        hue: Math.random() > 0.3 ? 185 : (Math.random() > 0.5 ? 275 : 45) // Cyan, Purple, Amber
      });
    }
  }

  animate() {
    this.render();
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Perspective floor lines (Holodeck depth grid)
    this.drawHoloGrid();

    // Spawn occasional data packet along lines
    if (Math.random() < 0.04 && this.dataPackets.length < 8) {
      const n1 = Math.floor(Math.random() * this.nodes.length);
      const n2 = Math.floor(Math.random() * this.nodes.length);
      if (n1 !== n2) {
        this.dataPackets.push({
          source: this.nodes[n1],
          target: this.nodes[n2],
          progress: 0,
          speed: 0.02 + Math.random() * 0.025
        });
      }
    }

    // Update & draw nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];

      // Movement
      node.x += node.vx;
      node.y += node.vy;

      // Wrap boundaries
      if (node.x < 0) node.x = this.width;
      if (node.x > this.width) node.x = 0;
      if (node.y < 0) node.y = this.height;
      if (node.y > this.height) node.y = 0;

      // Mouse repulsion / gentle pull
      const dx = this.mouse.x - node.x;
      const dy = this.mouse.y - node.y;
      const dist = Math.hypot(dx, dy);
      if (dist < this.mouse.radius) {
        const force = (1 - dist / this.mouse.radius) * 1.5;
        node.x -= (dx / dist) * force;
        node.y -= (dy / dist) * force;
      }

      // Draw node circle
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${node.hue}, 90%, 65%, ${node.baseAlpha})`;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = `hsla(${node.hue}, 100%, 65%, 0.6)`;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Draw connections
      for (let j = i + 1; j < this.nodes.length; j++) {
        const other = this.nodes[j];
        const cdx = other.x - node.x;
        const cdy = other.y - node.y;
        const cdist = Math.hypot(cdx, cdy);

        if (cdist < this.connectionDist) {
          const alpha = (1 - cdist / this.connectionDist) * 0.22;
          this.ctx.beginPath();
          this.ctx.moveTo(node.x, node.y);
          this.ctx.lineTo(other.x, other.y);
          this.ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          this.ctx.lineWidth = 0.85;
          this.ctx.stroke();
        }
      }
    }

    // Update & draw flying data pulses
    for (let p = this.dataPackets.length - 1; p >= 0; p--) {
      const packet = this.dataPackets[p];
      packet.progress += packet.speed;

      const px = packet.source.x + (packet.target.x - packet.source.x) * packet.progress;
      const py = packet.source.y + (packet.target.y - packet.source.y) * packet.progress;

      this.ctx.beginPath();
      this.ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      this.ctx.fillStyle = '#00f2fe';
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = '#00f2fe';
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      if (packet.progress >= 1) {
        this.dataPackets.splice(p, 1);
      }
    }
  }

  drawHoloGrid() {
    const horizon = this.height * 0.88;
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(0, 242, 254, 0.04)';
    this.ctx.lineWidth = 1;

    // Horizontal perspective lines
    const steps = 6;
    for (let k = 0; k < steps; k++) {
      const y = horizon + (this.height - horizon) * Math.pow((k + 1) / steps, 2);
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }

    // Converging perspective lines
    const centerX = this.width / 2;
    const vSteps = 12;
    for (let v = -vSteps; v <= vSteps; v++) {
      const xBottom = centerX + (v / vSteps) * (this.width * 0.7);
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, horizon - 20);
      this.ctx.lineTo(xBottom, this.height);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }
}

window.CyberCanvas = CyberCanvas;
