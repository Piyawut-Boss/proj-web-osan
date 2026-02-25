const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Function to create realistic certificate images
function createCertificatePNG(width, height, bgColor1, bgColor2, accentColor) {
  // Create raw image data
  const pixels = Buffer.alloc(width * height * 3);
  
  // Create gradient background
  for (let y = 0; y < height; y++) {
    const t = y / height;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      pixels[idx] = Math.floor(bgColor1[0] + (bgColor2[0] - bgColor1[0]) * t);
      pixels[idx + 1] = Math.floor(bgColor1[1] + (bgColor2[1] - bgColor1[1]) * t);
      pixels[idx + 2] = Math.floor(bgColor1[2] + (bgColor2[2] - bgColor1[2]) * t);
    }
  }
  
  // Add decorative pattern - horizontal lines
  const lineColor = [Math.max(0, accentColor[0] - 40), Math.max(0, accentColor[1] - 40), Math.max(0, accentColor[2] - 40)];
  for (let y = 40; y < height - 40; y += 80) {
    for (let x = 20; x < width - 20; x++) {
      const idx = (y * width + x) * 3;
      pixels[idx] = lineColor[0];
      pixels[idx + 1] = lineColor[1];
      pixels[idx + 2] = lineColor[2];
    }
  }
  
  // Add accent frame border (double line effect)
  const borderPadding = 10;
  for (let x = borderPadding; x < width - borderPadding; x++) {
    for (let line = 0; line < 2; line++) {
      // Top border
      const topIdx = ((borderPadding + line) * width + x) * 3;
      pixels[topIdx] = accentColor[0];
      pixels[topIdx + 1] = accentColor[1];
      pixels[topIdx + 2] = accentColor[2];
      
      // Bottom border
      const bottomIdx = ((height - borderPadding - 2 + line) * width + x) * 3;
      pixels[bottomIdx] = accentColor[0];
      pixels[bottomIdx + 1] = accentColor[1];
      pixels[bottomIdx + 2] = accentColor[2];
    }
  }
  
  // Left and right borders
  for (let y = borderPadding; y < height - borderPadding; y++) {
    for (let line = 0; line < 2; line++) {
      // Left border
      const leftIdx = (y * width + borderPadding + line) * 3;
      pixels[leftIdx] = accentColor[0];
      pixels[leftIdx + 1] = accentColor[1];
      pixels[leftIdx + 2] = accentColor[2];
      
      // Right border
      const rightIdx = (y * width + (width - borderPadding - 2 + line)) * 3;
      pixels[rightIdx] = accentColor[0];
      pixels[rightIdx + 1] = accentColor[1];
      pixels[rightIdx + 2] = accentColor[2];
    }
  }
  
  // Add circular seal in center (certificate official stamp effect)
  const centerX = width / 2;
  const centerY = height / 2;
  const sealRadius = 40;
  const sealColor = accentColor;
  
  for (let y = Math.max(0, Math.floor(centerY - sealRadius)); y < Math.min(height, Math.ceil(centerY + sealRadius)); y++) {
    for (let x = Math.max(0, Math.floor(centerX - sealRadius)); x < Math.min(width, Math.ceil(centerX + sealRadius)); x++) {
      const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      if (dist < sealRadius && dist > sealRadius - 3) {
        const idx = (y * width + x) * 3;
        pixels[idx] = sealColor[0];
        pixels[idx + 1] = sealColor[1];
        pixels[idx + 2] = sealColor[2];
      }
    }
  }
  
  // Create PNG file
  return createPNG(width, height, pixels);
}

// PNG file creation function
function createPNG(width, height, imageData) {
  // PNG signature
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  
  const ihdrChunk = createChunk('IHDR', ihdrData);
  
  // IDAT chunk (image data)
  const scanlines = Buffer.alloc(height * (width * 3 + 1));
  let pos = 0;
  for (let y = 0; y < height; y++) {
    scanlines[pos++] = 0; // filter type
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      scanlines[pos++] = imageData[idx];
      scanlines[pos++] = imageData[idx + 1];
      scanlines[pos++] = imageData[idx + 2];
    }
  }
  
  const compressed = zlib.deflateSync(scanlines);
  const idatChunk = createChunk('IDAT', compressed);
  
  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  
  // Combine all chunks
  return Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
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

function calculateCRC(data) {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Create certificate images
async function createCertificates() {
  const certDir = path.join(__dirname, 'uploads', 'certificates');
  
  // Ensure directory exists
  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
  }
  
  console.log('🎖️ Creating realistic certificate images...\n');
  
  // Certificate 1: Halal Certificate (iso-9001.png) - Green theme
  console.log('Creating: Halal Certificate (iso-9001.png)');
  const halalImg = createCertificatePNG(600, 800, [245, 250, 240], [235, 245, 230], [34, 139, 34]); // Green
  fs.writeFileSync(path.join(certDir, 'iso-9001.png'), halalImg);
  console.log('✅ Halal certificate created\n');
  
  // Certificate 2: Food Production License (gmp-certified.png) - Blue theme
  console.log('Creating: Food Production License (gmp-certified.png)');
  const gmpImg = createCertificatePNG(600, 800, [240, 248, 255], [230, 240, 255], [25, 85, 145]); // Blue
  fs.writeFileSync(path.join(certDir, 'gmp-certified.png'), gmpImg);
  console.log('✅ Food production license created\n');
  
  // Certificate 3: Food Registration (haccp-approved.png) - Gold theme
  console.log('Creating: Food Registration Certificate (haccp-approved.png)');
  const haccpImg = createCertificatePNG(600, 800, [255, 250, 240], [255, 245, 230], [184, 134, 11]); // Gold
  fs.writeFileSync(path.join(certDir, 'haccp-approved.png'), haccpImg);
  console.log('✅ Food registration certificate created\n');
  
  console.log('🎉 All certificate images created successfully!');
  console.log('\n📊 Summary:');
  console.log('  ✅ iso-9001.png (Halal Certificate)');
  console.log('  ✅ gmp-certified.png (Food Production License)');
  console.log('  ✅ haccp-approved.png (Food Registration)');
}

createCertificates().catch(console.error);
