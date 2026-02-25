const fs = require('fs');
const path = require('path');
const db = require('./models/db');

async function createSampleImages() {
  console.log('🖼️  Creating Sample Images and Updating Database Records\n');

  const uploadsBase = path.join(__dirname, 'uploads');
  const categories = ['products', 'certificates', 'board_members', 'banners', 'news', 'reviews'];

  // Create placeholder images for each category
  for (const category of categories) {
    const categoryPath = path.join(uploadsBase, category);
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
    }
  }

  console.log('✅ Directories created/verified\n');

  // Create a simple placeholder image (base64 PNG - 1x1 pixel)
  const placeholderPNG = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
    0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
    0x00, 0x00, 0x03, 0x00, 0x01, 0x7B, 0x6B, 0x36, 0x66, 0x00, 0x00, 0x00,
    0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
  ]);

  // Update products with images
  console.log('📦 Updating Products...');
  const productImages = [
    'uploads/products/psu-blen-350g.png',
    'uploads/products/psu-blen-200g.png',
    'uploads/products/chicken-massaman.png',
    'uploads/products/garlic-chicken.png',
    'uploads/products/spicy-catfish.png',
    'uploads/products/green-curry.png'
  ];

  for (let i = 0; i < productImages.length; i++) {
    const imagePath = path.join(__dirname, productImages[i]);
    fs.writeFileSync(imagePath, placeholderPNG);

    await db.execute('UPDATE products SET image = ? WHERE id = ?', [productImages[i], i + 1]);
    console.log(`  ✅ Product ${i + 1}: ${productImages[i]}`);
  }

  // Update certificates with images
  console.log('\n🎖️  Updating Certificates...');
  const certificateImages = [
    'uploads/certificates/iso-9001.png',
    'uploads/certificates/gmp-certified.png',
    'uploads/certificates/haccp-approved.png'
  ];

  for (let i = 0; i < certificateImages.length; i++) {
    const imagePath = path.join(__dirname, certificateImages[i]);
    fs.writeFileSync(imagePath, placeholderPNG);

    await db.execute('UPDATE certificates SET image = ? WHERE id = ?', [certificateImages[i], i + 1]);
    console.log(`  ✅ Certificate ${i + 1}: ${certificateImages[i]}`);
  }

  // Update board members with images
  console.log('\n👥 Updating Board Members...');
  const boardMemberImages = [];
  const boardNames = ['chairman', 'vice-chairman', 'ceo', 'cto', 'head-sales', 'head-marketing', 'head-production', 'head-logistics'];
  
  for (let i = 0; i < boardNames.length; i++) {
    const imagePath = `uploads/board_members/${boardNames[i]}.png`;
    const fullPath = path.join(__dirname, imagePath);
    fs.writeFileSync(fullPath, placeholderPNG);

    await db.execute('UPDATE board_members SET image = ? WHERE id = ?', [imagePath, i + 1]);
    console.log(`  ✅ Board Member ${i + 1}: ${imagePath}`);
    boardMemberImages.push(imagePath);
  }

  // Update banners with images
  console.log('\n🎨 Updating Banners...');
  const bannerImages = [
    'uploads/banners/banner-main.png'
  ];

  for (let i = 0; i < bannerImages.length; i++) {
    const imagePath = path.join(__dirname, bannerImages[i]);
    fs.writeFileSync(imagePath, placeholderPNG);

    await db.execute('UPDATE banners SET image = ? WHERE id = ?', [bannerImages[i], i + 1]);
    console.log(`  ✅ Banner ${i + 1}: ${bannerImages[i]}`);
  }

  console.log('\n✅ All sample images created and database updated!');
  console.log('\n📂 Image files created:');
  console.log(`  - 6 Products`);
  console.log(`  - 3 Certificates`);
  console.log(`  - 8 Board Members`);
  console.log(`  - 1 Banner`);
  console.log('\n🎉 Ready to test image display!');

  process.exit(0);
}

createSampleImages().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
