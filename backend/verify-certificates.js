const fs = require('fs');
const path = require('path');

async function verifyCertificates() {
  const certDir = path.join(__dirname, 'uploads', 'certificates');
  
  console.log('Verifying certificate files...\n');
  
  const files = ['iso-9001.png', 'gmp-certified.png', 'haccp-approved.png'];
  let count = 0;
  
  for (const file of files) {
    const filePath = path.join(certDir, file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log(`OK - ${file}: ${stats.size} bytes`);
      count++;
    } else {
      console.log(`MISSING - ${file}`);
    }
  }
  
  console.log(`\nResult: ${count}/${files.length} certificates verified`);
}

verifyCertificates();
