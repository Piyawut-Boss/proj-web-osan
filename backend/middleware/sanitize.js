// Input sanitization middleware — strips dangerous HTML/script tags from string fields
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      clean[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      clean[key] = value.map(v => typeof v === 'string' ? sanitizeString(v) : v);
    } else {
      clean[key] = value;
    }
  }
  return clean;
};

const sanitizeInput = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }
  next();
};

module.exports = { sanitizeInput };
