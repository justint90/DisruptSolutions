const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

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
    database: process.env.DB_NAME || 'disrupt_solutions',
    connectionLimit: 10
  };

  try {
    console.log(`[Database] Attempting to connect to MySQL database at ${dbConfig.host}:${dbConfig.port}...`);
    dbPool = mysql.createPool(dbConfig);
    
    // Test connection
    const connection = await dbPool.getConnection();
    console.log('[Database] Database connection pool established successfully.');
    
    // Ensure the table exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('[Database] Verified/created contact_submissions table structure.');
    connection.release();
  } catch (error) {
    console.error('[Database Error] Could not connect to local MySQL database.');
    console.error('[Database Error] Reason:', error.message);
    console.warn('[Database Fallback] Switching to file-system storage fallback (submissions_fallback.json).');
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
    console.log('[Database Fallback] Saved submission to fallback JSON file successfully.');
    return newSubmission;
  } catch (err) {
    console.error('[Database Fallback Error] Failed to write to fallback file:', err);
    throw err;
  }
}

// Contact Form API Endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, description } = req.body;

  // Server-side validation
  if (!name || !email || !description) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and description fields are required.'
    });
  }

  const submissionData = { name, email, phone: phone || null, description };

  if (useDatabaseFallback || !dbPool) {
    try {
      const savedData = await saveToFallbackFile(submissionData);
      return res.status(200).json({
        success: true,
        message: 'Submission received successfully (saved to local fallback file).',
        data: savedData,
        storage: 'fallback_file'
      });
    } catch (fallbackErr) {
      return res.status(500).json({
        success: false,
        message: 'Could not record submission. Internal server error.'
      });
    }
  }

  // Insert submission into MySQL database
  try {
    const query = 'INSERT INTO contact_submissions (name, email, phone, description) VALUES (?, ?, ?, ?)';
    const [result] = await dbPool.execute(query, [
      submissionData.name,
      submissionData.email,
      submissionData.phone,
      submissionData.description
    ]);

    console.log(`[Database] Inserted submission ID: ${result.insertId} from ${email}`);
    return res.status(200).json({
      success: true,
      message: 'Thank you. Your message has been saved to the database.',
      data: { id: result.insertId, ...submissionData },
      storage: 'mysql'
    });
  } catch (dbError) {
    console.error('[Database Error] Failed to insert contact submission:', dbError.message);
    
    // Attempt fallback write since DB query failed mid-runtime
    try {
      console.warn('[Database Fallback] Retrying submission save to file system...');
      const savedData = await saveToFallbackFile(submissionData);
      return res.status(200).json({
        success: true,
        message: 'Submission received (saved to fallback file due to database failure).',
        data: savedData,
        storage: 'fallback_file'
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Database query failed and fallback storage was unavailable.'
      });
    }
  }
});

// Serve frontend router fallbacks
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize server
async function startServer() {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`  Disrupt Solutions Web Server Running Locally     `);
    console.log(`  URL: http://localhost:${PORT}                    `);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`==================================================`);
  });
}

startServer();
