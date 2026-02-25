const db = require('./models/db');

(async () => {
  try {
    // Update oem_image setting to use the generated OEM image
    const imagePath = 'uploads/products/oem-custom-blended.png';
    
    await db.execute(
      'UPDATE site_settings SET setting_value = ? WHERE setting_key = ?',
      [imagePath, 'oem_image']
    );
    
    console.log('✅ Updated oem_image setting');
    console.log(`   Image path: ${imagePath}`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
  process.exit();
})();
