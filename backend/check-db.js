const db = require('./models/db');

(async () => {
  console.log('\n=== DATABASE CAROUSEL IMAGES ===');
  const [images] = await db.execute('SELECT id, section, image_path FROM carousel_images');
  console.table(images);
  
  console.log('\n=== FILES IN /uploads ===');
  const fs = require('fs');
  const path = require('path');
  const files = fs.readdirSync(path.join(__dirname, 'uploads'));
  console.log('Files:', files);
  
  process.exit(0);
})();
