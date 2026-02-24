const router = require('express').Router();
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getAllNews, getNewsById, getAllNewsAdmin, createNews, updateNews, deleteNews } = require('../controllers/mainController');

router.get('/',              getAllNews);           // public: published only
router.get('/admin/all',     authenticateToken, getAllNewsAdmin); // admin: all
router.get('/:id',           getNewsById);
router.post('/',             authenticateToken, upload.single('image'), createNews);
router.put('/:id',           authenticateToken, upload.single('image'), updateNews);
router.delete('/:id',        authenticateToken, deleteNews);

module.exports = router;
