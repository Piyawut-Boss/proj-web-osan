const axios = require('axios');

const API = 'http://localhost:5000/api';

async function debugImages() {
  try {
    // Login
    const loginRes = await axios.post(`${API}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    const token = loginRes.data.token;

    // Get products
    console.log('🔍 Checking Products Response...\n');
    const productsRes = await axios.get(`${API}/products/admin/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Products Response:');
    console.log(JSON.stringify(productsRes.data, null, 2));

    console.log('\n\n🔍 Checking Certificates Response...\n');
    const certsRes = await axios.get(`${API}/certificates/admin/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Certificates Response:');
    console.log(JSON.stringify(certsRes.data, null, 2));

    console.log('\n\n🔍 Checking Board Members Response...\n');
    const boardRes = await axios.get(`${API}/board-members/admin/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Board Members Response:');
    console.log(JSON.stringify(boardRes.data, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

debugImages();
