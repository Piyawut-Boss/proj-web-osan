const db = require('./models/db');

(async () => {
  try {
    console.log('\n=== Database Structure ===\n');
    
    // Check products
    const [products] = await db.execute('SELECT * FROM products LIMIT 1');
    console.log('PRODUCTS columns:');
    console.log(Object.keys(products[0]));
    
    // Check board members
    const [board] = await db.execute('SELECT * FROM board_members LIMIT 1');
    console.log('\nBOARD_MEMBERS columns:');
    console.log(Object.keys(board[0]));
    
    // Check certificates
    const [certs] = await db.execute('SELECT * FROM certificates LIMIT 1');
    console.log('\nCERTIFICATES columns:');
    console.log(Object.keys(certs[0]));
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
