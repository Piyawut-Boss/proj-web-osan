const express = require('express');
const db = require('../models/db');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');
const { validateId } = require('../middleware/validate');

const router = express.Router();

// Valid carousel sections whitelist
const VALID_SECTIONS = ['hero', 'about', 'products', 'news', 'home', 'banner'];

// Get carousel images for a section
router.get('/:section', async (req, res) => {
  try {
    const { section } = req.params;
    if (!VALID_SECTIONS.includes(section)) {
      return res.status(400).json({ message: 'Invalid section' });
    }
    const [images] = await db.execute(
      'SELECT id, section, image_path, sort_order, created_at FROM carousel_images WHERE section = ? ORDER BY sort_order ASC, created_at ASC',
      [section]
    );
    res.json({ data: images || [] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch carousel images' });
  }
});

// Add image to carousel
router.post('/:section/add', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { section } = req.params;
    if (!VALID_SECTIONS.includes(section)) {
      return res.status(400).json({ message: 'Invalid section' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    // Get next sort order
    const [maxSortResult] = await db.execute(
      'SELECT COALESCE(MAX(sort_order), 0) + 1 as next_order FROM carousel_images WHERE section = ?',
      [section]
    );
    const nextOrder = maxSortResult[0]?.next_order || 1;

    // Insert carousel image
    const [result] = await db.execute(
      'INSERT INTO carousel_images (section, image_path, sort_order) VALUES (?, ?, ?)',
      [section, imagePath, nextOrder]
    );

    res.json({ message: 'Image added successfully', id: result.insertId, imagePath });
  } catch (err) {
    // Clean up uploaded file if DB insert fails
    if (req.file) {
      fs.unlink(path.join(__dirname, '../uploads', req.file.filename), () => {});
    }
    res.status(500).json({ message: 'Failed to add carousel image' });
  }
});

// Delete carousel image
router.delete('/:imageId', authenticateToken, validateId, async (req, res) => {
  try {
    const { imageId } = req.params;

    // Get the image path
    const [results] = await db.execute(
      'SELECT image_path FROM carousel_images WHERE id = ?',
      [imageId]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const imagePath = results[0].image_path;

    // Delete from database
    await db.execute(
      'DELETE FROM carousel_images WHERE id = ?',
      [imageId]
    );

    // Delete physical file (safe: verify within uploads/)
    const uploadsDir = path.resolve(__dirname, '..');
    const filePath = path.resolve(__dirname, '..', imagePath.replace(/\\/g, '/'));
    if (filePath.startsWith(path.join(uploadsDir, 'uploads'))) {
      fs.unlink(filePath, () => {});
    }

    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete image' });
  }
});

// Update sort order for all carousel images in a section
router.put('/:section/reorder', authenticateToken, async (req, res) => {
  try {
    const { section } = req.params;
    const { imageIds } = req.body;

    if (!Array.isArray(imageIds) || imageIds.length === 0 || imageIds.length > 100) {
      return res.status(400).json({ message: 'Invalid imageIds array' });
    }
    if (!imageIds.every(id => Number.isInteger(id) && id > 0)) {
      return res.status(400).json({ message: 'All imageIds must be positive integers' });
    }
    if (!VALID_SECTIONS.includes(section)) {
      return res.status(400).json({ message: 'Invalid section' });
    }

    // Update sort order for all images
    for (let i = 0; i < imageIds.length; i++) {
      await db.execute(
        'UPDATE carousel_images SET sort_order = ? WHERE id = ? AND section = ?',
        [i, imageIds[i], section]
      );
    }

    res.json({ message: 'Sort order updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update sort order' });
  }
});

module.exports = router;
