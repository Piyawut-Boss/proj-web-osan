const db = require('../models/db');
const fs = require('fs');
const path = require('path');

// Delete a file safely
const deleteFile = (filePath) => {
  if (!filePath) return;
  try {
    const full = path.join(__dirname, '..', filePath.replace(/\\/g, '/'));
    if (fs.existsSync(full)) fs.unlinkSync(full);
  } catch (e) { /* ignore */ }
};

// Build full image URL from stored relative path
const buildImageUrl = (req, filePath) => {
  if (!filePath) return null;
  if (filePath.startsWith('http')) return filePath;
  const clean = filePath.replace(/\\/g, '/').replace(/^\//, '');
  return `${req.protocol}://${req.get('host')}/${clean}`;
};

// Normalize boolean from form data (string "true"/"false" or actual bool)
const toBool = (v, fallback = 1) => {
  if (v === undefined || v === null) return fallback;
  if (v === true || v === 1 || v === '1' || v === 'true') return 1;
  if (v === false || v === 0 || v === '0' || v === 'false') return 0;
  return fallback;
};

// ── PRODUCTS ─────────────────────────────────────────────────────────────────

const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM products WHERE is_active = 1';
    const params = [];
    if (category) { query += ' AND category = ?'; params.push(category); }
    query += ' ORDER BY sort_order ASC, created_at DESC';
    const [rows] = await db.execute(query, params);
    res.json({ success: true, data: rows.map(r => ({ ...r, image: buildImageUrl(req, r.image) })) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getAllProductsAdmin = async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM products';
    const params = [];
    if (category) { query += ' WHERE category = ?'; params.push(category); }
    query += ' ORDER BY sort_order ASC, created_at DESC';
    const [rows] = await db.execute(query, params);
    const data = rows.map(r => ({ ...r, image: buildImageUrl(req, r.image) }));
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const getProductById = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: { ...rows[0], image: buildImageUrl(req, rows[0].image) } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
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
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
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
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const deleteProduct = async (req, res) => {
  try {
    const [existing] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Product not found' });
    deleteFile(existing[0].image);
    await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ── NEWS ─────────────────────────────────────────────────────────────────────

const getAllNews = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM news WHERE is_published = 1 ORDER BY created_at DESC');
    res.json({ success: true, data: rows.map(r => ({ ...r, image: buildImageUrl(req, r.image) })) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getNewsById = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM news WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'News not found' });
    res.json({ success: true, data: { ...rows[0], image: buildImageUrl(req, rows[0].image) } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getAllNewsAdmin = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM news ORDER BY created_at DESC');
    res.json({ success: true, data: rows.map(r => ({ ...r, image: buildImageUrl(req, r.image) })) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const createNews = async (req, res) => {
  try {
    const { title, description, content } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'title is required' });
    const image = req.file ? req.file.path.replace(/\\/g, '/').replace(/.*\/uploads\//, 'uploads/') : null;
    const [result] = await db.execute(
      'INSERT INTO news (title, description, content, image) VALUES (?,?,?,?)',
      [title, description || null, content || null, image]
    );
    res.status(201).json({ success: true, message: 'News created', id: result.insertId });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const updateNews = async (req, res) => {
  try {
    const { title, description, content, is_published } = req.body;
    const [existing] = await db.execute('SELECT * FROM news WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'News not found' });
    let image = existing[0].image;
    if (req.file) { deleteFile(image); image = req.file.path.replace(/\\/g, '/').replace(/.*\/uploads\//, 'uploads/'); }
    await db.execute(
      'UPDATE news SET title=?, description=?, content=?, image=?, is_published=? WHERE id=?',
      [title || existing[0].title, description ?? existing[0].description,
       content ?? existing[0].content, image,
       toBool(is_published, existing[0].is_published), req.params.id]
    );
    res.json({ success: true, message: 'News updated' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const deleteNews = async (req, res) => {
  try {
    const [existing] = await db.execute('SELECT * FROM news WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'News not found' });
    deleteFile(existing[0].image);
    await db.execute('DELETE FROM news WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'News deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ── REVIEWS ───────────────────────────────────────────────────────────────────

const getAllReviews = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM reviews WHERE is_active = 1 ORDER BY created_at DESC');
    res.json({ success: true, data: rows.map(r => ({ ...r, image: buildImageUrl(req, r.image) })) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getAllReviewsAdmin = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM reviews ORDER BY created_at DESC');
    res.json({ success: true, data: rows.map(r => ({ ...r, image: buildImageUrl(req, r.image) })) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const createReview = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'title is required' });
    const image = req.file ? req.file.path.replace(/\\/g, '/').replace(/.*\/uploads\//, 'uploads/') : null;
    const [result] = await db.execute(
      'INSERT INTO reviews (title, description, image) VALUES (?,?,?)',
      [title, description || null, image]
    );
    res.status(201).json({ success: true, message: 'Review created', id: result.insertId });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const updateReview = async (req, res) => {
  try {
    const { title, description, is_active } = req.body;
    const [existing] = await db.execute('SELECT * FROM reviews WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Review not found' });
    let image = existing[0].image;
    if (req.file) { deleteFile(image); image = req.file.path.replace(/\\/g, '/').replace(/.*\/uploads\//, 'uploads/'); }
    await db.execute(
      'UPDATE reviews SET title=?, description=?, image=?, is_active=? WHERE id=?',
      [title || existing[0].title, description ?? existing[0].description,
       image, toBool(is_active, existing[0].is_active), req.params.id]
    );
    res.json({ success: true, message: 'Review updated' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const deleteReview = async (req, res) => {
  try {
    const [existing] = await db.execute('SELECT * FROM reviews WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Review not found' });
    deleteFile(existing[0].image);
    await db.execute('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ── CERTIFICATES ──────────────────────────────────────────────────────────────

const getAllCertificates = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM certificates ORDER BY sort_order ASC, id ASC');
    res.json({ success: true, data: rows.map(r => ({ ...r, image: buildImageUrl(req, r.image) })) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
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
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
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
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const deleteCertificate = async (req, res) => {
  try {
    const [existing] = await db.execute('SELECT * FROM certificates WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Certificate not found' });
    deleteFile(existing[0].image);
    await db.execute('DELETE FROM certificates WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Certificate deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ── BOARD MEMBERS ─────────────────────────────────────────────────────────────

const getAllBoardMembers = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM board_members ORDER BY section ASC, sort_order ASC');
    res.json({ success: true, data: rows.map(r => ({ ...r, image: buildImageUrl(req, r.image) })) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const createBoardMember = async (req, res) => {
  try {
    const { name, position, section, sort_order } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'name is required' });
    const image = req.file ? req.file.path.replace(/\\/g, '/').replace(/.*\/uploads\//, 'uploads/') : null;
    const [result] = await db.execute(
      'INSERT INTO board_members (name, position, section, image, sort_order) VALUES (?,?,?,?,?)',
      [name, position || null, section || 'board', image, parseInt(sort_order) || 0]
    );
    res.status(201).json({ success: true, message: 'Board member created', id: result.insertId });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const updateBoardMember = async (req, res) => {
  try {
    const { name, position, section, sort_order } = req.body;
    const [existing] = await db.execute('SELECT * FROM board_members WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Board member not found' });
    let image = existing[0].image;
    if (req.file) { deleteFile(image); image = req.file.path.replace(/\\/g, '/').replace(/.*\/uploads\//, 'uploads/'); }
    await db.execute(
      'UPDATE board_members SET name=?, position=?, section=?, image=?, sort_order=? WHERE id=?',
      [name || existing[0].name, position ?? existing[0].position,
       section || existing[0].section, image,
       parseInt(sort_order) ?? existing[0].sort_order, req.params.id]
    );
    res.json({ success: true, message: 'Board member updated' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const deleteBoardMember = async (req, res) => {
  try {
    const [existing] = await db.execute('SELECT * FROM board_members WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Board member not found' });
    deleteFile(existing[0].image);
    await db.execute('DELETE FROM board_members WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Board member deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ── BANNERS ───────────────────────────────────────────────────────────────────

const getAllBanners = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM banners WHERE is_active = 1 ORDER BY sort_order ASC, id ASC');
    res.json({ success: true, data: rows.map(r => ({ ...r, image: buildImageUrl(req, r.image) })) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getAllBannersAdmin = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM banners ORDER BY sort_order ASC, id DESC');
    res.json({ success: true, data: rows.map(r => ({ ...r, image: buildImageUrl(req, r.image) })) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
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
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
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
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const deleteBanner = async (req, res) => {
  try {
    const [existing] = await db.execute('SELECT * FROM banners WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Banner not found' });
    deleteFile(existing[0].image);
    await db.execute('DELETE FROM banners WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Banner deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ── DASHBOARD ─────────────────────────────────────────────────────────────────

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
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = {
  getAllProducts, getAllProductsAdmin, getProductById, createProduct, updateProduct, deleteProduct,
  getAllNews, getNewsById, getAllNewsAdmin, createNews, updateNews, deleteNews,
  getAllReviews, getAllReviewsAdmin, createReview, updateReview, deleteReview,
  getAllCertificates, createCertificate, updateCertificate, deleteCertificate,
  getAllBoardMembers, createBoardMember, updateBoardMember, deleteBoardMember,
  getAllBanners, getAllBannersAdmin, createBanner, updateBanner, deleteBanner,
  getDashboardStats,
};
