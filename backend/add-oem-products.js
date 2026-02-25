const db = require('./models/db');

const oemProducts = [
  {
    name: 'บริการ OEM อาหารปั่นเหลวแบบกำหนดเอง',
    name_en: 'Custom Blenderized Diet OEM Service',
    category: 'oem',
    image: 'uploads/products/oem-custom-blended.png',
    description: 'ผลิตอาหารปั่นเหลวตามสูตรและเนื้องานของลูกค้า',
    ingredients: 'ปรึกษาหารือกับลูกค้า'
  },
  {
    name: 'บริการ OEM ซอสและเครื่องปรุง',
    name_en: 'Sauce and Seasoning OEM Service',
    category: 'oem',
    image: 'uploads/products/oem-sauces.png',
    description: 'ผลิตซอส น้ำปลา เครื่องปรุง ตามสูตรของลูกค้า',
    ingredients: 'วัตถุดิบคุณภาพสูง กำหนดเองตามสูตร'
  },
  {
    name: 'บริการ OEM เครื่องดื่มสุขภาพ',
    name_en: 'Health Beverage OEM Service',
    category: 'oem',
    image: 'uploads/products/oem-beverages.png',
    description: 'ผลิตเครื่องดื่มสุขภาพและน้ำหมักตามความต้องการ',
    ingredients: 'วัตถุดิบธรรมชาติ ปราศจากสารเติมแต่ง'
  },
  {
    name: 'บริการ OEM ผลิตภัณฑ์เพื่อสุขภาพ',
    name_en: 'Health Product OEM Service',
    category: 'oem',
    image: 'uploads/products/oem-health-products.png',
    description: 'ผลิตสารอาหารเสริม ผ้าหุ้มอาหาร และผลิตภัณฑ์สุขภาพอื่นๆ',
    ingredients: 'ตามมาตรฐานอาหารและยา'
  }
];

(async () => {
  try {
    console.log('Adding OEM products...\n');
    for (const product of oemProducts) {
      const [result] = await db.execute(
        'INSERT INTO products (name, name_en, category, image, description, ingredients) VALUES (?, ?, ?, ?, ?, ?)',
        [product.name, product.name_en, product.category, product.image, product.description, product.ingredients]
      );
      console.log(`✅ Added: ${product.name}`);
      console.log(`   ID: ${result.insertId}, Image: ${product.image}\n`);
    }
    console.log('All OEM products added successfully!');
  } catch (err) {
    console.error('Error:', err.message);
  }
  process.exit();
})();
