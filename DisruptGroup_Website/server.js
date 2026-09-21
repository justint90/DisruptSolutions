const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const FALLBACK_FILE = path.join(__dirname, 'submissions_fallback.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// MySQL Pool setup
let pool = null;
let dbConnected = false;

function initDatabasePool() {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'disrupt_group',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 4000
    });

    pool.getConnection()
      .then(conn => {
        dbConnected = true;
        console.log('✅ Connected to MySQL database:', process.env.DB_NAME || 'disrupt_group');
        conn.release();
      })
      .catch(err => {
        dbConnected = false;
        console.warn('⚠️  MySQL connection not active, using local file-system fallback (submissions_fallback.json). Reason:', err.message);
      });
  } catch (err) {
    dbConnected = false;
    console.warn('⚠️  Database pool creation skipped, using local fallback mode.');
  }
}

initDatabasePool();

// Helper to save to local fallback JSON
function saveToFallback(submission) {
  try {
    let existing = [];
    if (fs.existsSync(FALLBACK_FILE)) {
      const data = fs.readFileSync(FALLBACK_FILE, 'utf8');
      if (data.trim()) {
        existing = JSON.parse(data);
      }
    }
    existing.unshift({
      id: 'FALLBACK_' + Date.now(),
      ...submission,
      created_at: new Date().toISOString()
    });
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(existing, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to write to fallback file:', err);
    return false;
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'fallback_mode',
    service: 'Disrupt Group Catalog Platform'
  });
});

// Submit consultation request or blueprint quote
app.post('/api/submissions', async (req, res) => {
  const {
    name,
    email,
    company,
    phone,
    subsidiary_interest,
    project_type,
    budget_range,
    timeline,
    selected_services,
    total_estimated_value,
    synergy_discount_applied,
    message
  } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and Email are required.' });
  }

  const payload = {
    name,
    email,
    company: company || '',
    phone: phone || '',
    subsidiary_interest: subsidiary_interest || 'Disrupt Group (All)',
    project_type: project_type || 'General Consultation',
    budget_range: budget_range || 'Not specified',
    timeline: timeline || 'Immediate',
    selected_services: Array.isArray(selected_services) ? selected_services : [],
    total_estimated_value: total_estimated_value || 'Custom Quote',
    synergy_discount_applied: synergy_discount_applied || 'None',
    message: message || ''
  };

  if (dbConnected && pool) {
    try {
      const query = `
        INSERT INTO consultation_submissions 
        (name, email, company, phone, subsidiary_interest, project_type, budget_range, timeline, selected_services, total_estimated_value, synergy_discount_applied, message)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await pool.execute(query, [
        payload.name,
        payload.email,
        payload.company,
        payload.phone,
        payload.subsidiary_interest,
        payload.project_type,
        payload.budget_range,
        payload.timeline,
        JSON.stringify(payload.selected_services),
        payload.total_estimated_value,
        payload.synergy_discount_applied,
        payload.message
      ]);

      return res.status(200).json({
        success: true,
        message: 'Submission received and recorded in enterprise database.',
        id: result.insertId,
        storage: 'database'
      });
    } catch (dbErr) {
      console.error('Database write failed, writing to fallback:', dbErr.message);
      saveToFallback(payload);
      return res.status(200).json({
        success: true,
        message: 'Submission received and securely logged to local storage.',
        storage: 'fallback'
      });
    }
  } else {
    saveToFallback(payload);
    return res.status(200).json({
      success: true,
      message: 'Submission received and logged (Fallback Mode).',
      storage: 'fallback'
    });
  }
});

// Fallback direct root routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 DISRUPT GROUP Product Catalog Platform`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`💼 Subsidiaries: Disrupt Solutions | Disrupt Media`);
  console.log(`🌊 Engine: Waterfall.UI Dynamic Cascading Catalog`);
  console.log(`=======================================================`);
});
