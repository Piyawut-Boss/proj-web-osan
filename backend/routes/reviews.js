const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getAllReviews, getAllReviewsAdmin, createReview, updateReview, deleteReview } = require('../controllers/mainController');

router.get('/',             getAllReviews);                                          // public
router.get('/admin/all',    authenticateToken, getAllReviewsAdmin);                  // admin
router.post('/',            authenticateToken, upload.single('image'), createReview);
router.put('/:id',          authenticateToken, upload.single('image'), updateReview);
router.delete('/:id',       authenticateToken, deleteReview);

module.exports = router;
