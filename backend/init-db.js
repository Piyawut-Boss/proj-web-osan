const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'psu_agro_food';
const DB_PORT = process.env.DB_PORT || 3306;

async function initDb() {
  let connection;
  try {
    console.log('🔧 Initializing MySQL database...');
    console.log(`   Connecting to ${DB_HOST}:${DB_PORT} as ${DB_USER}...`);

    // Connect to MySQL server (without database)
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
    });
    console.log(`   ✅ Connected successfully`);

    // Create database if not exists
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log('✅ Database created or exists:', DB_NAME);

    // Select the database
    await connection.changeUser({ database: DB_NAME });

    // Create tables
    const statements = [
      // Admins table
      `CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      // Banners table
      `CREATE TABLE IF NOT EXISTS banners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(300),
        subtitle TEXT,
        image VARCHAR(500),
        link_url VARCHAR(500),
        is_active BOOLEAN DEFAULT 1,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      // Carousel images table
      `CREATE TABLE IF NOT EXISTS carousel_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        section VARCHAR(50) NOT NULL,
        image_path VARCHAR(500) NOT NULL,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_section (section)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      // Products table
      `CREATE TABLE IF NOT EXISTS products (
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      // News table
      `CREATE TABLE IF NOT EXISTS news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        content LONGTEXT,
        image VARCHAR(500),
        is_published BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      // Reviews table
      `CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      // Certificates table
      `CREATE TABLE IF NOT EXISTS certificates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(300) NOT NULL,
        image VARCHAR(500),
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      // Board members table
      `CREATE TABLE IF NOT EXISTS board_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(300) NOT NULL,
        position VARCHAR(300),
        section VARCHAR(50) DEFAULT 'board',
        sort_order INT DEFAULT 0,
        image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      // Site settings table
      `CREATE TABLE IF NOT EXISTS site_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT,
        setting_type VARCHAR(50) DEFAULT 'text',
        section VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    ];

    // Execute all statements
    for (const stmt of statements) {
      await connection.execute(stmt);
    }
    console.log('✅ All tables created successfully');

    // Check if admin exists
    const [admins] = await connection.execute('SELECT COUNT(*) as count FROM admins');
    if (admins[0].count === 0) {
      // Default admin password: admin123 (hashed with bcrypt)
      await connection.execute(
        "INSERT INTO admins (username, password) VALUES (?, ?)",
        ['admin', '$2b$12$/U8wA8wM4UNh0D780Bd.huD7Wdy5RZnTmMWVckeRgCnCZ06CdUY46']
      );
      console.log('✅ Admin user created (username: admin, password: admin123)');
    }

    // Check if certificates exist
    const [certs] = await connection.execute('SELECT COUNT(*) as count FROM certificates');
    if (certs[0].count === 0) {
      await connection.execute(
        "INSERT INTO certificates (title, sort_order) VALUES (?, ?)",
        ['หนังสือให้ใช้เครื่องหมายรับรองฮาลาล', 1]
      );
      await connection.execute(
        "INSERT INTO certificates (title, sort_order) VALUES (?, ?)",
        ['ใบอนุญาตผลิตอาหาร', 2]
      );
      await connection.execute(
        "INSERT INTO certificates (title, sort_order) VALUES (?, ?)",
        ['ใบสำคัญการจดทะเบียนอาหาร', 3]
      );
      console.log('✅ Default certificates created');
    }

    // Check if board members exist
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
      console.log('✅ Default board members created (8 members in 2 sections)');
    }

    // Check if products exist
    const [products] = await connection.execute('SELECT COUNT(*) as count FROM products');
    if (products[0].count === 0) {
      const defaultProducts = [
        ['PSU Blen อาหารปั่นเหลวพร้อมทาน สูตรผสมเนื้อไก่ 350 กรัม', 'Blenderized Diet Chicken Protein 350 g', null, null, null, 'psu_blen', 'อาหารปั่นเหลวพร้อมทาน สูตรผสมเนื้อไก่ ขนาด 350 กรัม', 'Blenderized Diet Chicken Protein 350 g - Original Flavour', null, null, null, 'เนื้อไก่,ถั่วเขียว,มอลโตเดกซ์ทริน,น้ำมันรำข้าว,โปรตีนถั่วเหลืองไอโซเลต', '350g', null, 1, 1],
        ['PSU Blen อาหารปั่นเหลวพร้อมทาน สูตรผสมเนื้อไก่ 200 กรัม', 'Blenderized Diet Chicken Protein 200 g', null, null, null, 'psu_blen', 'อาหารปั่นเหลวพร้อมทาน สูตรผสมเนื้อไก่ ขนาด 200 กรัม', 'Blenderized Diet Chicken Protein 200 g - Original Flavour', null, null, null, 'เนื้อไก่,ถั่วเขียว,มอลโตเดกซ์ทริน,น้ำมันรำข้าว,โปรตีนถั่วเหลืองไอโซเลต', '200g', null, 1, 2],
        ['ข้าวแกงมัสมั่นไก่', 'Chicken Massaman with Rice', null, null, null, 'meal_box', 'อาหารกล่องพร้อมทาน อร่อย สะดวก เก็บรักษานาน 18 เดือนที่อุณภูมิห้อง', 'Ready To Eat Meal Box - Delicious, Convenient and 18 months shelf life at room temperature', null, null, null, 'ข้าว,ไก่,กะทิ,พริกแกงมัสมั่น,มันฝรั่ง', '270g', null, 1, 3],
        ['ข้าวไก่กระเทียม', 'Stir-Fried Garlic Chicken with Rice', null, null, null, 'meal_box', 'อาหารกล่องพร้อมทาน อร่อย สะดวก เก็บรักษานาน 18 เดือนที่อุณภูมิห้อง', 'Ready To Eat Meal Box - Delicious, Convenient and 18 months shelf life at room temperature', null, null, null, 'ข้าว,ไก่,ซอสกระเทียม', '235g', null, 1, 4],
        ['ข้าวผัดเผ็ดปลาดุก', 'Stir-Fried Spicy Catfish with Rice', null, null, null, 'meal_box', 'อาหารกล่องพร้อมทาน อร่อย สะดวก เก็บรักษานาน 18 เดือนที่อุณภูมิห้อง', 'Ready To Eat Meal Box - Delicious, Convenient and 18 months shelf life at room temperature', null, null, null, 'ข้าว,ปลาดุกทอด,พริกแกง', '225g', null, 1, 5],
        ['ข้าวแกงส้มปลาทู', 'Sour Curry Mackerel with Rice', null, null, null, 'meal_box', 'อาหารกล่องพร้อมทาน อร่อย สะดวก เก็บรักษานาน 18 เดือนที่อุณภูมิห้อง', 'Ready To Eat Meal Box - Delicious, Convenient and 18 months shelf life at room temperature', null, null, null, 'ข้าว,ปลาทู,พริกแกงส้ม', '270g', null, 1, 6],
      ];

      for (const product of defaultProducts) {
        await connection.execute(
          'INSERT INTO products (name, name_en, name_zh, name_ms, name_ar, category, description, description_en, description_zh, description_ms, description_ar, ingredients, weight, image, is_active, sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          product
        );
      }
      console.log('✅ Default products created (6 products: 2 PSU Blen + 4 Meal Box)');
    }

    console.log('✅ Database initialization completed successfully!');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database initialization failed:', error.message);
    console.error(`\n📝 Connection details attempted:
   Host: ${DB_HOST}
   Port: ${DB_PORT}
   User: ${DB_USER}
   Database: ${DB_NAME}
   
💡 Troubleshooting:
   1. Ensure MySQL96 service is running: Start-Service MySQL96
   2. Check .env file has correct credentials
   3. Make sure MySQL is accessible on ${DB_HOST}:${DB_PORT}
   4. If root has no password, ensure DB_PASSWORD="" in .env`);
    if (connection) await connection.end();
    process.exit(1);
  }
}

// Run initialization
initDb();
