const db = require('../models/db');
const fs = require('fs');
const path = require('path');

// Safe error response â€” never leak internal details to client
const serverError = (res, err) => {
  console.error('Server error:', err.message);
  return res.status(500).json({ success: false, message: 'Server error' });
};

// Delete a file safely — prevented from path traversal
const deleteFile = (filePath) => {
  if (!filePath) return;
  try {
    const uploadsDir = path.resolve(__dirname, '..', 'uploads');
    const full = path.resolve(__dirname, '..', filePath.replace(/\\/g, '/'));
    if (!full.startsWith(uploadsDir)) return;
    if (fs.existsSync(full)) fs.unlinkSync(full);
  } catch (e) { /* ignore */ }
};

// Build image URL - return relative path for proxy compatibility
// Works both in development and with ngrok tunneling
const buildImageUrl = (filePath) => {
  if (!filePath) return null;
  if (filePath.startsWith('http')) return filePath;
  // Return relative path that works with Vite proxy: /uploads/...
  const clean = filePath.replace(/\\/g, '/').replace(/^\//, '');
  return `/${clean}`;
};

// Normalize boolean from form data (string "true"/"false" or actual bool)
const toBool = (v, fallback = 1) => {
  if (v === undefined || v === null) return fallback;
  if (v === true || v === 1 || v === '1' || v === 'true') return 1;
  if (v === false || v === 0 || v === '0' || v === 'false') return 0;
  return fallback;
};

// â”€â”€ PRODUCTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM products WHERE is_active = 1';
    const params = [];
    if (category) { query += ' AND category = ?'; params.push(category); }
    query += ' ORDER BY sort_order ASC, created_at DESC';
    const [rows] = await db.execute(query, params);
    res.json({ success: true, data: rows.map(r => ({ ...r, image: buildImageUrl(r.image) })) });
  } catch (err) { serverError(res, err); }
};

const getAllProductsAdmin = async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM products';
    const params = [];
    if (category) { query += ' WHERE category = ?'; params.push(category); }
    query += ' ORDER BY sort_order ASC, created_at DESC';
    const [rows] = await db.execute(query, params);
    const data = rows.map(r => ({ ...r, image: buildImageUrl(r.image) }));
    res.json({ success: true, data });
  } catch (err) {
    serverError(res, err);
  }
};


const getProductById = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: { ...rows[0], image: buildImageUrl(rows[0].image) } });
  } catch (err) { serverError(res, err); }
};

const createProduct = async (req, res) => {
  try {
    const { name, name_en, name_zh, name_ms, name_ar, category, description, description_en, description_zh, description_ms, description_ar, ingredients, weight } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'name is required' });
    const image = req.file ? req.file.path.replace(/\\/g, '/').replace(/.*\/uploads\//, 'uploads/') : null;
    const [result] = await db.execute(
      'INSERT INTO products (name, name_en, name_zh, name_ms, name_ar, category, description, description_en, description_zh, description_ms, description_ar, ingredients, weight, image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [name, name_en || null, name_zh || null, name_ms || null, name_ar || null, category || 'psu_blen', description || null, description_en || null, description_zh || null, description_ms || null, description_ar || null, ingredients || null, weight || null, image]
    );
    res.status(201).json({ success: true, message: 'Product created', id: result.insertId });
  } catch (err) { serverError(res, err); }
};

const updateProduct = async (req, res) => {
  try {
    const { name, name_en, name_zh, name_ms, name_ar, category, description, description_en, description_zh, description_ms, description_ar, ingredients, weight, is_active } = req.body;
    const [existing] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Product not found' });
    let image = existing[0].image;
    if (req.file) { deleteFile(image); image = req.file.path.replace(/\\/g, '/').replace(/.*\/uploads\//, 'uploads/'); }
    await db.execute(
      'UPDATE products SET name=?, name_en=?, name_zh=?, name_ms=?, name_ar=?, category=?, description=?, description_en=?, description_zh=?, description_ms=?, description_ar=?, ingredients=?, weight=?, image=?, is_active=? WHERE id=?',
      [name || existing[0].name, name_en ?? existing[0].name_en, name_zh ?? existing[0].name_zh, name_ms ?? existing[0].name_ms, name_ar ?? existing[0].name_ar, category || existing[0].category,
       description ?? existing[0].description, description_en ?? existing[0].description_en, description_zh ?? existing[0].description_zh, description_ms ?? existing[0].description_ms, description_ar ?? existing[0].description_ar,
       ingredients ?? existing[0].ingredients, weight ?? existing[0].weight,
       image, toBool(is_active, existing[0].is_active), req.params.id]
    );
    res.json({ success: true, message: 'Product updated' });
  } catch (err) { serverError(res, err); }
};

const deleteProduct = async (req, res) => {
  try {
    const [existing] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Product not found' });
    deleteFile(existing[0].image);
    await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) { serverError(res, err); }
};

// â”€â”€ NEWS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const getAllNews = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM news WHERE is_published = 1 ORDER BY created_at DESC');
    res.json({ success: true, data: rows.map(r => ({ ...r, image: buildImageUrl(r.image) })) });
  } catch (err) { serverError(res, err); }
};

const getNewsById = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM news WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'News not found' });
    res.json({ success: true, data: { ...rows[0], image: buildImageUrl(rows[0].image) } });
  } catch (err) { serverError(res, err); }
};

const getAllNewsAdmin = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM news ORDER BY created_at DESC');
    res.json({ success: true, data: rows.map(r => ({ ...r, image: buildImageUrl(r.image) })) });
  } catch (err) { serverError(res, err); }
};

const createNews = async (req, res) => {
  try {
    const { title, description, content, published_date, link_url, is_published } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'title is required' });
    const image = req.file ? req.file.path.replace(/\\/g, '/').replace(/.*\/uploads\//, 'uploads/') : null;
    const [result] = await db.execute(
      'INSERT INTO news (title, description, content, image, published_date, link_url, is_published) VALUES (?,?,?,?,?,?,?)',
      [title, description || null, content || null, image, published_date || null, link_url || null, toBool(is_published, 1)]
    );
    res.status(201).json({ success: true, message: 'News created', id: result.insertId });
  } catch (err) { serverError(res, err); }
};

const updateNews = async (req, res) => {
  try {
    const { title, description, content, published_date, link_url, is_published } = req.body;
    const [existing] = await db.execute('SELECT * FROM news WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'News not found' });
    let image = existing[0].image;
    if (req.file) { deleteFile(image); image = req.file.path.replace(/\\/g, '/').replace(/.*\/uploads\//, 'uploads/'); }
    await db.execute(
      'UPDATE news SET title=?, description=?, content=?, image=?, published_date=?, link_url=?, is_published=? WHERE id=?',
      [title || existing[0].title, description ?? existing[0].description,
       content ?? existing[0].content, image, published_date ?? existing[0].published_date,
       link_url ?? existing[0].link_url, toBool(is_published, existing[0].is_published), req.params.id]
    );
    res.json({ success: true, message: 'News updated' });
  } catch (err) { serverError(res, err); }
};

const deleteNews = async (req, res) => {
  try {
    const [existing] = await db.execute('SELECT * FROM news WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'News not found' });
    deleteFile(existing[0].image);
    await db.execute('DELETE FROM news WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'News deleted' });
  } catch (err) { serverError(res, err); }
};

// â”€â”€ REVIEWS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const getAllReviews = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM reviews WHERE is_active = 1 ORDER BY created_at DESC');
    res.json({ success: true, data: rows.map(r => ({ ...r, image: buildImageUrl(r.image) })) });
  } catch (err) { serverError(res, err); }
};

const getAllReviewsAdmin = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM reviews ORDER BY created_at DESC');
    res.json({ success: true, data: rows.map(r => ({ ...r, image: buildImageUrl(r.image) })) });
  } catch (err) { serverError(res, err); }
};

const getReviewById = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM reviews WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, data: { ...rows[0], image: buildImageUrl(rows[0].image) } });
  } catch (err) { serverError(res, err); }
};

const createReview = async (req, res) => {
  try {
    const { title, description, published_date, link_url } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'title is required' });
    const image = req.file ? req.file.path.replace(/\\/g, '/').replace(/.*\/uploads\//, 'uploads/') : null;
    const [result] = await db.execute(
      'INSERT INTO reviews (title, description, image, published_date, link_url) VALUES (?,?,?,?,?)',
      [title, description || null, image, published_date || null, link_url || null]
    );
    res.status(201).json({ success: true, message: 'Review created', id: result.insertId });
  } catch (err) { serverError(res, err); }
};

const updateReview = async (req, res) => {
  try {
    const { title, description, published_date, link_url, is_active } = req.body;
    const [existing] = await db.execute('SELECT * FROM reviews WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Review not found' });
    let image = existing[0].image;
    if (req.file) { deleteFile(image); image = req.file.path.replace(/\\/g, '/').replace(/.*\/uploads\//, 'uploads/'); }
    await db.execute(
      'UPDATE reviews SET title=?, description=?, image=?, published_date=?, link_url=?, is_active=? WHERE id=?',
      [title || existing[0].title, description ?? existing[0].description,
       image, published_date ?? existing[0].published_date, link_url ?? existing[0].link_url, 
       toBool(is_active, existing[0].is_active), req.params.id]
    );
    res.json({ success: true, message: 'Review updated' });
  } catch (err) { serverError(res, err); }
};

const deleteReview = async (req, res) => {
  try {
    const [existing] = await db.execute('SELECT * FROM reviews WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Review not found' });
    deleteFile(existing[0].image);
    await db.execute('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) { serverError(res, err); }
};

// â”€â”€ CERTIFICATES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const getAllCertificates = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM certificates ORDER BY sort_order ASC, id ASC');
    res.json({ success: true, data: rows.map(r => ({ ...r, image: buildImageUrl(r.image) })) });
  } catch (err) { serverError(res, err); }
};

const createCertificate = async (req, res) => {
  try {
    const { title, sort_order } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'title is required' });
    const image = req.file ? req.file.path.replace(/\\/g, '/').replace(/.*\/uploads\//, 'uploads/') : null;
    const [result] = await db.execute(
      'INSERT INTO certificates (title, image, sort_order) VALUES (?,?,?)',
      [title, image, parseInt(sort_order) || 0]
    );
    res.status(201).json({ success: true, message: 'Certificate created', id: result.insertId });
  } catch (err) { serverError(res, err); }
};

const updateCertificate = async (req, res) => {
  try {
    const { title, sort_order } = req.body;
    const [existing] = await db.execute('SELECT * FROM certificates WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Certificate not found' });
    let image = existing[0].image;
    if (req.file) { deleteFile(image); image = req.file.path.replace(/\\/g, '/').replace(/.*\/uploads\//, 'uploads/'); }
    await db.execute(
      'UPDATE certificates SET title=?, image=?, sort_order=? WHERE id=?',
      [title || existing[0].title, image, parseInt(sort_order) ?? existing[0].sort_order, req.params.id]
    );
    res.json({ success: true, message: 'Certificate updated' });
  } catch (err) { serverError(res, err); }
};

const deleteCertificate = async (req, res) => {
  try {
    const [existing] = await db.execute('SELECT * FROM certificates WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Certificate not found' });
    deleteFile(existing[0].image);
    await db.execute('DELETE FROM certificates WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Certificate deleted' });
  } catch (err) { serverError(res, err); }
};

// â”€â”€ BOARD MEMBERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const getAllBoardMembers = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM board_members ORDER BY board_type ASC, sort_order ASC');
    res.json({ success: true, data: rows.map(r => ({ ...r, image: buildImageUrl(r.image) })) });
  } catch (err) { serverError(res, err); }
};

const createBoardMember = async (req, res) => {
  try {
    const { name, position, board_type, sort_order } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'name is required' });
    const image = req.file ? req.file.path.replace(/\\/g, '/').replace(/.*\/uploads\//, 'uploads/') : null;
    const [result] = await db.execute(
      'INSERT INTO board_members (name, position, board_type, image, sort_order) VALUES (?,?,?,?,?)',
      [name, position || null, board_type || 'board', image, parseInt(sort_order) || 0]
    );
    res.status(201).json({ success: true, message: 'Board member created', id: result.insertId });
  } catch (err) { serverError(res, err); }
};

const updateBoardMember = async (req, res) => {
  try {
    const { name, position, board_type, sort_order } = req.body;
    const [existing] = await db.execute('SELECT * FROM board_members WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Board member not found' });
    let image = existing[0].image;
    if (req.file) { deleteFile(image); image = req.file.path.replace(/\\/g, '/').replace(/.*\/uploads\//, 'uploads/'); }
    await db.execute(
      'UPDATE board_members SET name=?, position=?, board_type=?, image=?, sort_order=? WHERE id=?',
      [name || existing[0].name, position ?? existing[0].position,
       board_type || existing[0].board_type, image,
       parseInt(sort_order) ?? existing[0].sort_order, req.params.id]
    );
    res.json({ success: true, message: 'Board member updated' });
  } catch (err) { serverError(res, err); }
};

const deleteBoardMember = async (req, res) => {
  try {
    const [existing] = await db.execute('SELECT * FROM board_members WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Board member not found' });
    deleteFile(existing[0].image);
    await db.execute('DELETE FROM board_members WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Board member deleted' });
  } catch (err) { serverError(res, err); }
};

// â”€â”€ BANNERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const getAllBanners = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM banners WHERE is_active = 1 ORDER BY sort_order ASC, id ASC');
    res.json({ success: true, data: rows.map(r => ({ ...r, image: buildImageUrl(r.image) })) });
  } catch (err) { serverError(res, err); }
};

const getAllBannersAdmin = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM banners ORDER BY sort_order ASC, id DESC');
    res.json({ success: true, data: rows.map(r => ({ ...r, image: buildImageUrl(r.image) })) });
  } catch (err) { serverError(res, err); }
};

const createBanner = async (req, res) => {
  try {
    const { title, subtitle, link_url, sort_order, is_active } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, '/').replace(/.*\/uploads\//, 'uploads/') : null;
    const [result] = await db.execute(
      'INSERT INTO banners (title, subtitle, image, link_url, sort_order, is_active) VALUES (?,?,?,?,?,?)',
      [title || null, subtitle || null, image, link_url || null, parseInt(sort_order) || 0, toBool(is_active, 1)]
    );
    res.status(201).json({ success: true, message: 'Banner created', id: result.insertId });
  } catch (err) { serverError(res, err); }
};

const updateBanner = async (req, res) => {
  try {
    const { title, subtitle, link_url, sort_order, is_active } = req.body;
    const [existing] = await db.execute('SELECT * FROM banners WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Banner not found' });
    let image = existing[0].image;
    if (req.file) { deleteFile(image); image = req.file.path.replace(/\\/g, '/').replace(/.*\/uploads\//, 'uploads/'); }
    await db.execute(
      'UPDATE banners SET title=?, subtitle=?, image=?, link_url=?, sort_order=?, is_active=? WHERE id=?',
      [title ?? existing[0].title, subtitle ?? existing[0].subtitle,
       image, link_url ?? existing[0].link_url,
       parseInt(sort_order) ?? existing[0].sort_order,
       toBool(is_active, existing[0].is_active), req.params.id]
    );
    res.json({ success: true, message: 'Banner updated' });
  } catch (err) { serverError(res, err); }
};

const deleteBanner = async (req, res) => {
  try {
    const [existing] = await db.execute('SELECT * FROM banners WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Banner not found' });
    deleteFile(existing[0].image);
    await db.execute('DELETE FROM banners WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Banner deleted' });
  } catch (err) { serverError(res, err); }
};

// â”€â”€ DASHBOARD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const getDashboardStats = async (req, res) => {
  try {
    const [[{ count: products }]] = await db.execute('SELECT COUNT(*) as count FROM products');
    const [[{ count: news }]]     = await db.execute('SELECT COUNT(*) as count FROM news');
    const [[{ count: reviews }]]  = await db.execute('SELECT COUNT(*) as count FROM reviews');
    const [[{ count: certs }]]    = await db.execute('SELECT COUNT(*) as count FROM certificates');
    const [[{ count: members }]]  = await db.execute('SELECT COUNT(*) as count FROM board_members');
    const [[{ count: banners }]]  = await db.execute('SELECT COUNT(*) as count FROM banners');
    const [recentNews]            = await db.execute('SELECT id, title, created_at FROM news ORDER BY created_at DESC LIMIT 5');

    res.json({
      success: true,
      data: { products, news, reviews, certificates: certs, board_members: members, banners, recentNews },
    });
  } catch (err) { serverError(res, err); }
};

module.exports = {
  getAllProducts, getAllProductsAdmin, getProductById, createProduct, updateProduct, deleteProduct,
  getAllNews, getNewsById, getAllNewsAdmin, createNews, updateNews, deleteNews,
  getAllReviews, getReviewById, getAllReviewsAdmin, createReview, updateReview, deleteReview,
  getAllCertificates, createCertificate, updateCertificate, deleteCertificate,
  getAllBoardMembers, createBoardMember, updateBoardMember, deleteBoardMember,
  getAllBanners, getAllBannersAdmin, createBanner, updateBanner, deleteBanner,
  getDashboardStats,
};
