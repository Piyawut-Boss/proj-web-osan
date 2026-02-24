const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'database.sqlite');

let SQL;
let _db;

const initDb = async () => {
  if (_db) return _db;
  
  // Initialize sql.js
  SQL = await initSqlJs();
  
  // Load existing database or create new one
  let buffer;
  if (fs.existsSync(DB_PATH)) {
    buffer = fs.readFileSync(DB_PATH);
  }
  
  _db = new SQL.Database(buffer);
  _db.run('PRAGMA journal_mode = WAL');
  _db.run('PRAGMA foreign_keys = ON');
  console.log('✅ SQLite connected:', DB_PATH);
  
  return _db;
};

const saveDb = () => {
  if (_db) {
    const data = _db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
};

// Auto-save on process exit
process.on('exit', saveDb);
process.on('SIGINT', () => {
  saveDb();
  process.exit(0);
});

const db = {
  execute: async (sql, params = []) => {
    const d = await initDb();
    const upper = sql.trim().toUpperCase();
    
    try {
      if (upper.startsWith('SELECT')) {
        const stmt = d.prepare(sql);
        stmt.bind(params);
        const rows = [];
        while (stmt.step()) {
          rows.push(stmt.getAsObject());
        }
        stmt.free();
        return [rows];
      } else {
        d.run(sql, params);
        saveDb();
        // For INSERT statements, try to get last insert ID
        let insertId = 0;
        try {
          const lastIdStmt = d.prepare('SELECT last_insert_rowid() as id');
          if (lastIdStmt.step()) {
            insertId = lastIdStmt.getAsObject().id;
          }
          lastIdStmt.free();
        } catch (e) {
          // Ignore
        }
        return [{ insertId, affectedRows: 1 }];
      }
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },
  raw: async () => {
    return await initDb();
  },
};

module.exports = db;
