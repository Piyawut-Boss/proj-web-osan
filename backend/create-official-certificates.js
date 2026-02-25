const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Create a more realistic certificate that looks like actual government documents
function createOfficialCertificate(width, height, theme) {
  const pixels = Buffer.alloc(width * height * 3);
  
  let bgColor1, bgColor2, accentColor, textColor;
  
  switch(theme) {
    case 'halal':
      bgColor1 = [242, 248, 242]; // Very light green
      bgColor2 = [220, 240, 220]; // Lighter green
      accentColor = [0, 102, 0];  // Dark green
      break;
    case 'gmp':
      bgColor1 = [240, 245, 255]; // Very light blue
      bgColor2 = [210, 230, 255]; // Lighter blue
      accentColor = [0, 51, 153]; // Dark blue
      break;
    case 'haccp':
      bgColor1 = [255, 250, 235]; // Very light gold
      bgColor2 = [255, 240, 200]; // Lighter gold
      accentColor = [204, 102, 0]; // Dark orange/gold
      break;
  }
  
  textColor = [60, 60, 60];
  
  // Create subtle gradient background
  for (let y = 0; y < height; y++) {
    const t = y / height;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      pixels[idx] = Math.floor(bgColor1[0] + (bgColor2[0] - bgColor1[0]) * t);
      pixels[idx + 1] = Math.floor(bgColor1[1] + (bgColor2[1] - bgColor1[1]) * t);
      pixels[idx + 2] = Math.floor(bgColor1[2] + (bgColor2[2] - bgColor1[2]) * t);
    }
  }
  
  // Add ornamental top border (thick decorative band)
  const borderHeight = 50;
  for (let y = 0; y < borderHeight; y++) {
    const intensity = Math.sin((y / borderHeight) * Math.PI) * 0.3;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      pixels[idx] = Math.floor(accentColor[0] * (0.7 + intensity));
      pixels[idx + 1] = Math.floor(accentColor[1] * (0.7 + intensity));
      pixels[idx + 2] = Math.floor(accentColor[2] * (0.7 + intensity));
    }
  }
  
  // Add bottom border
  for (let y = height - borderHeight; y < height; y++) {
    const intensity = Math.sin(((height - y) / borderHeight) * Math.PI) * 0.3;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      pixels[idx] = Math.floor(accentColor[0] * (0.7 + intensity));
      pixels[idx + 1] = Math.floor(accentColor[1] * (0.7 + intensity));
      pixels[idx + 2] = Math.floor(accentColor[2] * (0.7 + intensity));
    }
  }
  
  // Add decorative corner flourishes (ornamental corners)
  const cornerSize = 60;
  drawCornerFlourish(pixels, width, height, 20, 20, cornerSize, accentColor);
  drawCornerFlourish(pixels, width, height, width - cornerSize - 20, 20, cornerSize, accentColor);
  drawCornerFlourish(pixels, width, height, 20, height - cornerSize - 20, cornerSize, accentColor);
  drawCornerFlourish(pixels, width, height, width - cornerSize - 20, height - cornerSize - 20, cornerSize, accentColor);
  
  // Add certificate number area (simulated text representation with pattern)
  addTextBox(pixels, width, height, 50, 80, 200, 30, accentColor, 2);
  
  // Add official seal - large circle in center-bottom area
  const sealX = width / 2;
  const sealY = height - 120;
  const sealRadius = 50;
  drawSeal(pixels, width, height, sealX, sealY, sealRadius, accentColor);
  
  // Add side ornamental lines
  for (let y = borderHeight + 30; y < height - borderHeight - 30; y += 60) {
    for (let x = 25; x < 35; x++) {
      const idx = (y * width + x) * 3;
      pixels[idx] = accentColor[0];
      pixels[idx + 1] = accentColor[1];
      pixels[idx + 2] = accentColor[2];
    }
    for (let x = width - 35; x < width - 25; x++) {
      const idx = (y * width + x) * 3;
      pixels[idx] = accentColor[0];
      pixels[idx + 1] = accentColor[1];
      pixels[idx + 2] = accentColor[2];
    }
  }
  
  // Add subtle watermark pattern (horizontal bands)
  for (let y = 150; y < height - 150; y += 40) {
    for (let x = 40; x < width - 40; x++) {
      const idx = (y * width + x) * 3;
      const alpha = 0.1;
      pixels[idx] = Math.floor(pixels[idx] * (1 - alpha) + accentColor[0] * alpha);
      pixels[idx + 1] = Math.floor(pixels[idx + 1] * (1 - alpha) + accentColor[1] * alpha);
      pixels[idx + 2] = Math.floor(pixels[idx + 2] * (1 - alpha) + accentColor[2] * alpha);
    }
  }
  
  return createPNG(width, height, pixels);
}

function drawCornerFlourish(pixels, width, height, startX, startY, size, color) {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < 3; j++) {
      if (startX + i < width && startY + i < height) {
        const idx = ((startY + i) * width + (startX + i)) * 3;
        pixels[idx] = color[0];
        pixels[idx + 1] = color[1];
        pixels[idx + 2] = color[2];
      }
    }
  }
}

function addTextBox(pixels, width, height, x, y, w, h, color, thickness) {
  // Draw rectangle border for text box
  for (let i = 0; i < w; i++) {
    for (let t = 0; t < thickness; t++) {
      // Top line
      if (y + t < height && x + i < width) {
        const idx = ((y + t) * width + (x + i)) * 3;
        pixels[idx] = color[0];
        pixels[idx + 1] = color[1];
        pixels[idx + 2] = color[2];
      }
      // Bottom line
      if (y + h - 1 - t < height && x + i < width) {
        const idx = ((y + h - 1 - t) * width + (x + i)) * 3;
        pixels[idx] = color[0];
        pixels[idx + 1] = color[1];
        pixels[idx + 2] = color[2];
      }
    }
  }
  for (let i = 0; i < h; i++) {
    for (let t = 0; t < thickness; t++) {
      // Left line
      if (x + t < width && y + i < height) {
        const idx = ((y + i) * width + (x + t)) * 3;
        pixels[idx] = color[0];
        pixels[idx + 1] = color[1];
        pixels[idx + 2] = color[2];
      }
      // Right line
      if (x + w - 1 - t < width && y + i < height) {
        const idx = ((y + i) * width + (x + w - 1 - t)) * 3;
        pixels[idx] = color[0];
        pixels[idx + 1] = color[1];
        pixels[idx + 2] = color[2];
      }
    }
  }
}

function drawSeal(pixels, width, height, cx, cy, radius, color) {
  // Draw official seal - circle with inner pattern
  for (let y = Math.max(0, Math.floor(cy - radius)); y < Math.min(height, Math.ceil(cy + radius)); y++) {
    for (let x = Math.max(0, Math.floor(cx - radius)); x < Math.min(width, Math.ceil(cx + radius)); x++) {
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      
      // Outer circle
      if (dist < radius && dist > radius - 4) {
        const idx = (y * width + x) * 3;
        pixels[idx] = color[0];
        pixels[idx + 1] = color[1];
        pixels[idx + 2] = color[2];
      }
      
      // Inner decorative circles
      if (dist < radius * 0.4 && dist > radius * 0.35) {
        const idx = (y * width + x) * 3;
        pixels[idx] = color[0];
        pixels[idx + 1] = color[1];
        pixels[idx + 2] = color[2];
      }
    }
  }
}

// PNG creation
function createPNG(width, height, imageData) {
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 2;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  
  const ihdrChunk = createChunk('IHDR', ihdrData);
  
  const scanlines = Buffer.alloc(height * (width * 3 + 1));
  let pos = 0;
  for (let y = 0; y < height; y++) {
    scanlines[pos++] = 0;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      scanlines[pos++] = imageData[idx];
      scanlines[pos++] = imageData[idx + 1];
      scanlines[pos++] = imageData[idx + 2];
    }
  }
  
  const compressed = zlib.deflateSync(scanlines);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  
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

// Generate certificates
async function generateCertificates() {
  const certDir = path.join(__dirname, 'uploads', 'certificates');
  
  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
  }
  
  console.log('Creating official-looking certificates...\n');
  
  // Halal Certificate
  console.log('Creating Halal Certificate...');
  const halalImg = createOfficialCertificate(600, 800, 'halal');
  fs.writeFileSync(path.join(certDir, 'iso-9001.png'), halalImg);
  console.log('OK');
  
  // GMP Certificate
  console.log('Creating GMP Certificate...');
  const gmpImg = createOfficialCertificate(600, 800, 'gmp');
  fs.writeFileSync(path.join(certDir, 'gmp-certified.png'), gmpImg);
  console.log('OK');
  
  // HACCP Certificate
  console.log('Creating HACCP Certificate...');
  const haccpImg = createOfficialCertificate(600, 800, 'haccp');
  fs.writeFileSync(path.join(certDir, 'haccp-approved.png'), haccpImg);
  console.log('OK');
  
  console.log('\nAll certificates created successfully!');
}

generateCertificates().catch(console.error);
