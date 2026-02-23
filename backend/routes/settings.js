const router = require('express').Router();
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getAll, getAdmin, update, batchUpdate } = require('../controllers/settingsController');

// Public — all settings as key:value map
router.get('/', getAll);

// Admin — settings with metadata
router.get('/admin', authenticateToken, getAdmin);

// IMPORTANT: /batch-update must come BEFORE /:key so Express doesn't treat 'batch-update' as a key param
router.put('/batch-update', authenticateToken, batchUpdate);

// Single setting update (text or image)
router.put('/:key', authenticateToken, upload.single('image'), update);

module.exports = router;
