const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getAllCertificates, createCertificate, updateCertificate, deleteCertificate } = require('../controllers/mainController');

router.get('/admin/all', authenticateToken, getAllCertificates);  // Admin - all certificates
router.get('/', getAllCertificates);
router.post('/', authenticateToken, upload.single('image'), createCertificate);
router.put('/:id', authenticateToken, upload.single('image'), updateCertificate);
router.delete('/:id', authenticateToken, deleteCertificate);

module.exports = router;
