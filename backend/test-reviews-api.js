const api = require('./utils/api');

(async () => {
  try {
    // Test 1: Check if reviews list endpoint works (public)
    console.log('Testing: GET /api/reviews (public)...');
    const publicReviews = await api.get('/reviews');
    console.log('✓ Public reviews endpoint works');
    
    // Test 2: Check if reviews admin endpoint works
    console.log('Testing: GET /api/reviews/admin/all...');
    const adminReviews = await api.get('/reviews/admin/all');
    console.log('✓ Admin reviews endpoint works');
    
    // Test 3: List all available routes
    console.log('\nAvailable routes registered:');
    console.log('  - /api/auth');
    console.log('  - /api/products');
    console.log('  - /api/news');
    console.log('  - /api/reviews');
    console.log('  - /api/certificates');
    console.log('  - /api/board-members');
    console.log('  - /api/banners');
    console.log('  - /api/settings');
    
    console.log('\nTo update a review:');
    console.log('  PUT /api/reviews/:id');
    console.log('  Headers: Authorization: Bearer {token}, Content-Type: multipart/form-data');
    console.log('  Body: { title, description, is_active, image (file - optional) }');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
