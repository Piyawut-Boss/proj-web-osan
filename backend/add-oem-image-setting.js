const db = require('./models/db');

(async () => {
  try {
    // Check if oem_image setting exists
    const [check] = await db.execute('SELECT * FROM site_settings WHERE setting_key = ?', ['oem_image']);
    
    if (check.length === 0) {
      // Add the oem_image setting
      await db.execute(
        'INSERT INTO site_settings (setting_key, setting_value, setting_type, section) VALUES (?, ?, ?, ?)',
        ['oem_image', '', 'image', 'oem']
      );
      console.log('✅ Added oem_image setting to database');
    } else {
      console.log('ℹ️  oem_image setting already exists');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
  process.exit();
})();
