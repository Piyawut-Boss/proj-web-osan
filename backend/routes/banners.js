const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getAllBanners, getAllBannersAdmin, createBanner, updateBanner, deleteBanner, getDashboardStats } = require('../controllers/mainController');

router.get('/', getAllBanners);
router.get('/admin/all', authenticateToken, getAllBannersAdmin);
router.get('/admin/dashboard', authenticateToken, getDashboardStats);
router.post('/', authenticateToken, upload.single('image'), createBanner);
router.put('/:id', authenticateToken, upload.single('image'), updateBanner);
router.delete('/:id', authenticateToken, deleteBanner);

module.exports = router;
