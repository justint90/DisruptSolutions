# Justin Taylor // Neural Command Interface (Gaming HUD Portfolio)

A personal website and systems dossier for **Justin Taylor** inspired by AAA video game menus (Cyberpunk 2077, Destiny 2, Armored Core VI, Persona 5). Engineered with cutting-edge web technologies, procedural sound effects, real-time canvas neural shaders, an interactive AI Co-Pilot runtime, and an SVG character attribute radar chart.

---

## 🎮 Features & Cutting-Edge Components

- **AAA Gaming Menu Architecture**:
  - **Tactical HUD Header**: Operator status, Level 99 designation, live UTC telemetry, Kingston JM coordinates, and a real-time requestAnimationFrame FPS monitor.
  - **Left Rail Navigation**: Seamless tab switching across `[1] PROFILE`, `[2] SKILL MATRIX`, `[3] MISSION LOG`, `[4] AI CO-PILOT`, `[5] ARSENAL`, and `[6] COMMS`.
  - **Procedural Web Audio API Synthesizer (`js/audio.js`)**: Pure code audio generation without external sound files. Includes hover blips, tab swooshes, confirm chimes, achievement fanfare, and an atmospheric 55Hz sub-bass cockpit ambient drone with lowpass LFO breathing.
  - **Neural Particle & Holodeck Canvas (`js/canvas-bg.js`)**: Interactive 60 FPS canvas with drifting nodes, mouse magnetism, flying data packets, and perspective perspective grid lines.
  - **Interactive Character Attribute Hexagon (`js/radar.js`)**: Custom SVG radar polygon mapping Justin's core RPG stats (System Architecture, AI & Swarms, Business Intelligence, Full-Stack Dev, Cloud DevOps, UI/UX Standards).
  - **JT-Co-Pilot Neural Terminal (`js/terminal.js`)**: Interactive simulated AI terminal with real-time streaming typewriter effects, command shortcuts (`/stats`, `/quests`, `/ai`, `/disrupt`, `/secret`, `/help`), and natural language answering.
  - **Gamepad & Hotkey Support (`js/gamepad.js`)**: Native browser Gamepad API integration (Xbox/PS controller support with bumper tab navigation) + keyboard shortcuts (`1-6`, `Q/E`, `M` mute, `C` CRT mode, `B` drone).
  - **CRT Holographic Scanlines (`css/animations.css`)**: Toggleable retro-futuristic CRT monitor shader and scanline flicker.
  - **Easter Egg Konami Code & Achievements**: Secret achievement unlocking system with fanfare audio.

---

## 📂 Project Structure

```
JT Info/
├── index.html              # Main HTML5 entrypoint & gaming HUD interface
├── serve.js                # Zero-dependency local Node.js static preview server
├── package.json            # Project manifest & run scripts
├── assets/
│   ├── operator_avatar.jpg # High-tech cybernetic operator portrait
│   └── gaming_hub_bg.jpg   # Atmospheric command deck ambient backdrop
├── css/
│   ├── main.css            # Core design tokens, dark void theme & fonts
│   ├── hud.css             # Top telemetry bar, status beacons, banners & footer
│   ├── menu.css            # Left tactical nav rail, panel layouts & modal
│   ├── terminal.css        # Neural AI Co-pilot console styling
│   └── animations.css      # CRT scanline shader, radar pulses & glitches
└── js/
    ├── data.js             # Verified profile data, skills, missions & achievements
    ├── audio.js            # Web Audio API procedural sound & ambient synth engine
    ├── canvas-bg.js        # Responsive cyber grid & particle canvas
    ├── radar.js            # SVG attribute hexagon radar chart
    ├── terminal.js         # Interactive AI console with streaming response
    ├── gamepad.js          # Controller API and keyboard navigation
    └── app.js              # Central application controller & DOM binding
```

---

## 🚀 Running Locally

You can open `index.html` directly in any modern browser, or run the local preview server:

```bash
# Using Node.js
node serve.js

# Or using Bun
bun serve.js
```

The site will be live at `http://localhost:3000/`.
