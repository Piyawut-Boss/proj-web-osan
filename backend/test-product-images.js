const axios = require('axios');

async function testImages() {
  console.log('Testing product images from backend...\n');
  
  const images = [
    'uploads/products/psu-blen-350g.png',
    'uploads/products/psu-blen-200g.png',
    'uploads/products/chicken-massaman.png',
    'uploads/products/garlic-chicken.png',
    'uploads/products/spicy-catfish.png',
    'uploads/products/green-curry.png'
  ];
  
  let working = 0;
  let failed = 0;
  
  for (const img of images) {
    try {
      const url = 'http://localhost:5000/' + img;
      const response = await axios.head(url, { timeout: 3000 });
      if (response.status === 200) {
        console.log('OK - ' + img);
        working++;
      } else {
        console.log('FAIL - ' + img + ' (Status: ' + response.status + ')');
        failed++;
      }
    } catch (error) {
      console.log('FAIL - ' + img + ' (Error: ' + error.message + ')');
      failed++;
    }
  }
  
  console.log('\nResult: ' + working + ' working, ' + failed + ' failed');
}

testImages();
