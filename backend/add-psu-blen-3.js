const mysql = require('mysql2/promise');

(async () => {
  const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'Boss12345',
    database: 'psu_agro_food'
  });
  
  try {
    console.log('Adding third PSU Blen product...\n');
    
    const [result] = await pool.execute(
      'INSERT INTO products (name, name_en, category, description, description_en, ingredients, weight, image, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'PSU Blen อาหารปั่นเหลวพร้อมทาน สูตรผสมเนื้อไก่ 150 กรัม',
        'PSU Blen Ready-to-Drink Blended Diet Chicken Formula 150g',
        'psu_blen',
        'อาหารปั่นเหลวพร้อมทานสมดุลทางโภาค',
        'Balanced blenderized diet ready to drink',
        'Chicken, vegetables, rice',
        '150g',
        'uploads/products/psu-blen-150g.png',
        1
      ]
    );
    
    console.log('Product added successfully!');
    console.log('New product ID: ' + result.insertId);
    
    // Verify
    const [products] = await pool.execute('SELECT id, name, image FROM products WHERE category = ? ORDER BY id', ['psu_blen']);
    console.log('\nPSU Blen Products now:');
    products.forEach((p, i) => {
      console.log((i+1) + '. ' + p.name);
      console.log('   Image: ' + p.image);
    });
    
    console.log('\nTotal: ' + products.length + ' products');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    pool.end();
  }
})();
