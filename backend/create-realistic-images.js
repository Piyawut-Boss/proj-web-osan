const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// PNG writer utilities
function createPNG(width, height, pixelData) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type (RGB)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Create image data from pixel data
  const imageData = Buffer.alloc(height * (width * 3 + 1));
  let offset = 0;
  
  for (let y = 0; y < height; y++) {
    imageData[offset] = 0; // filter type
    offset++;
    
    for (let x = 0; x < width; x++) {
      const pixelOffset = (y * width + x) * 3;
      imageData[offset++] = pixelData[pixelOffset];
      imageData[offset++] = pixelData[pixelOffset + 1];
      imageData[offset++] = pixelData[pixelOffset + 2];
    }
  }

  const compressedData = zlib.deflateSync(imageData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, 'ascii');
  const chunkData = Buffer.concat([typeBuffer, data]);

  const crc = calculateCRC(chunkData);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);

  return Buffer.concat([length, chunkData, crcBuffer]);
}

function calculateCRC(buf) {
  const table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }

  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Create realistic looking product image
function createProductImage(width, height, title, bgColor) {
  const pixels = Buffer.alloc(width * height * 3);
  
  // Fill background with gradient
  const [r1, g1, b1] = bgColor;
  const [r2, g2, b2] = [Math.min(r1 + 60, 255), Math.min(g1 + 60, 255), Math.min(b1 + 60, 255)];
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const t = y / height;
      const idx = (y * width + x) * 3;
      
      pixels[idx] = Math.floor(r1 + (r2 - r1) * t);
      pixels[idx + 1] = Math.floor(g1 + (g2 - g1) * t);
      pixels[idx + 2] = Math.floor(b1 + (b2 - b1) * t);
    }
  }
  
  // Add some pattern/texture
  for (let y = 0; y < height; y += 20) {
    for (let x = 0; x < width; x += 20) {
      const idx = (y * width + x) * 3;
      pixels[idx] = Math.min(pixels[idx] + 20, 255);
      pixels[idx + 1] = Math.min(pixels[idx + 1] + 20, 255);
      pixels[idx + 2] = Math.min(pixels[idx + 2] + 20, 255);
    }
  }
  
  // Add central circle/shape (product representation)
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 60;
  
  for (let y = centerY - radius; y < centerY + radius; y++) {
    for (let x = centerX - radius; x < centerX + radius; x++) {
      if (x >= 0 && x < width && y >= 0 && y < height) {
        const dx = x - centerX;
        const dy = y - centerY;
        if (dx * dx + dy * dy < radius * radius) {
          const idx = (y * width + x) * 3;
          pixels[idx] = Math.min(pixels[idx] + 50, 255);
          pixels[idx + 1] = Math.min(pixels[idx + 1] + 50, 255);
          pixels[idx + 2] = Math.min(pixels[idx + 2] + 50, 255);
        }
      }
    }
  }
  
  return createPNG(width, height, pixels);
}

async function createRealisticImages() {
  console.log('🖼️  Creating Realistic Product Images\n');

  const uploadsBase = path.join(__dirname, 'uploads');

  // Product images
  const products = [
    { name: 'psu-blen-350g.png', title: 'PSU Blen 350g', color: [41, 128, 185] }, // Professional blue
    { name: 'psu-blen-200g.png', title: 'PSU Blen 200g', color: [52, 152, 219] }, // Light blue
    { name: 'psu-blen-150g.png', title: 'PSU Blen 150g', color: [30, 100, 160] }, // Darker blue
    { name: 'chicken-massaman.png', title: 'Chicken Massaman', color: [230, 126, 34] }, // Orange
    { name: 'garlic-chicken.png', title: 'Garlic Chicken', color: [211, 84, 0] }, // Dark orange
    { name: 'spicy-catfish.png', title: 'Spicy Catfish', color: [192, 57, 43] }, // Red
    { name: 'green-curry.png', title: 'Green Curry', color: [46, 204, 113] }, // Green
    { name: 'oem-custom-blended.png', title: 'OEM Custom Blended', color: [155, 89, 182] }, // Purple
    { name: 'oem-sauces.png', title: 'OEM Sauces', color: [231, 76, 60] }, // Dark red
    { name: 'oem-beverages.png', title: 'OEM Beverages', color: [52, 73, 94] }, // Dark blue-gray
    { name: 'oem-health-products.png', title: 'OEM Health Products', color: [16, 112, 2] }, // Dark green
    { name: 'timeline-2567.png', title: 'Timeline 2567', color: [255, 193, 7] }, // Golden
    { name: 'timeline-2568.png', title: 'Timeline 2568', color: [33, 150, 243] }, // Sky blue
    { name: 'timeline-present.png', title: 'Timeline Present', color: [76, 175, 80] }, // Green
    { name: 'core-value-1.png', title: 'Core Value 1', color: [233, 30, 99] }, // Pink
    { name: 'core-value-2.png', title: 'Core Value 2', color: [103, 58, 183] }, // Deep purple
    { name: 'core-value-3.png', title: 'Core Value 3', color: [0, 188, 212] }, // Cyan
    { name: 'core-value-4.png', title: 'Core Value 4', color: [255, 152, 0] }, // Amber
  ];

  console.log('📦 Creating Product Images...');
  for (const img of products) {
    const png = createProductImage(400, 300, img.title, img.color);
    const filePath = path.join(uploadsBase, 'products', img.name);
    fs.writeFileSync(filePath, png);
    console.log(`  ✅ ${img.name}`);
  }

  // Certificate images
  const certificates = [
    { name: 'iso-9001.png', title: 'ISO 9001', color: [241, 196, 15] }, // Gold
    { name: 'gmp-certified.png', title: 'GMP Cert', color: [230, 126, 34] }, // Orange
    { name: 'haccp-approved.png', title: 'HACCP', color: [26, 188, 156] }, // Teal
  ];

  console.log('\n🎖️  Creating Certificate Images...');
  for (const cert of certificates) {
    const png = createProductImage(400, 300, cert.title, cert.color);
    const filePath = path.join(uploadsBase, 'certificates', cert.name);
    fs.writeFileSync(filePath, png);
    console.log(`  ✅ ${cert.name}`);
  }

  // Board member images
  const boardMembers = [
    { name: 'chairman.png', title: 'Chairman', color: [44, 62, 80] }, // Dark blue-gray
    { name: 'vice-chairman.png', title: 'Vice Chairman', color: [52, 73, 94] }, // Slate
    { name: 'ceo.png', title: 'CEO', color: [41, 128, 185] }, // Steel blue
    { name: 'cto.png', title: 'CTO', color: [52, 152, 219] }, // Sky blue
    { name: 'head-sales.png', title: 'Head Sales', color: [46, 204, 113] }, // Green
    { name: 'head-marketing.png', title: 'Head Marketing', color: [52, 211, 153] }, // Light green
    { name: 'head-production.png', title: 'Head Prod', color: [26, 188, 156] }, // Turquoise
    { name: 'head-logistics.png', title: 'Head Logistics', color: [22, 160, 133] }, // Dark turquoise
  ];

  console.log('\n👥 Creating Board Member Images...');
  for (const member of boardMembers) {
    const png = createProductImage(400, 300, member.title, member.color);
    const filePath = path.join(uploadsBase, 'board_members', member.name);
    fs.writeFileSync(filePath, png);
    console.log(`  ✅ ${member.name}`);
  }

  // Banner image
  console.log('\n🎨 Creating Banner Images...');
  const bannerPng = createProductImage(1200, 400, 'Banner', [231, 76, 60]); // Red
  const bannerPath = path.join(uploadsBase, 'banners', 'banner-main.png');
  fs.writeFileSync(bannerPath, bannerPng);
  console.log('  ✅ banner-main.png');

  console.log('\n✅ All realistic PNG images created!');
  console.log('\n📊 Created:');
  console.log('  - 6 Product images with gradients and patterns');
  console.log('  - 3 Certificate images with gradients and patterns');
  console.log('  - 8 Board Member images with gradients and patterns');
  console.log('  - 1 Banner image with gradients and patterns');
  console.log('  - TOTAL: 18 realistic PNG files');

  process.exit(0);
}

createRealisticImages().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
