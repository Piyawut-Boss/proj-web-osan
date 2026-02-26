const db = require('./models/db');

(async () => {
  try {
    console.log('🔄 Checking and fixing showcase_image setting...');
    
    // Check if showcase_image already exists
    const [existing] = await db.execute('SELECT id FROM site_settings WHERE setting_key = ?', ['showcase_image']);
    
    if (existing && existing.length > 0) {
      console.log('✓ showcase_image already exists in database');
    } else {
      // Try to insert showcase_image - try with label first, then without
      try {
        await db.execute(
          'INSERT INTO site_settings (setting_key, setting_value, setting_type, section, label) VALUES (?, ?, ?, ?, ?)',
          ['showcase_image', '', 'image', 'showcase', 'รูปภาพ Showcase']
        );
        console.log('✅ Added showcase_image with label');
      } catch(e) {
        console.log('⚠️  Trying without label field...');
        await db.execute(
          'INSERT INTO site_settings (setting_key, setting_value, setting_type, section) VALUES (?, ?, ?, ?)',
          ['showcase_image', '', 'image', 'showcase']
        );
        console.log('✅ Added showcase_image without label');
      }
    }
    
    // Verify both image settings now exist
    const [all] = await db.execute('SELECT setting_key, section, setting_type FROM site_settings WHERE setting_key IN ("showcase_image", "mealbox_image") ORDER BY setting_key');
    console.log('\n✓ Image settings status:');
    if (all && all.length > 0) {
      all.forEach(s => console.log(`  - ${s.setting_key} (type: ${s.setting_type}, section: ${s.section})`));
    }
    
    process.exit(0);
  } catch(err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
