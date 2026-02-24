const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.sqlite');

async function initDb() {
  try {
    console.log('🔧 Initializing SQLite database...');
    
    const SQL = await initSqlJs();
    let db;
    
    // Load existing db or create new one
    if (fs.existsSync(DB_PATH)) {
      const buffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(buffer);
      console.log('📂 Loaded existing database');
    } else {
      db = new SQL.Database();
      console.log('✨ Created new database');
    }
    
    // Create tables if they don't exist
    const statements = [
      // Admins table
      `CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Banners table
      `CREATE TABLE IF NOT EXISTS banners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(300),
        subtitle TEXT,
        image VARCHAR(500),
        link_url VARCHAR(500),
        is_active BOOLEAN DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Products table
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // News table
      `CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        content LONGTEXT,
        image VARCHAR(500),
        is_published BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Reviews table
      `CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Certificates table
      `CREATE TABLE IF NOT EXISTS certificates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(300) NOT NULL,
        image VARCHAR(500),
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Board members table
      `CREATE TABLE IF NOT EXISTS board_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(300) NOT NULL,
        position VARCHAR(300),
        section VARCHAR(50) DEFAULT 'board',
        sort_order INTEGER DEFAULT 0,
        image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Site settings table
      `CREATE TABLE IF NOT EXISTS site_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT,
        setting_type VARCHAR(50) DEFAULT 'text',
        section VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
    ];
    
    // Check if tables need to be created and insert default data
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
    const tableNames = tables.length > 0 ? tables[0].values.flat() : [];
    
    // Execute all statements
    statements.forEach(stmt => {
      db.run(stmt);
    });
    
    // Insert admin if not exists
    if (!tableNames.includes('admins')) {
      db.run(
        "INSERT INTO admins (username, password) VALUES (?, ?)",
        ['admin', '$2b$12$/U8wA8wM4UNh0D780Bd.huD7Wdy5RZnTmMWVckeRgCnCZ06CdUY46']
      );
      console.log('✅ Admin user created (username: admin, password: admin123)');
    }
    
    // Insert default certificates
    const certs = db.exec("SELECT COUNT(*) FROM certificates");
    if (certs.length === 0 || certs[0].values[0][0] === 0) {
      db.run(
        "INSERT INTO certificates (title, sort_order) VALUES (?, ?)",
        ['หนังสือให้ใช้เครื่องหมายรับรองฮาลาล', 1]
      );
      db.run(
        "INSERT INTO certificates (title, sort_order) VALUES (?, ?)",
        ['ใบอนุญาตผลิตอาหาร', 2]
      );
      db.run(
        "INSERT INTO certificates (title, sort_order) VALUES (?, ?)",
        ['ใบสำคัญการจดทะเบียนอาหาร', 3]
      );
      console.log('✅ Default certificates created');
    }
    
    // Insert default board members
    const members = db.exec("SELECT COUNT(*) FROM board_members");
    if (members.length === 0 || members[0].values[0][0] === 0) {
      // ========== Board of Directors Section (คณะกรรมการบริษัท) ==========
      // Chairman - Featured
      db.run(
        "INSERT INTO board_members (name, position, section, sort_order) VALUES (?, ?, ?, ?)",
        ['ผศ.ดร.พงค์เทพ สุธีรวุฒิ', 'ประธานบริษัท', 'board', 1]
      );
      // Board Directors
      db.run(
        "INSERT INTO board_members (name, position, section, sort_order) VALUES (?, ?, ?, ?)",
        ['รศ.ธีรวัฒน์ หังสพฤกษ์', 'กรรมการ', 'board', 2]
      );
      db.run(
        "INSERT INTO board_members (name, position, section, sort_order) VALUES (?, ?, ?, ?)",
        ['ผศ.ดร.เสาวคนธ์ วัฒนจันทร์', 'กรรมการ', 'board', 3]
      );
      db.run(
        "INSERT INTO board_members (name, position, section, sort_order) VALUES (?, ?, ?, ?)",
        ['ผศ.นพ.กิตติพงศ์ เรียบร้อย', 'กรรมการ', 'board', 4]
      );

      // ========== Management Board Section (คณะกรรมการบริหาร) ==========
      // Manager - Featured
      db.run(
        "INSERT INTO board_members (name, position, section, sort_order) VALUES (?, ?, ?, ?)",
        ['ผศ.ดร.เสาวคนธ์ วัฒนจันทร์', 'กรรมการผู้จัดการ', 'management', 1]
      );
      // Management Staff
      db.run(
        "INSERT INTO board_members (name, position, section, sort_order) VALUES (?, ?, ?, ?)",
        ['นายวัชรินทร์ เมืองจันทบุรี', 'ผู้ช่วยกรรมการผู้จัดการ', 'management', 2]
      );
      db.run(
        "INSERT INTO board_members (name, position, section, sort_order) VALUES (?, ?, ?, ?)",
        ['นายสุวิชาญ เตียวสกุล', 'ผู้ช่วยกรรมการผู้จัดการ', 'management', 3]
      );
      db.run(
        "INSERT INTO board_members (name, position, section, sort_order) VALUES (?, ?, ?, ?)",
        ['นางสาวกรวรรณ รอดเข็ม', 'ผู้จัดการโรงงาน', 'management', 4]
      );
      console.log('✅ Default board members created (8 members in 2 sections)');
    }

    // Insert default products
    const products = db.exec("SELECT COUNT(*) FROM products");
    if (products.length === 0 || products[0].values[0][0] === 0) {
      // PSU Blen Products - Chicken 350g
      db.run(
        "INSERT INTO products (name, name_en, category, description, description_en, ingredients, weight, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        ['PSU Blen อาหารปั่นเหลวพร้อมทาน สูตรผสมเนื้อไก่ 350 กรัม', 'Blenderized Diet Chicken Protein 350 g', 'psu_blen', 'อาหารปั่นเหลวพร้อมทาน สูตรผสมเนื้อไก่ ขนาด 350 กรัม', 'Blenderized Diet Chicken Protein 350 g - Original Flavour', 'เนื้อไก่,ถั่วเขียว,มอลโตเดกซ์ทริน,น้ำมันรำข้าว,โปรตีนถั่วเหลืองไอโซเลต', '350g', 1, 1]
      );
      
      // PSU Blen Products - Chicken 200g
      db.run(
        "INSERT INTO products (name, name_en, category, description, description_en, ingredients, weight, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        ['PSU Blen อาหารปั่นเหลวพร้อมทาน สูตรผสมเนื้อไก่ 200 กรัม', 'Blenderized Diet Chicken Protein 200 g', 'psu_blen', 'อาหารปั่นเหลวพร้อมทาน สูตรผสมเนื้อไก่ ขนาด 200 กรัม', 'Blenderized Diet Chicken Protein 200 g - Original Flavour', 'เนื้อไก่,ถั่วเขียว,มอลโตเดกซ์ทริน,น้ำมันรำข้าว,โปรตีนถั่วเหลืองไอโซเลต', '200g', 2, 1]
      );
      
      // Meal Box - Chicken Massaman
      db.run(
        "INSERT INTO products (name, name_en, category, description, description_en, ingredients, weight, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        ['ข้าวแกงมัสมั่นไก่', 'Chicken Massaman with Rice', 'meal_box', 'อาหารกล่องพร้อมทาน อร่อย สะดวก เก็บรักษานาน 18 เดือนที่อุณภูมิห้อง', 'Ready To Eat Meal Box - Delicious, Convenient and 18 months shelf life at room temperature', 'ข้าว,ไก่,กะทิ,พริกแกงมัสมั่น,มันฝรั่ง', '270g', 3, 1]
      );
      
      // Meal Box - Stir-Fried Garlic Chicken
      db.run(
        "INSERT INTO products (name, name_en, category, description, description_en, ingredients, weight, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        ['ข้าวไก่กระเทียม', 'Stir-Fried Garlic Chicken with Rice', 'meal_box', 'อาหารกล่องพร้อมทาน อร่อย สะดวก เก็บรักษานาน 18 เดือนที่อุณภูมิห้อง', 'Ready To Eat Meal Box - Delicious, Convenient and 18 months shelf life at room temperature', 'ข้าว,ไก่,ซอสกระเทียม', '235g', 4, 1]
      );
      
      // Meal Box - Stir-Fried Spicy Catfish
      db.run(
        "INSERT INTO products (name, name_en, category, description, description_en, ingredients, weight, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        ['ข้าวผัดเผ็ดปลาดุก', 'Stir-Fried Spicy Catfish with Rice', 'meal_box', 'อาหารกล่องพร้อมทาน อร่อย สะดวก เก็บรักษานาน 18 เดือนที่อุณภูมิห้อง', 'Ready To Eat Meal Box - Delicious, Convenient and 18 months shelf life at room temperature', 'ข้าว,ปลาดุกทอด,พริกแกง', '225g', 5, 1]
      );
      
      // Meal Box - Sour Curry Mackerel
      db.run(
        "INSERT INTO products (name, name_en, category, description, description_en, ingredients, weight, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        ['ข้าวแกงส้มปลาทู', 'Sour Curry Mackerel with Rice', 'meal_box', 'อาหารกล่องพร้อมทาน อร่อย สะดวก เก็บรักษานาน 18 เดือนที่อุณภูมิห้อง', 'Ready To Eat Meal Box - Delicious, Convenient and 18 months shelf life at room temperature', 'ข้าว,ปลาทู,พริกแกงส้ม', '270g', 6, 1]
      );
      
      console.log('✅ Default products created (6 products: 2 PSU Blen + 4 Meal Box)');
    }
    
    // Save database to file
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
    console.log('✅ Database initialized successfully at', DB_PATH);
    
    db.close();
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
}

// Run initialization
initDb();
