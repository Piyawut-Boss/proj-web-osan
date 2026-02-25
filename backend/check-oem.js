const db = require('./models/db');

(async () => {
  try {
    const [rows] = await db.execute('SELECT id, name, category, image FROM products WHERE category = ? ORDER BY id', ['oem']);
    console.log('OEM Products:');
    if (rows.length === 0) {
      console.log('No OEM products found');
    } else {
      rows.forEach(row => {
        console.log(`ID ${row.id}: ${row.name.substring(0, 50)}...`);
        console.log(`  Image: ${row.image}`);
      });
    }
  } catch (err) {
    console.error('Error:', err);
  }
  process.exit();
})();
