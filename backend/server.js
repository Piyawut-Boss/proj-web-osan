require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const fs         = require('fs');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const hpp        = require('hpp');

const app = express();
const IS_PROD = process.env.NODE_ENV === 'production';

// ── Security headers (helmet) ────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow images to load cross-origin
  contentSecurityPolicy: false, // CSP handled by frontend meta or reverse proxy
}));

// ── HTTP Parameter Pollution protection ──────────────────────────────────────
app.use(hpp());

// ── Global rate limiter ──────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,                  // 300 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use(globalLimiter);

// ── Strict rate limiter for auth endpoints ───────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,                   // 15 login attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again later.' },
});

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5177,http://localhost:5178,http://localhost:5179,http://localhost:5180,http://localhost:5181,http://localhost:5182')
  .split(',').map(s => s.trim());

app.use(cors({
  origin: function(origin, callback) {
    // Allow same-origin requests (no origin header)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    // In development, allow any localhost port
    if (!IS_PROD && origin.startsWith('http://localhost:')) return callback(null, true);

    callback(new Error('CORS not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
}));

// ── Body parsers (with size limits) ──────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ── Input sanitization ──────────────────────────────────────────────────────
const { sanitizeInput } = require('./middleware/sanitize');
app.use(sanitizeInput);

// ── Static files ──────────────────────────────────────────────────────────────
// Uploaded images (products, news, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// In production: serve the built React app
if (IS_PROD) {
  const distPath = path.join(__dirname, '..', 'frontend', 'dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    console.log('📦 Serving frontend dist from', distPath);
  }
}

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/products',      require('./routes/products'));
app.use('/api/news',          require('./routes/news'));
app.use('/api/reviews',       require('./routes/reviews'));
app.use('/api/certificates',  require('./routes/certificates'));
app.use('/api/board-members', require('./routes/boardMembers'));
app.use('/api/banners',       require('./routes/banners'));
app.use('/api/carousel',      require('./routes/carousel'));
app.use('/api/settings',      require('./routes/settings'));
app.use('/api/products-home-images', require('./routes/productsHome'));

// /api/init removed for security — run `node init-db.js` manually instead

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// ── SPA fallback (production only) ──────────────────────────────────────────
if (IS_PROD) {
  const distPath = path.join(__dirname, '..', 'frontend', 'dist');
  app.get('*', (req, res) => {
    const idx = path.join(distPath, 'index.html');
    if (fs.existsSync(idx)) res.sendFile(idx);
    else res.status(404).send('Frontend not built. Run: cd frontend && npm run build');
  });
}

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  
  if (err.message?.includes('CORS')) {
    return res.status(403).json({ success: false, message: 'Origin not allowed' });
  }
  
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`✅ PSU Agro Food API on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  console.log(`📁 MySQL: ${process.env.DB_NAME || 'psu_agro_food'} @ ${process.env.DB_HOST || 'localhost'}`);
});
