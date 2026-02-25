const db = require('./models/db');

(async () => {
  try {
    // Timeline and core value image settings
    const updates = [
      { key: 'timeline_item1_image', value: 'uploads/products/timeline-2567.png' },
      { key: 'timeline_item2_image', value: 'uploads/products/timeline-2568.png' },
      { key: 'timeline_item3_image', value: 'uploads/products/timeline-present.png' },
      { key: 'core_value1_image', value: 'uploads/products/core-value-1.png' },
      { key: 'core_value2_image', value: 'uploads/products/core-value-2.png' },
      { key: 'core_value3_image', value: 'uploads/products/core-value-3.png' },
      { key: 'core_value4_image', value: 'uploads/products/core-value-4.png' },
    ];

    for (const update of updates) {
      await db.execute(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [update.key, update.value, update.value]
      );
      console.log(`✅ Set ${update.key}`);
    }

    console.log('\n✅ All About page images inserted/updated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
