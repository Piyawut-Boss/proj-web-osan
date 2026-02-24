const db = require('../models/db');
const fs = require('fs');
const path = require('path');

// Convert stored relative path to full URL
const toUrl = (req, val) => {
  if (!val) return '';
  if (val.startsWith('http')) return val;
  // Normalize backslashes (Windows) and strip leading slash
  const clean = val.replace(/\\/g, '/').replace(/^\//, '');
  return `${req.protocol}://${req.get('host')}/${clean}`;
};

const deleteOldFile = (val) => {
  if (!val || val.startsWith('http')) return;
  try {
    const full = path.join(__dirname, '..', val.replace(/\\/g, '/'));
    if (fs.existsSync(full)) fs.unlinkSync(full);
  } catch (e) { /* ignore */ }
};

// GET /api/settings — public: returns { key: value } map
const getAll = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT setting_key, setting_value, setting_type FROM site_settings ORDER BY section, id');
    const out = {};
    rows.forEach(r => {
      out[r.setting_key] = r.setting_type === 'image'
        ? toUrl(req, r.setting_value || '')
        : (r.setting_value || '');
    });
    res.json({ success: true, data: out });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// GET /api/settings/admin — admin: returns full rows with display_value
const getAdmin = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM site_settings ORDER BY section, id');
    const out = rows.map(r => ({
      ...r,
      display_value: r.setting_type === 'image'
        ? toUrl(req, r.setting_value || '')
        : (r.setting_value || ''),
    }));
    res.json({ success: true, data: out });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// PUT /api/settings/batch-update — save multiple text/textarea settings at once
const batchUpdate = async (req, res) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ success: false, message: 'settings object required' });
    }
    for (const [k, v] of Object.entries(settings)) {
      await db.execute('UPDATE site_settings SET setting_value=? WHERE setting_key=?', [v, k]);
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// PUT /api/settings/:key — update a single setting (image upload or text)
const update = async (req, res) => {
  try {
    const { key } = req.params;
    const [rows] = await db.execute('SELECT * FROM site_settings WHERE setting_key=?', [key]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Setting not found' });

    let value = rows[0].setting_value || '';

    if (req.file) {
      // Image upload
      deleteOldFile(value);
      value = req.file.path.replace(/\\/g, '/').replace(/.*\/uploads\//, 'uploads/');
    } else if (req.body.value !== undefined) {
      value = req.body.value;
    }

    await db.execute('UPDATE site_settings SET setting_value=? WHERE setting_key=?', [value, key]);
    const returnVal = rows[0].setting_type === 'image' ? toUrl(req, value) : value;
    res.json({ success: true, key, value: returnVal });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = { getAll, getAdmin, update, batchUpdate };
