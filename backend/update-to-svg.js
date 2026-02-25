const db = require('./models/db');

async function updateImagePaths() {
  console.log('🔄 Updating Database Image Paths to SVG\n');

  try {
    // Update Products
    console.log('📦 Updating Products...');
    const productUpdates = [
      { id: 1, image: 'uploads/products/psu-blen-350g.svg' },
      { id: 2, image: 'uploads/products/psu-blen-200g.svg' },
      { id: 3, image: 'uploads/products/chicken-massaman.svg' },
      { id: 4, image: 'uploads/products/garlic-chicken.svg' },
      { id: 5, image: 'uploads/products/spicy-catfish.svg' },
      { id: 6, image: 'uploads/products/green-curry.svg' },
    ];

    for (const update of productUpdates) {
      await db.execute('UPDATE products SET image = ? WHERE id = ?', [update.image, update.id]);
      console.log(`  ✅ Product ${update.id}: ${update.image}`);
    }

    // Update Certificates
    console.log('\n🎖️  Updating Certificates...');
    const certificateUpdates = [
      { id: 1, image: 'uploads/certificates/iso-9001.svg' },
      { id: 2, image: 'uploads/certificates/gmp-certified.svg' },
      { id: 3, image: 'uploads/certificates/haccp-approved.svg' },
    ];

    for (const update of certificateUpdates) {
      await db.execute('UPDATE certificates SET image = ? WHERE id = ?', [update.image, update.id]);
      console.log(`  ✅ Certificate ${update.id}: ${update.image}`);
    }

    // Update Board Members
    console.log('\n👥 Updating Board Members...');
    const boardUpdates = [
      { id: 1, image: 'uploads/board_members/chairman.svg' },
      { id: 2, image: 'uploads/board_members/vice-chairman.svg' },
      { id: 3, image: 'uploads/board_members/ceo.svg' },
      { id: 4, image: 'uploads/board_members/cto.svg' },
      { id: 5, image: 'uploads/board_members/head-sales.svg' },
      { id: 6, image: 'uploads/board_members/head-marketing.svg' },
      { id: 7, image: 'uploads/board_members/head-production.svg' },
      { id: 8, image: 'uploads/board_members/head-logistics.svg' },
    ];

    for (const update of boardUpdates) {
      await db.execute('UPDATE board_members SET image = ? WHERE id = ?', [update.image, update.id]);
      console.log(`  ✅ Board Member ${update.id}: ${update.image}`);
    }

    // Update Banners
    console.log('\n🎨 Updating Banners...');
    await db.execute('UPDATE banners SET image = ? WHERE id = ?', ['uploads/banners/banner-main.svg', 1]);
    console.log('  ✅ Banner 1: uploads/banners/banner-main.svg');

    console.log('\n✅ All database images updated to SVG format!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

updateImagePaths();
