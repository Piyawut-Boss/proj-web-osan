const db = require('./models/db');

(async () => {
  try {
    // Update oem_tagline
    await db.execute(
      'UPDATE site_settings SET setting_value = ? WHERE setting_key = ?',
      ['เรามีทีมงาน วิจัยและพัฒนา สูตรผลิตภัณฑ์ตามที่ต้องการ', 'oem_tagline']
    );
    console.log('✅ Updated oem_tagline');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
  process.exit();
})();
