const express = require('express');
const db = require('../models/db');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get carousel images for a section
router.get('/:section', (req, res) => {
  const { section } = req.params;
  
  db.query(
    'SELECT id, section, image_path, sort_order, created_at FROM carousel_images WHERE section = ? ORDER BY sort_order ASC, created_at ASC',
    [section],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', err });
      res.json({ data: results });
    }
  );
});

// Add image to carousel
router.post('/:section/add', authMiddleware, upload.single('image'), (req, res) => {
  const { section } = req.params;
  
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  const imagePath = `/uploads/${req.file.filename}`;

  db.query(
    'INSERT INTO carousel_images (section, image_path, sort_order) VALUES (?, ?, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM carousel_images WHERE section = ?))',
    [section, imagePath, section],
    (err, result) => {
      if (err) {
        // Clean up uploaded file if DB insert fails
        if (req.file) fs.unlink(path.join(__dirname, '../', req.file.path), () => {});
        return res.status(500).json({ message: 'Failed to add carousel image', err });
      }
      res.json({ message: 'Image added successfully', id: result.insertId, imagePath });
    }
  );
});

// Delete carousel image
router.delete('/:imageId', authMiddleware, (req, res) => {
  const { imageId } = req.params;

  // First, get the image path
  db.query(
    'SELECT image_path FROM carousel_images WHERE id = ?',
    [imageId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', err });
      if (results.length === 0) {
        return res.status(404).json({ message: 'Image not found' });
      }

      const imagePath = results[0].image_path;

      // Delete from database
      db.query(
        'DELETE FROM carousel_images WHERE id = ?',
        [imageId],
        (err) => {
          if (err) return res.status(500).json({ message: 'Failed to delete image', err });

          // Delete physical file
          const filePath = path.join(__dirname, '../', 'public', imagePath);
          fs.unlink(filePath, () => {
            // Ignore file deletion errors
          });

          res.json({ message: 'Image deleted successfully' });
        }
      );
    }
  );
});

// Update sort order for all carousel images in a section
router.put('/:section/reorder', authMiddleware, (req, res) => {
  const { section } = req.params;
  const { imageIds } = req.body;

  if (!Array.isArray(imageIds) || imageIds.length === 0) {
    return res.status(400).json({ message: 'Invalid imageIds array' });
  }

  let completed = 0;
  let hasError = false;

  imageIds.forEach((id, index) => {
    db.query(
      'UPDATE carousel_images SET sort_order = ? WHERE id = ? AND section = ?',
      [index, id, section],
      (err) => {
        if (err) hasError = true;
        completed++;

        if (completed === imageIds.length) {
          if (hasError) {
            return res.status(500).json({ message: 'Failed to update sort order' });
          }
          res.json({ message: 'Sort order updated successfully' });
        }
      }
    );
  });
});

module.exports = router;
