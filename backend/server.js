require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

const app = express();
const IS_PROD = process.env.NODE_ENV === 'production';

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5177,http://localhost:5178,http://localhost:5179,http://localhost:5180,http://localhost:5181,http://localhost:5182')
  .split(',').map(s => s.trim());

// Debug: Log all incoming origins
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path} - Origin: "${req.headers.origin || 'no-origin'}"`);
  next();
});

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (Postman, curl, same-origin in prod)
    if (!origin) {
      return callback(null, true);
    }
    // Check if origin is in whitelist or is an ngrok domain
    if (allowedOrigins.includes(origin) || origin.includes('.ngrok-free.dev') || origin.includes('.ngrok.io')) {
      console.log(`✅ CORS allowed: ${origin}`);
      return callback(null, true);
    }
    console.log(`❌ CORS blocked: ${origin}`);
    callback(new Error('CORS not allowed: ' + origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
}));

// ── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/products',      require('./routes/products'));
app.use('/api/news',          require('./routes/news'));
app.use('/api/reviews',       require('./routes/reviews'));
app.use('/api/certificates',  require('./routes/certificates'));
app.use('/api/board-members', require('./routes/boardMembers'));
app.use('/api/banners',       require('./routes/banners'));
app.use('/api/settings',      require('./routes/settings'));
app.use('/api/products-home-images', require('./routes/productsHome'));

// Initialize database endpoint (for dev setup)
app.post('/api/init', async (req, res) => {
  try {
    const { execSync } = require('child_process');
    console.log('🔧 Initializing database...');
    execSync('node init-db.js', { cwd: __dirname, stdio: 'inherit' });
    res.json({ success: true, message: 'Database initialized' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database init failed: ' + error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', db: 'MySQL', env: process.env.NODE_ENV || 'development' });
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
  console.error(err.stack);
  if (err.message?.includes('CORS')) return res.status(403).json({ success: false, message: err.message });
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`✅ PSU Agro Food API on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  console.log(`📁 MySQL: ${process.env.DB_NAME || 'psu_agro_food'} @ ${process.env.DB_HOST || 'localhost'}`);
});
