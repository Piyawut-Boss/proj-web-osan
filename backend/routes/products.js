const express = require('express');
const router  = express.Router();
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateId } = require('../middleware/validate');
const {
  getAllProducts, getAllProductsAdmin, getProductById,
  createProduct, updateProduct, deleteProduct
} = require('../controllers/mainController');

// Public: active products only
router.get('/', getAllProducts);

// Admin: ALL products (protected)
router.get('/admin/all', authenticateToken, getAllProductsAdmin);

router.get('/:id', validateId, getProductById);

router.post('/',    authenticateToken, upload.single('image'), createProduct);
router.put('/:id',  authenticateToken, validateId, upload.single('image'), updateProduct);
router.delete('/:id', authenticateToken, validateId, deleteProduct);

module.exports = router;
