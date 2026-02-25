const db = require('./models/db');

(async () => {
  try {
    const [rows] = await db.execute('SELECT setting_key, section FROM settings WHERE section = ? ORDER BY setting_key', ['oem']);
    console.log('OEM Settings:');
    if (rows.length === 0) {
      console.log('No OEM settings found');
    } else {
      rows.forEach(row => {
        console.log(`  - ${row.setting_key} (${row.section})`);
      });
    }
  } catch (err) {
    console.error('Error:', err);
  }
  process.exit();
})();
