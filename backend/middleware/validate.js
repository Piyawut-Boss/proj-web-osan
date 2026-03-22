// Route parameter validation & role-based access control middleware

// Validate that :id param is a positive integer
const validateId = (req, res, next) => {
  const id = req.params.id || req.params.imageId;
  if (!id || !/^\d+$/.test(id)) {
    return res.status(400).json({ success: false, message: 'Invalid ID' });
  }
  next();
};

// Require admin role (must come after authenticateToken)
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

module.exports = { validateId, requireAdmin };
