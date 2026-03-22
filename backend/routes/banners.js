const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getAllBanners, getAllBannersAdmin, createBanner, updateBanner, deleteBanner, getDashboardStats } = require('../controllers/mainController');
const { validateId } = require('../middleware/validate');

router.get('/', getAllBanners);
router.get('/admin/all', authenticateToken, getAllBannersAdmin);
router.get('/admin/dashboard', authenticateToken, getDashboardStats);
router.post('/', authenticateToken, upload.single('image'), createBanner);
router.put('/:id', authenticateToken, validateId, upload.single('image'), updateBanner);
router.delete('/:id', authenticateToken, validateId, deleteBanner);

module.exports = router;
