# Disrupt Solutions Enterprise Platform

This is the codebase for the **Disrupt Solutions** website. It features premium Website and Mobile App development, Web App solutions, and AI & Business Intelligence (BI) consultancy services. The site has a cinematic dark-slate UI, custom mathematical canvas node-particles in the hero background, micro-interactions, responsive section layout management, and an interactive lead capture form that integrates with a local **MySQL database** (with automatic local file-system fallback support).

## Project Structure

```
Project_999/
│
├── package.json              # Node.js project manifest & dependencies
├── server.js                 # Express API server & database pool connector
├── schema.sql                # SQL database & table generation script
├── .env.example              # Configuration environment template
│
├── index.html                # Frontend entrypoint (structured sections)
├── style.css                 # Cinematic stylesheet (glassmorphism cards, layouts, animations)
└── app.js                    # Client-side script (particle physics, modals, and API requests)
```

---

## Getting Started (Local Setup)

Follow these instructions to run the application and set up the local database connection.

### Prerequisites
*   [Node.js](https://nodejs.org/) installed on your machine.
*   [MySQL Server](https://dev.mysql.com/downloads/installer/) running locally.

### Step 1: Install Dependencies
Open your command terminal inside the project directory (`Project_999/`) and install the Node packages:
```bash
npm install
```

### Step 2: Initialize the MySQL Database
1.  Open your MySQL client (Command Line, Workbench, or DBeaver) and log in as your user.
2.  Run the query commands in `schema.sql` to initialize the database and tables:
    ```sql
    SOURCE schema.sql;
    ```
    *This creates the database `disrupt_solutions` and the database table `contact_submissions`.*

### Step 3: Configure Environment Variables
1.  Copy the example environment template into a new `.env` file:
    *   **Windows (PowerShell):** `Copy-Item .env.example .env`
    *   **Bash:** `cp .env.example .env`
2.  Open the newly created `.env` file and insert your MySQL credentials:
    ```env
    PORT=3000
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_NAME=disrupt_solutions
    ```

### Step 4: Run the Server
Launch the backend server:
```bash
npm start
```

Your console should display:
```text
[Database] Attempting to connect to MySQL database at 127.0.0.1:3306...
[Database] Database connection pool established successfully.
[Database] Verified/created contact_submissions table structure.
==================================================
  Disrupt Solutions Web Server Running Locally     
  URL: http://localhost:3000                    
  Environment: development
==================================================
```

Open your browser and navigate to **`http://localhost:3000`** to view the live site.

---

## Robust Fallback System (Works out-of-the-box!)

If you do not have a local MySQL instance running yet, or if database configurations are incorrect, **the server will automatically switch to a local file-system database fallback (`submissions_fallback.json`)**. 

This allows you to load the site, navigate the animations, and submit the contact audit form right away. Submissions will be logged inside the workspace in `submissions_fallback.json`. Once your MySQL instance is connected, the server will switch back to database writes on its next restart.
