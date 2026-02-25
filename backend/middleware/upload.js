const multer = require('multer');
const path = require('path');
const fs = require('fs');

// All upload sub-directories
const uploadDirs = [
  'uploads',
  'uploads/products',
  'uploads/news',
  'uploads/reviews',
  'uploads/certificates',
  'uploads/board_members',
  'uploads/banners',
  'uploads/settings',
];

uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const url = req.originalUrl;
    let folder = 'uploads';
    if (url.includes('/products'))     folder = 'uploads/products';
    else if (url.includes('/news'))    folder = 'uploads/news';
    else if (url.includes('/reviews')) folder = 'uploads/reviews';
    else if (url.includes('/certificates')) folder = 'uploads/certificates';
    else if (url.includes('/board-members')) folder = 'uploads/board_members';
    else if (url.includes('/banners')) folder = 'uploads/banners';
    else if (url.includes('/settings')) folder = 'uploads/settings';
    cb(null, path.join(__dirname, '..', folder));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, unique + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 10MB
});

module.exports = upload;
