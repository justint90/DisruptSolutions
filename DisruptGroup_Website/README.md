# Disrupt Group — Product & Service Catalog Platform

The official product and capabilities catalog platform for **Disrupt Group**, powered by **waterfall.ui** (dynamic cascading masonry catalog engine). This platform unifies the frontier software & AI capabilities of **Disrupt Solutions** and the cinematic media & narrative production of **Disrupt Media** under one interactive holding ecosystem.

---

## Ecosystem Structure

```
Disrupt Group (Holdings Umbrella)
├── Disrupt Solutions (Engineering & AI Subsidiary)
│   ├── Autonomous Enterprise AI Agents & Multi-Agent Swarms
│   ├── Cinematic Enterprise Web Applications & SaaS
│   ├── Cross-Platform Mobile Ecosystems (iOS & Android)
│   ├── Real-Time BI & Telemetry Command Centers
│   └── Cloud Infrastructure & Microservices Modernization
│
├── Disrupt Media (Cinema & Narrative Subsidiary)
│   ├── Cinematic Commercial & Brand Films (4K/6K Anamorphic)
│   ├── Narrative Architecture & Category Creation Manifesto
│   ├── High-Velocity Omnichannel Video Engines
│   ├── Product Reveal 3D Motion & CGI Visuals
│   └── Cultural Interception & Viral Media Strategy
│
└── Disrupt Group Joint Ecosystem Bundles
    ├── Venture Launchpad 360™ (Unified Platform + Cinema Launch)
    └── Enterprise AI & Media Transformation Suite
```

---

## Features & Capabilities

- 🌊 **Waterfall.UI Engine**: Dynamic column masonry layout that dynamically re-balances card heights across desktop, tablet, and mobile screens.
- 🎯 **Multi-Subsidiary Filtering**: Instant toggling between All Group Offerings, Disrupt Solutions, Disrupt Media, and Joint Bundles.
- 🔍 **Live Search & Category Pills**: Real-time keyword matching across titles, descriptions, and technical toolchains.
- 📑 **Dual View Mode**: Toggle seamlessly between Waterfall Masonry View and Structured Grid Matrix View.
- 🛠️ **Interactive Scope Blueprint Builder**: Real-time basket of configured services with automatic calculation of cross-subsidiary synergy discounts (-15%).
- 🛡️ **Full-Stack Enterprise API**: Express REST backend with MySQL connection pooling and automatic local JSON fallback (`submissions_fallback.json`).

---

## Project Structure

```
DisruptGroup_Website/
├── package.json              # Project manifest & dependencies
├── server.js                 # Express server & API routes
├── schema.sql                # MySQL database schema definition
├── .env.example              # Environment variables template
├── .env                      # Local environment configuration
│
├── index.html                # Main frontend catalog UI
├── style.css                 # Glassmorphic dark styling & animations
├── catalog-data.js           # Comprehensive catalog dataset
├── waterfall.js              # Waterfall.UI dynamic masonry engine
└── app.js                    # Client-side controller & blueprint logic
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and set your MySQL credentials (if MySQL is running locally):
```env
PORT=3002
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=disrupt_group
```
*(Note: If MySQL is not running, the application runs seamlessly in fallback mode, logging all requests to `submissions_fallback.json`)*.

### 3. Launch the Server
```bash
npm start
```
Visit **`http://localhost:3002`** in your browser.

---

## REST API Endpoints

- `GET /api/health` — Service healthcheck, uptime, and database connection status.
- `POST /api/submissions` — Lead intake for consultation requests and custom scope blueprints.
