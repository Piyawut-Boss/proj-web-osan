const axios = require('axios');

const API = 'http://localhost:5000/api';
let token = '';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

async function test(name, fn) {
  try {
    await fn();
    log(`✅ ${name}`, 'green');
    return true;
  } catch (err) {
    let msg = err.response?.data?.message || err.message;
    if (err.response?.status === 401) msg = 'Unauthorized - Token issue';
    log(`❌ ${name}: ${msg}`, 'red');
    return false;
  }
}

async function runTests() {
  log('\n🔍 ADMIN FUNCTION TESTS - MySQL Database\n', 'blue');
  let passed = 0;
  let failed = 0;

  // 1. LOGIN TEST
  if (await test('1. Admin Login', async () => {
    const res = await axios.post(`${API}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    token = res.data.token;
    if (!token) throw new Error('No token returned');
  })) { passed++; } else { failed++; }

  if (!token) {
    log('\n❌ Cannot continue - Login failed!', 'red');
    process.exit(1);
  }

  // 2. GET PROFILE
  if (await test('2. Get Admin Profile', async () => {
    const res = await axios.get(`${API}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.data.data.username) throw new Error('No profile data');
  })) { passed++; } else { failed++; }

  // 3. PRODUCTS TESTS
  let productId;
  if (await test('3. Create Product', async () => {
    const res = await axios.post(`${API}/products`, {
      name: 'Test Product',
      name_en: 'Test Product EN',
      category: 'psu_blen',
      description: 'Test Description',
      weight: '350g',
      ingredients: 'test ingredients'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    productId = res.data.id;
    if (!productId) throw new Error('No product ID returned');
  })) { passed++; } else { failed++; }

  if (await test('4. Read All Products (Admin)', async () => {
    const res = await axios.get(`${API}/products/admin/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!Array.isArray(res.data.data)) throw new Error('Not an array');
    if (res.data.data.length === 0) throw new Error('No products returned');
  })) { passed++; } else { failed++; }

  if (await test('5. Read Product by ID', async () => {
    const res = await axios.get(`${API}/products/${productId || 1}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.data.data) throw new Error('No product data');
  })) { passed++; } else { failed++; }

  if (await test('6. Update Product', async () => {
    const res = await axios.put(`${API}/products/${productId || 1}`, {
      name: 'Updated Test Product',
      category: 'meal_box',
      is_active: 1
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Update failed');
  })) { passed++; } else { failed++; }

  // 4. NEWS TESTS
  let newsId;
  if (await test('7. Create News', async () => {
    const res = await axios.post(`${API}/news`, {
      title: 'Test News',
      description: 'Test News Description',
      content: 'Test News Content'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    newsId = res.data.id;
    if (!newsId) throw new Error('No news ID returned');
  })) { passed++; } else { failed++; }

  if (await test('8. Read All News (Admin)', async () => {
    const res = await axios.get(`${API}/news/admin/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!Array.isArray(res.data.data)) throw new Error('Not an array');
  })) { passed++; } else { failed++; }

  if (await test('9. Update News', async () => {
    const res = await axios.put(`${API}/news/${newsId || 1}`, {
      title: 'Updated Test News',
      is_published: 1
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Update failed');
  })) { passed++; } else { failed++; }

  // 5. REVIEWS TESTS
  let reviewId;
  if (await test('10. Create Review', async () => {
    const res = await axios.post(`${API}/reviews`, {
      title: 'Test Review',
      description: 'Test Review Description'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    reviewId = res.data.id;
    if (!reviewId) throw new Error('No review ID returned');
  })) { passed++; } else { failed++; }

  if (await test('11. Read All Reviews (Admin)', async () => {
    const res = await axios.get(`${API}/reviews/admin/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!Array.isArray(res.data.data)) throw new Error('Not an array');
  })) { passed++; } else { failed++; }

  if (await test('12. Update Review', async () => {
    const res = await axios.put(`${API}/reviews/${reviewId || 1}`, {
      title: 'Updated Test Review',
      is_active: 1
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Update failed');
  })) { passed++; } else { failed++; }

  // 6. CERTIFICATES TESTS
  let certId;
  if (await test('13. Create Certificate', async () => {
    const res = await axios.post(`${API}/certificates`, {
      title: 'Test Certificate'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    certId = res.data.id;
    if (!certId) throw new Error('No certificate ID returned');
  })) { passed++; } else { failed++; }

  if (await test('14. Read All Certificates (Admin)', async () => {
    const res = await axios.get(`${API}/certificates/admin/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!Array.isArray(res.data.data)) throw new Error('Not an array');
  })) { passed++; } else { failed++; }

  if (await test('15. Update Certificate', async () => {
    const res = await axios.put(`${API}/certificates/${certId || 1}`, {
      title: 'Updated Test Certificate',
      sort_order: 5
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Update failed');
  })) { passed++; } else { failed++; }

  // 7. BOARD MEMBERS TESTS
  let memberId;
  if (await test('16. Create Board Member', async () => {
    const res = await axios.post(`${API}/board-members`, {
      name: 'Test Member',
      position: 'Test Position',
      section: 'board'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    memberId = res.data.id;
    if (!memberId) throw new Error('No member ID returned');
  })) { passed++; } else { failed++; }

  if (await test('17. Read All Board Members (Admin)', async () => {
    const res = await axios.get(`${API}/board-members/admin/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!Array.isArray(res.data.data)) throw new Error('Not an array');
  })) { passed++; } else { failed++; }

  if (await test('18. Update Board Member', async () => {
    const res = await axios.put(`${API}/board-members/${memberId || 1}`, {
      name: 'Updated Test Member',
      position: 'Updated Position'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Update failed');
  })) { passed++; } else { failed++; }

  // 8. BANNERS TESTS
  let bannerId;
  if (await test('19. Create Banner', async () => {
    const res = await axios.post(`${API}/banners`, {
      title: 'Test Banner',
      subtitle: 'Test Subtitle',
      is_active: 1
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    bannerId = res.data.id;
    if (!bannerId) throw new Error('No banner ID returned');
  })) { passed++; } else { failed++; }

  if (await test('20. Read All Banners (Admin)', async () => {
    const res = await axios.get(`${API}/banners/admin/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!Array.isArray(res.data.data)) throw new Error('Not an array');
  })) { passed++; } else { failed++; }

  if (await test('21. Update Banner', async () => {
    const res = await axios.put(`${API}/banners/${bannerId || 1}`, {
      title: 'Updated Test Banner',
      is_active: 1
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Update failed');
  })) { passed++; } else { failed++; }

  // 9. SETTINGS TESTS
  if (await test('22. Update Settings (Get/Save)', async () => {
    const res = await axios.put(`${API}/settings/batch-update`, {
      settings: [
        { key: 'site_name', value: 'Test Site' },
        { key: 'site_description', value: 'Test Description' }
      ]
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Settings save failed');
  })) { passed++; } else { failed++; }

  if (await test('23. Read Settings', async () => {
    const res = await axios.get(`${API}/settings`);
    if (!res.data.data) throw new Error('No settings data');
  })) { passed++; } else { failed++; }

  // 10. DELETE TESTS
  if (await test('24. Delete Product', async () => {
    await axios.delete(`${API}/products/${productId || 1}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  })) { passed++; } else { failed++; }

  if (await test('25. Delete News', async () => {
    await axios.delete(`${API}/news/${newsId || 1}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  })) { passed++; } else { failed++; }

  if (await test('26. Delete Review', async () => {
    await axios.delete(`${API}/reviews/${reviewId || 1}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  })) { passed++; } else { failed++; }

  if (await test('27. Delete Certificate', async () => {
    await axios.delete(`${API}/certificates/${certId || 1}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  })) { passed++; } else { failed++; }

  if (await test('28. Delete Board Member', async () => {
    await axios.delete(`${API}/board-members/${memberId || 1}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  })) { passed++; } else { failed++; }

  if (await test('29. Delete Banner', async () => {
    await axios.delete(`${API}/banners/${bannerId || 1}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  })) { passed++; } else { failed++; }

  // 11. ADVANCED TESTS
  if (await test('30. Change Password', async () => {
    const res = await axios.put(`${API}/auth/change-password`, {
      currentPassword: 'admin123',
      newPassword: 'admin123'  // Change back to same password
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.data.success) throw new Error('Password change failed');
  })) { passed++; } else { failed++; }

  if (await test('31. Get Public Products', async () => {
    const res = await axios.get(`${API}/products`);
    if (!Array.isArray(res.data.data)) throw new Error('Not an array');
  })) { passed++; } else { failed++; }

  if (await test('32. Health Check', async () => {
    const res = await axios.get(`${API}/health`);
    if (res.data.db !== 'MySQL') throw new Error('Not using MySQL');
  })) { passed++; } else { failed++; }

  // SUMMARY
  log(`\n${'═'.repeat(50)}`, 'blue');
  log(`Total Tests: ${passed + failed}`, 'blue');
  log(`✅ Passed: ${passed}`, 'green');
  log(`❌ Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  
  if (failed === 0) {
    log('\n🎉 ALL TESTS PASSED! MySQL integration is working perfectly!\n', 'green');
    process.exit(0);
  } else {
    log(`\n⚠️  ${failed} test(s) failed. Check the errors above.\n`, 'yellow');
    process.exit(1);
  }
}

runTests().catch(err => {
  log(`\n❌ Fatal Error: ${err.message}\n`, 'red');
  process.exit(1);
});
