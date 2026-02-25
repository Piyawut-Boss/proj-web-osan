const db = require('./models/db');

(async () => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM site_settings LIMIT 1"
    );
    
    if (rows.length > 0) {
      console.log('\n=== Table Columns ===');
      console.log(Object.keys(rows[0]));
    }
    
    const [allRows] = await db.execute(
      "SELECT * FROM site_settings ORDER BY id"
    );
    
    console.log(`\n=== Total Settings: ${allRows.length} ===\n`);
    
    const imageSettings = allRows.filter(s => s.setting_type === 'image');
    const textSettings = allRows.filter(s => s.setting_type !== 'image');
    
    console.log(`🖼️  IMAGE SETTINGS (${imageSettings.length}):`);
    imageSettings.forEach(s => {
      console.log(`  - ${s.setting_key}`);
    });
    
    console.log(`\n📝 TEXT SETTINGS (${textSettings.length}):`);
    textSettings.forEach(s => {
      console.log(`  - ${s.setting_key}`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
