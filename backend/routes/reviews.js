const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getAllReviews, getReviewById, getAllReviewsAdmin, createReview, updateReview, deleteReview } = require('../controllers/mainController');
const { validateId } = require('../middleware/validate');

router.get('/',             getAllReviews);                                          // public
router.get('/admin/all',    authenticateToken, getAllReviewsAdmin);                  // admin
router.get('/:id',          validateId, getReviewById);                                          // public detail
router.post('/',            authenticateToken, upload.single('image'), createReview);
router.put('/:id',          authenticateToken, validateId, upload.single('image'), updateReview);
router.delete('/:id',       authenticateToken, validateId, deleteReview);

module.exports = router;
