const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'Boss12345',
      database: 'psu_agro_food'
    });
    
    const [rows] = await conn.execute(
      "SELECT setting_key, setting_value FROM site_settings WHERE setting_key LIKE '%timeline%' OR setting_key LIKE '%core_value%' ORDER BY setting_key"
    );
    
    console.log('\n=== About Page Image Settings ===\n');
    rows.forEach(row => {
      console.log(`${row.setting_key}: ${row.setting_value}`);
    });
    
    conn.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
