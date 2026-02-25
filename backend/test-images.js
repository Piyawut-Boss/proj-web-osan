const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API = 'http://localhost:5000/api';

async function testImages() {
  console.log('🖼️  IMAGE TESTING - Checking all database images\n');
  
  let adminToken = '';
  let passed = 0;
  let failed = 0;
  const results = {
    products: [],
    news: [],
    reviews: [],
    certificates: [],
    board_members: [],
    banners: [],
    missing: [],
    invalid: []
  };

  try {
    // Login as admin
    console.log('🔐 Logging in as admin...');
    const loginRes = await axios.post(`${API}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    adminToken = loginRes.data.token;
    console.log('✅ Login successful\n');

    // Test Products Images
    console.log('📦 Testing Product Images...');
    const productsRes = await axios.get(`${API}/products/admin/all`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (productsRes.data.data) {
      for (const product of productsRes.data.data) {
        if (product.image) {
          try {
            const imgRes = await axios.head(product.image, { timeout: 5000 });
            if (imgRes.status === 200) {
              console.log(`  ✅ Product "${product.name}": ${product.image}`);
              results.products.push({ name: product.name, image: product.image, status: 'OK' });
              passed++;
            }
          } catch (err) {
            console.log(`  ❌ Product "${product.name}": ${product.image} - ${err.message}`);
            results.products.push({ name: product.name, image: product.image, status: 'FAILED', error: err.message });
            results.missing.push({ type: 'product', name: product.name, image: product.image });
            failed++;
          }
        } else {
          results.products.push({ name: product.name, image: null, status: 'NO_IMAGE' });
        }
      }
    }

    // Test News Images
    console.log('\n📰 Testing News Images...');
    const newsRes = await axios.get(`${API}/news/admin/all`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (newsRes.data.data) {
      for (const news of newsRes.data.data) {
        if (news.image) {
          try {
            const imgRes = await axios.head(news.image, { timeout: 5000 });
            if (imgRes.status === 200) {
              console.log(`  ✅ News "${news.title}": ${news.image}`);
              results.news.push({ title: news.title, image: news.image, status: 'OK' });
              passed++;
            }
          } catch (err) {
            console.log(`  ❌ News "${news.title}": ${news.image} - ${err.message}`);
            results.news.push({ title: news.title, image: news.image, status: 'FAILED', error: err.message });
            results.missing.push({ type: 'news', name: news.title, image: news.image });
            failed++;
          }
        }
      }
    }

    // Test Reviews Images
    console.log('\n⭐ Testing Review Images...');
    const reviewsRes = await axios.get(`${API}/reviews/admin/all`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (reviewsRes.data.data) {
      for (const review of reviewsRes.data.data) {
        if (review.image) {
          try {
            const imgRes = await axios.head(review.image, { timeout: 5000 });
            if (imgRes.status === 200) {
              console.log(`  ✅ Review from "${review.reviewer_name}": ${review.image}`);
              results.reviews.push({ name: review.reviewer_name, image: review.image, status: 'OK' });
              passed++;
            }
          } catch (err) {
            console.log(`  ❌ Review from "${review.reviewer_name}": ${review.image} - ${err.message}`);
            results.reviews.push({ name: review.reviewer_name, image: review.image, status: 'FAILED', error: err.message });
            results.missing.push({ type: 'review', name: review.reviewer_name, image: review.image });
            failed++;
          }
        }
      }
    }

    // Test Certificates Images
    console.log('\n🎖️  Testing Certificate Images...');
    const certsRes = await axios.get(`${API}/certificates/admin/all`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (certsRes.data.data) {
      for (const cert of certsRes.data.data) {
        if (cert.image) {
          try {
            const imgRes = await axios.head(cert.image, { timeout: 5000 });
            if (imgRes.status === 200) {
              console.log(`  ✅ Certificate "${cert.title}": ${cert.image}`);
              results.certificates.push({ title: cert.title, image: cert.image, status: 'OK' });
              passed++;
            }
          } catch (err) {
            console.log(`  ❌ Certificate "${cert.title}": ${cert.image} - ${err.message}`);
            results.certificates.push({ title: cert.title, image: cert.image, status: 'FAILED', error: err.message });
            results.missing.push({ type: 'certificate', name: cert.title, image: cert.image });
            failed++;
          }
        } else {
          results.certificates.push({ title: cert.title, image: null, status: 'NO_IMAGE' });
        }
      }
    }

    // Test Board Members Images
    console.log('\n👥 Testing Board Member Images...');
    const boardRes = await axios.get(`${API}/board-members/admin/all`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (boardRes.data.data) {
      for (const member of boardRes.data.data) {
        if (member.image) {
          try {
            const imgRes = await axios.head(member.image, { timeout: 5000 });
            if (imgRes.status === 200) {
              console.log(`  ✅ Board Member "${member.name}": ${member.image}`);
              results.board_members.push({ name: member.name, image: member.image, status: 'OK' });
              passed++;
            }
          } catch (err) {
            console.log(`  ❌ Board Member "${member.name}": ${member.image} - ${err.message}`);
            results.board_members.push({ name: member.name, image: member.image, status: 'FAILED', error: err.message });
            results.missing.push({ type: 'board_member', name: member.name, image: member.image });
            failed++;
          }
        } else {
          results.board_members.push({ name: member.name, image: null, status: 'NO_IMAGE' });
        }
      }
    }

    // Test Banners Images
    console.log('\n🎨 Testing Banner Images...');
    const bannersRes = await axios.get(`${API}/banners/admin/all`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (bannersRes.data.data) {
      for (const banner of bannersRes.data.data) {
        if (banner.image) {
          try {
            const imgRes = await axios.head(banner.image, { timeout: 5000 });
            if (imgRes.status === 200) {
              console.log(`  ✅ Banner "${banner.title}": ${banner.image}`);
              results.banners.push({ title: banner.title, image: banner.image, status: 'OK' });
              passed++;
            }
          } catch (err) {
            console.log(`  ❌ Banner "${banner.title}": ${banner.image} - ${err.message}`);
            results.banners.push({ title: banner.title, image: banner.image, status: 'FAILED', error: err.message });
            results.missing.push({ type: 'banner', name: banner.title, image: banner.image });
            failed++;
          }
        } else {
          results.banners.push({ title: banner.title, image: null, status: 'NO_IMAGE' });
        }
      }
    }

    // Check uploads directory
    console.log('\n📂 Scanning Uploads Directory...');
    const uploadsPath = path.join(__dirname, 'uploads');
    if (fs.existsSync(uploadsPath)) {
      const files = fs.readdirSync(uploadsPath);
      console.log(`  Found ${files.length} files in uploads/`);
      files.forEach(file => {
        console.log(`    📄 ${file}`);
      });
    } else {
      console.log('  ⚠️  uploads/ directory not found');
    }

    // Summary
    console.log('\n' + '═'.repeat(50));
    console.log('📊 IMAGE TEST RESULTS');
    console.log('═'.repeat(50));
    console.log(`✅ Working Images: ${passed}`);
    console.log(`❌ Failed Images: ${failed}`);
    console.log(`⚠️  Missing Images: ${results.missing.length}`);
    
    if (results.missing.length > 0) {
      console.log('\n🔴 Missing Image Files:');
      results.missing.forEach(item => {
        console.log(`  - ${item.type.toUpperCase()}: "${item.name}" → ${item.image}`);
      });
    }

    console.log('\n📈 Breakdown by Type:');
    console.log(`  Products: ${results.products.filter(p => p.status === 'OK').length}/${results.products.length}`);
    console.log(`  News: ${results.news.filter(p => p.status === 'OK').length}/${results.news.length}`);
    console.log(`  Reviews: ${results.reviews.filter(p => p.status === 'OK').length}/${results.reviews.length}`);
    console.log(`  Certificates: ${results.certificates.filter(p => p.status === 'OK').length}/${results.certificates.length}`);
    console.log(`  Board Members: ${results.board_members.filter(p => p.status === 'OK').length}/${results.board_members.length}`);
    console.log(`  Banners: ${results.banners.filter(p => p.status === 'OK').length}/${results.banners.length}`);

    if (failed === 0 && results.missing.length === 0) {
      console.log('\n🎉 ALL IMAGES ARE LOADING PERFECTLY!');
    }

  } catch (error) {
    console.error('Testing error:', error.message);
  }
}

// Run tests
testImages();
