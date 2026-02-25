const express = require('express');
const fs      = require('fs');
const path    = require('path');
const router  = express.Router();

// GET /api/products-home-images
// Returns all image URLs from backend/uploads/productsHome/
router.get('/', (req, res) => {
  const dir = path.join(__dirname, '..', 'uploads', 'productsHome');

  if (!fs.existsSync(dir)) {
    return res.json({ success: true, data: [] });
  }

  const files = fs.readdirSync(dir).filter(f =>
    /\.(jpg|jpeg|png|webp|gif)$/i.test(f)
  );

  const urls = files.map(f => `/uploads/productsHome/${f}`);
  res.json({ success: true, data: urls });
});

module.exports = router;