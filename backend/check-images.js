const db = require('./models/db');

(async () => {
  try {
    const [rows] = await db.execute('SELECT id, name, image FROM products WHERE category = ? ORDER BY id', ['psu_blen']);
    console.log('PSU Blen Products:');
    rows.forEach(row => {
      console.log(`ID ${row.id}: ${row.name.substring(0, 40)}...`);
      console.log(`  Image: ${row.image}`);
    });
  } catch (err) {
    console.error('Error:', err);
  }
  process.exit();
})();
