const mysql = require('mysql2/promise');
require('dotenv').config();

// Connection pool for MySQL
let pool;

const initPool = async () => {
  if (pool) return pool;
  
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'psu_agro_food',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelayMs: 0,
    });
    
    console.log('✅ MySQL connected:', process.env.DB_NAME || 'psu_agro_food');
    return pool;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    throw error;
  }
};

const db = {
  execute: async (sql, params = []) => {
    try {
      const p = await initPool();
      const connection = await p.getConnection();
      
      try {
        const [results] = await connection.execute(sql, params);
        
        // For INSERT queries, get the insert ID
        if (sql.trim().toUpperCase().startsWith('INSERT')) {
          return [{ insertId: results.insertId, affectedRows: results.affectedRows }];
        }
        
        // For SELECT queries, return the rows directly
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
          return [results];
        }
        
        // For UPDATE/DELETE, return affected rows
        return [{ affectedRows: results.affectedRows }];
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Database error:', error.message);
      throw error;
    }
  },

  raw: async () => {
    return await initPool();
  },

  close: async () => {
    if (pool) await pool.end();
  }
};

module.exports = db;
