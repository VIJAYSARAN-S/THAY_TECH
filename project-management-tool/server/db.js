const { Pool } = require('pg');
require('dotenv').config();

let poolInstance = null;
let dbWrapper = null;

async function getDb() {
  if (dbWrapper) return dbWrapper;

  poolInstance = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    const client = await poolInstance.connect();
    console.log('✅ Connected to Neon PostgreSQL');

    // Auto Schema Creation
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        priority VARCHAR(50) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
        assignee VARCHAR(255) DEFAULT '',
        status VARCHAR(50) DEFAULT 'todo' CHECK (status IN ('todo', 'inprogress', 'done')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_project
          FOREIGN KEY(project_id) 
          REFERENCES projects(id) 
          ON DELETE CASCADE
      );
    `);
    
    client.release();
  } catch (err) {
    console.error('❌ Failed to connect to Neon PostgreSQL:', err.message);
    throw err;
  }

  // Wrapper object to mimic previous API
  dbWrapper = {
    async run(query, params = []) {
      const result = await poolInstance.query(query, params);
      return {
        lastID: result.rows.length > 0 ? result.rows[0].id : null,
        changes: result.rowCount
      };
    },
    async all(query, params = []) {
      const result = await poolInstance.query(query, params);
      return result.rows;
    },
    async get(query, params = []) {
      const result = await poolInstance.query(query, params);
      return result.rows[0] || null;
    }
  };

  return dbWrapper;
}

module.exports = { getDb };
