const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'psu_agro_food',
  port: process.env.DB_PORT || 3306,
};

async function migrate() {
  try {
    const connection = await mysql.createConnection(config);
    console.log('💾 Connected to database');

    // Insert products page banner settings if not exists
    const settings = [
      ['products_banner_image', '', 'image', 'products'],
      ['products_banner_title', 'นวัตกรรมอาหารจากมหาวิทยาลัยสงขลานครินทร์', 'text', 'products'],
      ['products_banner_subtitle', 'สร้างคุณภาพชีวิตของทุกคนที่ดีกว่า', 'text', 'products'],
    ];

    for (const [key, value, type, section] of settings) {
      const [existing] = await connection.execute(
        'SELECT id FROM site_settings WHERE setting_key = ?',
        [key]
      );
      
      if (existing.length === 0) {
        await connection.execute(
          'INSERT INTO site_settings (setting_key, setting_value, setting_type, section) VALUES (?, ?, ?, ?)',
          [key, value, type, section]
        );
        console.log(`✅ Added: ${key}`);
      } else {
        console.log(`⏭️  Already exists: ${key}`);
      }
    }

    await connection.end();
    console.log('✅ Migration completed');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
