const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static assets from current directory
app.use(express.static(path.join(__dirname)));

// MySQL Database connection pool
let dbPool = null;
let useDatabaseFallback = false;
const fallbackFilePath = path.join(__dirname, 'submissions_fallback.json');

async function initializeDatabase() {
  const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'disrupt_media',
    connectionLimit: 10
  };

  try {
    console.log(`[Disrupt Media DB] Attempting to connect to MySQL database at ${dbConfig.host}:${dbConfig.port}...`);
    dbPool = mysql.createPool(dbConfig);
    
    // Test connection
    const connection = await dbPool.getConnection();
    console.log('[Disrupt Media DB] Database connection pool established successfully.');
    
    // Ensure the table exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS media_inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        service VARCHAR(150),
        budget VARCHAR(100),
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('[Disrupt Media DB] Verified/created media_inquiries table structure.');
    connection.release();
  } catch (error) {
    console.error('[Disrupt Media DB Error] Could not connect to local MySQL database.');
    console.error('[Disrupt Media DB Error] Reason:', error.message);
    console.warn('[Disrupt Media DB Fallback] Switching to file-system storage fallback (submissions_fallback.json).');
    useDatabaseFallback = true;
  }
}

// Fallback storage handler
async function saveToFallbackFile(data) {
  try {
    let submissions = [];
    try {
      const fileData = await fs.readFile(fallbackFilePath, 'utf8');
      submissions = JSON.parse(fileData);
    } catch (readError) {
      // File doesn't exist yet, start with empty array
    }
    
    const newSubmission = {
      id: submissions.length + 1,
      ...data,
      created_at: new Date().toISOString()
    };
    
    submissions.push(newSubmission);
    await fs.writeFile(fallbackFilePath, JSON.stringify(submissions, null, 2), 'utf8');
    console.log('[Disrupt Media Fallback] Saved inquiry to fallback JSON file successfully.');
    return newSubmission;
  } catch (err) {
    console.error('[Disrupt Media Fallback Error] Failed to write to fallback file:', err);
    throw err;
  }
}

// Contact Form API Endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, service, budget, description } = req.body;

  // Server-side validation
  if (!name || !email || !description) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and project scope are required fields.'
    });
  }

  const submissionData = { 
    name, 
    email, 
    phone: phone || null, 
    service: service || 'Media & Production Inquiry',
    budget: budget || 'Flexible',
    description 
  };

  if (useDatabaseFallback || !dbPool) {
    try {
      const savedData = await saveToFallbackFile(submissionData);
      return res.status(200).json({
        success: true,
        message: 'Inquiry received. Our executive producers will review your brief within 1 business day.',
        data: savedData,
        storage: 'fallback_file'
      });
    } catch (fallbackErr) {
      return res.status(500).json({
        success: false,
        message: 'Could not record inquiry. Internal server error.'
      });
    }
  }

  // Insert submission into MySQL database
  try {
    const query = 'INSERT INTO media_inquiries (name, email, phone, service, budget, description) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await dbPool.execute(query, [
      submissionData.name,
      submissionData.email,
      submissionData.phone,
      submissionData.service,
      submissionData.budget,
      submissionData.description
    ]);

    console.log(`[Disrupt Media DB] Inserted inquiry ID: ${result.insertId} from ${email}`);
    return res.status(200).json({
      success: true,
      message: 'Thank you. Your inquiry has been logged in our production queue.',
      data: { id: result.insertId, ...submissionData },
      storage: 'mysql'
    });
  } catch (dbError) {
    console.error('[Disrupt Media DB Error] Failed to insert inquiry:', dbError.message);
    
    // Attempt fallback write
    try {
      console.warn('[Disrupt Media DB Fallback] Retrying inquiry save to file system...');
      const savedData = await saveToFallbackFile(submissionData);
      return res.status(200).json({
        success: true,
        message: 'Inquiry received (saved to fallback file due to database failure).',
        data: savedData,
        storage: 'fallback_file'
      });
    } catch (retryErr) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error while saving inquiry.'
      });
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    entity: 'Disrupt Media',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    storage: useDatabaseFallback ? 'fallback_file' : 'mysql'
  });
});

// Start Server & Initialize Database
app.listen(PORT, async () => {
  console.log('====================================================');
  console.log(`⚡ Disrupt Media Server running on http://localhost:${PORT}`);
  console.log(`🎬 Narrative Architecture, Production & Cultural Interception`);
  console.log('====================================================');
  await initializeDatabase();
});
