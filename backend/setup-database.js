const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'psu_agro_food';
const DB_PORT = process.env.DB_PORT || 3306;

const UPLOADS_DIR = path.join(__dirname, 'uploads', 'products');

async function setupDatabase() {
  let connection;
  try {
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║          PSU Agro Food - Database Setup Initialization         ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    // Step 1: Create uploads directory if it doesn't exist
    console.log('📁 Step 1: Creating uploads directory...');
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      console.log('✅ Uploads directory created:', UPLOADS_DIR);
    } else {
      console.log('✅ Uploads directory already exists');
    }

    // Step 2: Connect to MySQL
    console.log('\n🔌 Step 2: Connecting to MySQL server...');
    console.log(`   Host: ${DB_HOST}:${DB_PORT}`);
    console.log(`   User: ${DB_USER}`);

    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
    });
    console.log('✅ Connected to MySQL successfully\n');

    // Step 3: Create database
    console.log('🗄️  Step 3: Setting up database...');
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await connection.changeUser({ database: DB_NAME });
    console.log(`✅ Database created/verified: ${DB_NAME}\n`);

    // Step 4: Create tables
    console.log('📊 Step 4: Creating database tables...');
    const tables = [
      {
        name: 'admins',
        sql: `CREATE TABLE IF NOT EXISTS admins (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
      },
      {
        name: 'banners',
        sql: `CREATE TABLE IF NOT EXISTS banners (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(300),
          subtitle TEXT,
          image VARCHAR(500),
          link_url VARCHAR(500),
          is_active BOOLEAN DEFAULT 1,
          sort_order INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
      },
      {
        name: 'products',
        sql: `CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(300) NOT NULL,
          name_en VARCHAR(300),
          name_zh VARCHAR(300),
          name_ms VARCHAR(300),
          name_ar VARCHAR(300),
          category VARCHAR(50) DEFAULT 'psu_blen',
          description TEXT,
          description_en TEXT,
          description_zh TEXT,
          description_ms TEXT,
          description_ar TEXT,
          ingredients TEXT,
          weight VARCHAR(100),
          image VARCHAR(500),
          is_active BOOLEAN DEFAULT 1,
          sort_order INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
      },
      {
        name: 'news',
        sql: `CREATE TABLE IF NOT EXISTS news (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(500) NOT NULL,
          description TEXT,
          content LONGTEXT,
          image VARCHAR(500),
          is_published BOOLEAN DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
      },
      {
        name: 'reviews',
        sql: `CREATE TABLE IF NOT EXISTS reviews (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(500) NOT NULL,
          description TEXT,
          image VARCHAR(500),
          is_active BOOLEAN DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
      },
      {
        name: 'certificates',
        sql: `CREATE TABLE IF NOT EXISTS certificates (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(300) NOT NULL,
          image VARCHAR(500),
          sort_order INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
      },
      {
        name: 'board_members',
        sql: `CREATE TABLE IF NOT EXISTS board_members (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(300) NOT NULL,
          position VARCHAR(300),
          section VARCHAR(50) DEFAULT 'board',
          sort_order INT DEFAULT 0,
          image VARCHAR(500),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
      },
      {
        name: 'site_settings',
        sql: `CREATE TABLE IF NOT EXISTS site_settings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          setting_key VARCHAR(100) NOT NULL UNIQUE,
          setting_value TEXT,
          setting_type VARCHAR(50) DEFAULT 'text',
          section VARCHAR(100),
          display_value TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
      }
    ];

    for (const table of tables) {
      await connection.execute(table.sql);
      console.log(`   ✅ ${table.name}`);
    }

    // Step 5: Initialize seed data
    console.log('\n🌱 Step 5: Initializing seed data...');

    // Check and create admin
    const [admins] = await connection.execute('SELECT COUNT(*) as count FROM admins');
    if (admins[0].count === 0) {
      // Default admin password: admin123 (bcrypt hashed)
      await connection.execute(
        "INSERT INTO admins (username, password) VALUES (?, ?)",
        ['admin', '$2b$12$/U8wA8wM4UNh0D780Bd.huD7Wdy5RZnTmMWVckeRgCnCZ06CdUY46']
      );
      console.log('   ✅ Admin user created (username: admin, password: admin123)');
    } else {
      console.log('   ⚠️  Admin user already exists');
    }

    // Check and create certificates
    const [certs] = await connection.execute('SELECT COUNT(*) as count FROM certificates');
    if (certs[0].count === 0) {
      const certificates = [
        ['หนังสือให้ใช้เครื่องหมายรับรองฮาลาล', 1],
        ['ใบอนุญาตผลิตอาหาร', 2],
        ['ใบสำคัญการจดทะเบียนอาหาร', 3],
      ];

      for (const [title, sort] of certificates) {
        await connection.execute(
          'INSERT INTO certificates (title, sort_order) VALUES (?, ?)',
          [title, sort]
        );
      }
      console.log('   ✅ Certificates created (3 items)');
    } else {
      console.log('   ⚠️  Certificates already exist');
    }

    // Check and create board members
    const [members] = await connection.execute('SELECT COUNT(*) as count FROM board_members');
    if (members[0].count === 0) {
      const boardMembers = [
        ['ผศ.ดร.พงค์เทพ สุธีรวุฒิ', 'ประธานบริษัท', 'board', 1],
        ['รศ.ธีรวัฒน์ หังสพฤกษ์', 'กรรมการ', 'board', 2],
        ['ผศ.ดร.เสาวคนธ์ วัฒนจันทร์', 'กรรมการ', 'board', 3],
        ['ผศ.นพ.กิตติพงศ์ เรียบร้อย', 'กรรมการ', 'board', 4],
        ['ผศ.ดร.เสาวคนธ์ วัฒนจันทร์', 'กรรมการผู้จัดการ', 'management', 1],
        ['นายวัชรินทร์ เมืองจันทบุรี', 'ผู้ช่วยกรรมการผู้จัดการ', 'management', 2],
        ['นายสุวิชาญ เตียวสกุล', 'ผู้ช่วยกรรมการผู้จัดการ', 'management', 3],
        ['นางสาวกรวรรณ รอดเข็ม', 'ผู้จัดการโรงงาน', 'management', 4],
      ];

      for (const [name, position, section, sort] of boardMembers) {
        await connection.execute(
          'INSERT INTO board_members (name, position, section, sort_order) VALUES (?, ?, ?, ?)',
          [name, position, section, sort]
        );
      }
      console.log('   ✅ Board members created (8 members)');
    } else {
      console.log('   ⚠️  Board members already exist');
    }

    // Check and create products
    const [products] = await connection.execute('SELECT COUNT(*) as count FROM products');
    if (products[0].count === 0) {
      const defaultProducts = [
        ['PSU Blen อาหารปั่นเหลวพร้อมทาน สูตรผสมเนื้อไก่ 350 กรัม', 'Blenderized Diet Chicken Protein 350 g', null, null, null, 'psu_blen', 'อาหารปั่นเหลวพร้อมทาน สูตรผสมเนื้อไก่ ขนาด 350 กรัม', 'Blenderized Diet Chicken Protein 350 g - Original Flavour', null, null, null, 'เนื้อไก่,ถั่วเขียว,มอลโตเดกซ์ทริน,น้ำมันรำข้าว,โปรตีนถั่วเหลืองไอโซเลต', '350g', 'uploads/products/psu-blen-350g.png', 1, 1],
        ['PSU Blen อาหารปั่นเหลวพร้อมทาน สูตรผสมเนื้อไก่ 200 กรัม', 'Blenderized Diet Chicken Protein 200 g', null, null, null, 'psu_blen', 'อาหารปั่นเหลวพร้อมทาน สูตรผสมเนื้อไก่ ขนาด 200 กรัม', 'Blenderized Diet Chicken Protein 200 g - Original Flavour', null, null, null, 'เนื้อไก่,ถั่วเขียว,มอลโตเดกซ์ทริน,น้ำมันรำข้าว,โปรตีนถั่วเหลืองไอโซเลต', '200g', 'uploads/products/psu-blen-200g.png', 1, 2],
        ['PSU Blen อาหารปั่นเหลวพร้อมทาน สูตรผสมเนื้อไก่ 150 กรัม', 'Blenderized Diet Chicken Protein 150 g', null, null, null, 'psu_blen', 'อาหารปั่นเหลวพร้อมทาน สูตรผสมเนื้อไก่ ขนาด 150 กรัม', 'Blenderized Diet Chicken Protein 150 g - Original Flavour', null, null, null, 'เนื้อไก่,ถั่วเขียว,มอลโตเดกซ์ทริน,น้ำมันรำข้าว,โปรตีนถั่วเหลืองไอโซเลต', '150g', 'uploads/products/psu-blen-150g.png', 1, 3],
        ['ข้าวแกงมัสมั่นไก่', 'Chicken Massaman with Rice', null, null, null, 'meal_box', 'อาหารกล่องพร้อมทาน อร่อย สะดวก เก็บรักษานาน 18 เดือนที่อุณภูมิห้อง', 'Ready To Eat Meal Box - Delicious, Convenient and 18 months shelf life at room temperature', null, null, null, 'ข้าว,ไก่,กะทิ,พริกแกงมัสมั่น,มันฝรั่ง', '270g', 'uploads/products/meal-box-1.png', 1, 4],
        ['ข้าวไก่กระเทียม', 'Stir-Fried Garlic Chicken with Rice', null, null, null, 'meal_box', 'อาหารกล่องพร้อมทาน อร่อย สะดวก เก็บรักษานาน 18 เดือนที่อุณภูมิห้อง', 'Ready To Eat Meal Box - Delicious, Convenient and 18 months shelf life at room temperature', null, null, null, 'ข้าว,ไก่,ซอสกระเทียม', '235g', 'uploads/products/meal-box-2.png', 1, 5],
        ['ข้าวผัดเผ็ดปลาดุก', 'Stir-Fried Spicy Catfish with Rice', null, null, null, 'meal_box', 'อาหารกล่องพร้อมทาน อร่อย สะดวก เก็บรักษานาน 18 เดือนที่อุณภูมิห้อง', 'Ready To Eat Meal Box - Delicious, Convenient and 18 months shelf life at room temperature', null, null, null, 'ข้าว,ปลาดุกทอด,พริกแกง', '225g', 'uploads/products/meal-box-3.png', 1, 6],
        ['ข้าวแกงส้มปลาทู', 'Sour Curry Mackerel with Rice', null, null, null, 'meal_box', 'อาหารกล่องพร้อมทาน อร่อย สะดวก เก็บรักษานาน 18 เดือนที่อุณภูมิห้อง', 'Ready To Eat Meal Box - Delicious, Convenient and 18 months shelf life at room temperature', null, null, null, 'ข้าว,ปลาทู,พริกแกงส้ม', '270g', 'uploads/products/meal-box-4.png', 1, 7],
        ['OEM Blenderized Diet Type A', 'OEM Blenderized Diet Type A', null, null, null, 'oem', 'OEM อาหารปั่นเหลวตามสูตรลูกค้า', 'OEM Blenderized Diet Service', null, null, null, 'ส่วนประกอบตามสูตรลูกค้า', 'Custom', 'uploads/products/oem-1.png', 1, 8],
        ['OEM Blenderized Diet Type B', 'OEM Blenderized Diet Type B', null, null, null, 'oem', 'OEM อาหารปั่นเหลวตามสูตรลูกค้า', 'OEM Blenderized Diet Service', null, null, null, 'ส่วนประกอบตามสูตรลูกค้า', 'Custom', 'uploads/products/oem-2.png', 1, 9],
        ['OEM Meal Box Type A', 'OEM Meal Box Type A', null, null, null, 'oem', 'OEM อาหารกล่องพร้อมทานตามสูตรลูกค้า', 'OEM Ready To Eat Meal Box Service', null, null, null, 'ส่วนประกอบตามสูตรลูกค้า', 'Custom', 'uploads/products/oem-3.png', 1, 10],
        ['OEM Meal Box Type B', 'OEM Meal Box Type B', null, null, null, 'oem', 'OEM อาหารกล่องพร้อมทานตามสูตรลูกค้า', 'OEM Ready To Eat Meal Box Service', null, null, null, 'ส่วนประกอบตามสูตรลูกค้า', 'Custom', 'uploads/products/oem-4.png', 1, 11],
      ];

      for (const product of defaultProducts) {
        await connection.execute(
          'INSERT INTO products (name, name_en, name_zh, name_ms, name_ar, category, description, description_en, description_zh, description_ms, description_ar, ingredients, weight, image, is_active, sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          product
        );
      }
      console.log('   ✅ Products created (11 items: 3 PSU Blen, 4 Meal Box, 4 OEM)');
    } else {
      console.log('   ⚠️  Products already exist');
    }

    // Step 6: Initialize site settings (images)
    console.log('\n⚙️  Step 6: Initializing site settings...');
    const imageSettings = [
      ['timeline_item1_image', 'uploads/products/timeline-2567.png', 'image', 'timeline', 'uploads/products/timeline-2567.png'],
      ['timeline_item2_image', 'uploads/products/timeline-2568.png', 'image', 'timeline', 'uploads/products/timeline-2568.png'],
      ['timeline_item3_image', 'uploads/products/timeline-present.png', 'image', 'timeline', 'uploads/products/timeline-present.png'],
      ['core_value1_image', 'uploads/products/core-value-1.png', 'image', 'core_values', 'uploads/products/core-value-1.png'],
      ['core_value2_image', 'uploads/products/core-value-2.png', 'image', 'core_values', 'uploads/products/core-value-2.png'],
      ['core_value3_image', 'uploads/products/core-value-3.png', 'image', 'core_values', 'uploads/products/core-value-3.png'],
      ['core_value4_image', 'uploads/products/core-value-4.png', 'image', 'core_values', 'uploads/products/core-value-4.png'],
      ['oem_image', 'uploads/products/oem-banner.png', 'image', 'oem', 'uploads/products/oem-banner.png'],
      ['site_title', 'PSU Agro Food', 'text', 'general', 'PSU Agro Food'],
      ['site_tagline', 'Food Innovation for Better Health', 'text', 'general', 'Food Innovation for Better Health'],
    ];

    for (const [key, value, type, section, displayValue] of imageSettings) {
      await connection.execute(
        'INSERT INTO site_settings (setting_key, setting_value, setting_type, section, display_value) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE setting_value=?, setting_type=?, section=?, display_value=?',
        [key, value, type, section, displayValue, value, type, section, displayValue]
      );
    }
    console.log('   ✅ Site settings configured (8 image settings + 2 general settings)');

    // Step 7: Generate images if they don't exist
    console.log('\n🎨 Step 7: Generating product images...');
    await generateImages();

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║                  ✅ SETUP COMPLETED SUCCESSFULLY              ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    console.log('📝 Next steps:');
    console.log('   1. npm install (if not done)');
    console.log('   2. npm run dev (to start the server)\n');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error(`   1. Ensure MySQL service is running`);
    console.error(`   2. Check .env file has correct credentials`);
    console.error(`   3. Connection details attempted:`);
    console.error(`      - Host: ${DB_HOST}:${DB_PORT}`);
    console.error(`      - User: ${DB_USER}`);
    console.error(`      - Database: ${DB_NAME}\n`);

    if (connection) await connection.end();
    process.exit(1);
  }
}

async function generateImages() {
  try {
    const pngjs = require('pngjs').PNG;

    const images = [
      // Products
      { name: 'psu-blen-350g.png', rgb: { r: 255, g: 120, b: 60 } },
      { name: 'psu-blen-200g.png', rgb: { r: 100, g: 180, b: 255 } },
      { name: 'psu-blen-150g.png', rgb: { r: 60, g: 200, b: 120 } },
      { name: 'meal-box-1.png', rgb: { r: 220, g: 100, b: 150 } },
      { name: 'meal-box-2.png', rgb: { r: 150, g: 180, b: 100 } },
      { name: 'meal-box-3.png', rgb: { r: 200, g: 150, b: 80 } },
      { name: 'meal-box-4.png', rgb: { r: 100, g: 150, b: 200 } },
      { name: 'oem-1.png', rgb: { r: 180, g: 100, b: 180 } },
      { name: 'oem-2.png', rgb: { r: 100, g: 180, b: 180 } },
      { name: 'oem-3.png', rgb: { r: 200, g: 180, b: 100 } },
      { name: 'oem-4.png', rgb: { r: 180, g: 150, b: 200 } },
      // Timeline
      { name: 'timeline-2567.png', rgb: { r: 255, g: 200, b: 87 } },
      { name: 'timeline-2568.png', rgb: { r: 135, g: 206, b: 250 } },
      { name: 'timeline-present.png', rgb: { r: 76, g: 175, b: 80 } },
      // Core Values
      { name: 'core-value-1.png', rgb: { r: 233, g: 30, b: 99 } },
      { name: 'core-value-2.png', rgb: { r: 103, g: 58, b: 183 } },
      { name: 'core-value-3.png', rgb: { r: 0, g: 188, b: 212 } },
      { name: 'core-value-4.png', rgb: { r: 255, g: 152, b: 0 } },
      // OEM Banner
      { name: 'oem-banner.png', rgb: { r: 156, g: 39, b: 176 } },
      // Certificates
      { name: 'certificate-1.png', rgb: { r: 255, g: 193, b: 7 } },
      { name: 'certificate-2.png', rgb: { r: 244, g: 67, b: 54 } },
      { name: 'certificate-3.png', rgb: { r: 33, g: 150, b: 243 } },
      // Board Members
      { name: 'board-member-1.png', rgb: { r: 66, g: 133, b: 244 } },
      { name: 'board-member-2.png', rgb: { r: 219, g: 112, b: 147 } },
      { name: 'board-member-3.png', rgb: { r: 102, g: 205, b: 170 } },
      { name: 'board-member-4.png', rgb: { r: 184, g: 134, b: 11 } },
      { name: 'board-member-5.png', rgb: { r: 72, g: 209, b: 204 } },
      { name: 'board-member-6.png', rgb: { r: 199, g: 21, b: 133 } },
      { name: 'board-member-7.png', rgb: { r: 34, g: 139, b: 34 } },
      { name: 'board-member-8.png', rgb: { r: 210, g: 105, b: 30 } },
    ];

    let createdCount = 0;
    for (const image of images) {
      const filepath = path.join(UPLOADS_DIR, image.name);
      if (!fs.existsSync(filepath)) {
        createGradientImage(filepath, image.rgb);
        createdCount++;
      }
    }

    if (createdCount > 0) {
      console.log(`   ✅ Generated ${createdCount} new images`);
    } else {
      console.log('   ✅ All images already exist');
    }
  } catch (error) {
    console.log('   ⚠️  Image generation skipped (pngjs not available, images can be uploaded later)');
  }
}

function createGradientImage(filepath, rgb) {
  try {
    const pngjs = require('pngjs').PNG;
    const png = new pngjs({ width: 400, height: 300 });

    for (let y = 0; y < png.height; y++) {
      for (let x = 0; x < png.width; x++) {
        const idx = (png.width * y + x) << 2;
        const gradient = (x + y) / (png.width + png.height);

        png.data[idx] = Math.floor(rgb.r * gradient);
        png.data[idx + 1] = Math.floor(rgb.g * gradient);
        png.data[idx + 2] = Math.floor(rgb.b * gradient);
        png.data[idx + 3] = 255;
      }
    }

    png.pack().pipe(fs.createWriteStream(filepath));
  } catch (error) {
    // Skip image generation if pngjs is not available
  }
}

// Run setup
setupDatabase();
