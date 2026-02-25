const fs = require('fs');
const path = require('path');

// Function to create a proper PNG image with Canvas-like functionality
function createPlaceholderImage(width, height, text, color) {
  // Create a simple colorful gradient PNG
  // Using base64 encoded PNG data for different categories
  
  const colors = {
    product: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDdCRkY7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDA0MEM4O3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiPv4A/AAAAAAA</dGV4dD48L3N2Zz4=',
    certificate: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkM0MDA7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkY4QzAwO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiPkNFUlRJRklDQVRFPC90ZXh0Pjwvc3ZnPg==',
    board: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwN0Y4MzE7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDA4NzJGO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiPkJPQVJEIE1FTUJFUjwvdGV4dD48L3N2Zz4=',
    banner: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRjBCMDA7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkY2QjZCO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iMjUwIiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMzIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtd2VpZ2h0PSJib2xkIj5CQU5ORVIgSU1BR0U8L3RleHQ+PC9zdmc+',
  };

  return colors[color] || colors.product;
}

// Create SVG-based image files
async function createImagesWithSVG() {
  console.log('🖼️  Creating Proper Placeholder Images\n');

  const uploadsBase = path.join(__dirname, 'uploads');
  
  // Product images
  const productSVGs = [
    { name: 'psu-blen-350g.svg', title: '📦 PSU Blen 350g' },
    { name: 'psu-blen-200g.svg', title: '📦 PSU Blen 200g' },
    { name: 'chicken-massaman.svg', title: '🍗 Chicken Massaman' },
    { name: 'garlic-chicken.svg', title: '🍗 Garlic Chicken' },
    { name: 'spicy-catfish.svg', title: '🐟 Spicy Catfish' },
    { name: 'green-curry.svg', title: '🍛 Green Curry' },
  ];

  console.log('📦 Creating Product Images...');
  for (const img of productSVGs) {
    const svgContent = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#007BFF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0056C8;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#grad)"/>
      <circle cx="200" cy="150" r="80" fill="rgba(255,255,255,0.2)"/>
      <text x="200" y="140" font-size="24" fill="white" text-anchor="middle" font-family="Arial" font-weight="bold">${img.title}</text>
      <text x="200" y="170" font-size="14" fill="rgba(255,255,255,0.8)" text-anchor="middle" font-family="Arial">Product Image</text>
    </svg>`;
    
    const filePath = path.join(uploadsBase, 'products', img.name);
    fs.writeFileSync(filePath, svgContent, 'utf8');
    console.log(`  ✅ ${img.name}`);
  }

  // Certificate images
  const certificateSVGs = [
    { name: 'iso-9001.svg', title: '🏆 ISO 9001' },
    { name: 'gmp-certified.svg', title: '🏆 GMP Certified' },
    { name: 'haccp-approved.svg', title: '🏆 HACCP Approved' },
  ];

  console.log('\n🎖️  Creating Certificate Images...');
  for (const cert of certificateSVGs) {
    const svgContent = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FFC400;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FF8C00;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#grad)"/>
      <circle cx="200" cy="150" r="80" fill="rgba(255,255,255,0.2)"/>
      <text x="200" y="140" font-size="24" fill="white" text-anchor="middle" font-family="Arial" font-weight="bold">${cert.title}</text>
      <text x="200" y="170" font-size="14" fill="rgba(255,255,255,0.8)" text-anchor="middle" font-family="Arial">Certificate</text>
    </svg>`;
    
    const filePath = path.join(uploadsBase, 'certificates', cert.name);
    fs.writeFileSync(filePath, svgContent, 'utf8');
    console.log(`  ✅ ${cert.name}`);
  }

  // Board member images
  const boardMembers = [
    { name: 'chairman.svg', title: '👔 Chairman' },
    { name: 'vice-chairman.svg', title: '👔 Vice Chairman' },
    { name: 'ceo.svg', title: '👔 CEO' },
    { name: 'cto.svg', title: '👔 CTO' },
    { name: 'head-sales.svg', title: '👥 Head Sales' },
    { name: 'head-marketing.svg', title: '👥 Head Marketing' },
    { name: 'head-production.svg', title: '👥 Head Production' },
    { name: 'head-logistics.svg', title: '👥 Head Logistics' },
  ];

  console.log('\n👥 Creating Board Member Images...');
  for (const member of boardMembers) {
    const svgContent = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#07F831;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#00872F;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#grad)"/>
      <circle cx="200" cy="100" r="50" fill="rgba(255,255,255,0.3)"/>
      <rect x="100" y="170" width="200" height="100" fill="rgba(255,255,255,0.2)" rx="10"/>
      <text x="200" y="145" font-size="24" fill="white" text-anchor="middle" font-family="Arial" font-weight="bold">${member.title}</text>
      <text x="200" y="230" font-size="14" fill="rgba(255,255,255,0.8)" text-anchor="middle" font-family="Arial">Board Member</text>
    </svg>`;
    
    const filePath = path.join(uploadsBase, 'board_members', member.name);
    fs.writeFileSync(filePath, svgContent, 'utf8');
    console.log(`  ✅ ${member.name}`);
  }

  // Banner image
  console.log('\n🎨 Creating Banner Images...');
  const bannerSVG = `<svg width="1200" height="400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#FF0B00;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#FF6B6B;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="1200" height="400" fill="url(#grad)"/>
    <circle cx="300" cy="200" r="100" fill="rgba(255,255,255,0.15)"/>
    <circle cx="900" cy="200" r="100" fill="rgba(255,255,255,0.15)"/>
    <text x="600" y="180" font-size="48" fill="white" text-anchor="middle" font-family="Arial" font-weight="bold">🎉 PSU AGRO FOOD 🎉</text>
    <text x="600" y="240" font-size="24" fill="rgba(255,255,255,0.9)" text-anchor="middle" font-family="Arial">Premium Quality Products</text>
  </svg>`;

  const bannerPath = path.join(uploadsBase, 'banners', 'banner-main.svg');
  fs.writeFileSync(bannerPath, bannerSVG, 'utf8');
  console.log('  ✅ banner-main.svg');

  console.log('\n✅ All SVG images created successfully!');
  console.log('\n📊 Created:');
  console.log('  - 6 Product images');
  console.log('  - 3 Certificate images');
  console.log('  - 8 Board Member images');
  console.log('  - 1 Banner image');
  console.log('  - TOTAL: 18 SVG files');

  process.exit(0);
}

createImagesWithSVG().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
