const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getAllBoardMembers, createBoardMember, updateBoardMember, deleteBoardMember } = require('../controllers/mainController');

router.get('/admin/all', authenticateToken, getAllBoardMembers);  // Admin - all board members
router.get('/', getAllBoardMembers);
router.post('/', authenticateToken, upload.single('image'), createBoardMember);
router.put('/:id', authenticateToken, upload.single('image'), updateBoardMember);
router.delete('/:id', authenticateToken, deleteBoardMember);

module.exports = router;
