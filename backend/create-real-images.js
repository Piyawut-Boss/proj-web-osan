const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Function to create a real PNG image file
function createPNG(width, height, color) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk (image header)
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type (RGB)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // Create IHDR chunk with CRC
  const ihdrChunk = createChunk('IHDR', ihdr);

  // Create image data (solid color)
  const [r, g, b] = color;
  const scanline = Buffer.alloc(width * 3 + 1);
  scanline[0] = 0; // filter type = None
  for (let i = 0; i < width; i++) {
    scanline[i * 3 + 1] = r;
    scanline[i * 3 + 2] = g;
    scanline[i * 3 + 3] = b;
  }

  const imageData = Buffer.alloc(height * (width * 3 + 1));
  for (let y = 0; y < height; y++) {
    scanline.copy(imageData, y * scanline.length);
  }

  const compressedData = zlib.deflateSync(imageData);
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND chunk
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

async function createRealImages() {
  console.log('🖼️  Creating Real PNG Image Files\n');

  const uploadsBase = path.join(__dirname, 'uploads');

  // Product images - Blue tones
  const products = [
    { name: 'psu-blen-350g.png', color: [30, 144, 255] }, // Dodger Blue
    { name: 'psu-blen-200g.png', color: [65, 105, 225] }, // Royal Blue
    { name: 'chicken-massaman.png', color: [100, 149, 237] }, // Cornflower Blue
    { name: 'garlic-chicken.png', color: [30, 144, 255] }, // Dodger Blue
    { name: 'spicy-catfish.png', color: [70, 130, 180] }, // Steel Blue
    { name: 'green-curry.png', color: [135, 206, 250] }, // Light Sky Blue
  ];

  console.log('📦 Creating Product Images...');
  for (const img of products) {
    const png = createPNG(400, 300, img.color);
    const filePath = path.join(uploadsBase, 'products', img.name);
    fs.writeFileSync(filePath, png);
    console.log(`  ✅ ${img.name} (${img.color.join(',')})`);
  }

  // Certificate images - Gold/Orange tones
  const certificates = [
    { name: 'iso-9001.png', color: [255, 165, 0] }, // Orange
    { name: 'gmp-certified.png', color: [255, 215, 0] }, // Gold
    { name: 'haccp-approved.png', color: [255, 140, 0] }, // Dark Orange
  ];

  console.log('\n🎖️  Creating Certificate Images...');
  for (const cert of certificates) {
    const png = createPNG(400, 300, cert.color);
    const filePath = path.join(uploadsBase, 'certificates', cert.name);
    fs.writeFileSync(filePath, png);
    console.log(`  ✅ ${cert.name} (${cert.color.join(',')})`);
  }

  // Board member images - Green tones
  const boardMembers = [
    { name: 'chairman.png', color: [34, 139, 34] }, // Forest Green
    { name: 'vice-chairman.png', color: [50, 205, 50] }, // Lime Green
    { name: 'ceo.png', color: [60, 179, 113] }, // Medium Sea Green
    { name: 'cto.png', color: [46, 139, 87] }, // Sea Green
    { name: 'head-sales.png', color: [34, 139, 34] }, // Forest Green
    { name: 'head-marketing.png', color: [85, 107, 47] }, // Dark Yellow Green
    { name: 'head-production.png', color: [107, 142, 35] }, // Yellow Green
    { name: 'head-logistics.png', color: [50, 205, 50] }, // Lime Green
  ];

  console.log('\n👥 Creating Board Member Images...');
  for (const member of boardMembers) {
    const png = createPNG(400, 300, member.color);
    const filePath = path.join(uploadsBase, 'board_members', member.name);
    fs.writeFileSync(filePath, png);
    console.log(`  ✅ ${member.name} (${member.color.join(',')})`);
  }

  // Banner image - Red tones
  console.log('\n🎨 Creating Banner Images...');
  const bannerPng = createPNG(1200, 400, [220, 20, 60]); // Crimson
  const bannerPath = path.join(uploadsBase, 'banners', 'banner-main.png');
  fs.writeFileSync(bannerPath, bannerPng);
  console.log('  ✅ banner-main.png (220,20,60)');

  console.log('\n✅ All REAL PNG images created successfully!');
  console.log('\n📊 Created:');
  console.log('  - 6 Product images (Blue)');
  console.log('  - 3 Certificate images (Gold/Orange)');
  console.log('  - 8 Board Member images (Green)');
  console.log('  - 1 Banner image (Red)');
  console.log('  - TOTAL: 18 real PNG files');

  process.exit(0);
}

createRealImages().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
