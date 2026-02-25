const db = require('./models/db');

(async () => {
  try {
    // Convert timeline and core value settings to image type
    const updates = [
      'timeline_item1_image',
      'timeline_item2_image',
      'timeline_item3_image',
      'core_value1_image',
      'core_value2_image',
      'core_value3_image',
      'core_value4_image',
    ];

    for (const key of updates) {
      await db.execute(
        'UPDATE site_settings SET setting_type = ? WHERE setting_key = ?',
        ['image', key]
      );
      console.log(`✅ Converted ${key} to image type`);
    }

    // Also set the section for these images
    const imageSettings = [
      { key: 'timeline_item1_image', section: 'timeline' },
      { key: 'timeline_item2_image', section: 'timeline' },
      { key: 'timeline_item3_image', section: 'timeline' },
      { key: 'core_value1_image', section: 'core_values' },
      { key: 'core_value2_image', section: 'core_values' },
      { key: 'core_value3_image', section: 'core_values' },
      { key: 'core_value4_image', section: 'core_values' },
    ];

    for (const setting of imageSettings) {
      await db.execute(
        'UPDATE site_settings SET section = ? WHERE setting_key = ?',
        [setting.section, setting.key]
      );
      console.log(`✅ Set section for ${setting.key}`);
    }

    console.log('\n✅ All image settings converted successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
