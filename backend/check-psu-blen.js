const mysql = require('mysql2/promise');

(async () => {
  const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'Boss12345',
    database: 'psu_agro_food'
  });
  
  const [rows] = await pool.execute('SELECT id, name, category, image FROM products WHERE category = ? ORDER BY id', ['psu_blen']);
  
  console.log('PSU Blen Products:');
  rows.forEach(r => {
    console.log(r.id + ': ' + r.name);
    console.log('   Image: ' + r.image);
  });
  
  console.log('\nTotal PSU Blen products: ' + rows.length);
  
  pool.end();
})();
