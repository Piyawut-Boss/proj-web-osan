# — Full-Stack Website

React + Express + **SQLite** (no database server required).

---

## ⚡ Quick Start (Development)

```bash
# Terminal 1 — Backend
cd backend
npm install        # Automatically initializes database if missing
npm run dev       # http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev       # http://localhost:5173
```

**Admin:** `http://localhost:5173/admin/login` → credentials in `.env` or set during setup

**Note:** Database is auto-initialized on first `npm install`. If needed manually:
```bash
cd backend
npm run init-db
```

---

## 🚀 Production Deployment

### Option A — Single Server (Node serves everything)

```bash
# 1. Build frontend
cd frontend && npm install && npm run build

# 2. Configure backend
cd ../backend
cp .env.example .env
# Edit .env:
#   NODE_ENV=production
#   JWT_SECRET=<long random string>
#   FRONTEND_URL=https://yourdomain.com

# 3. Install and start
npm install --production
npm start
# Server runs on port 5000, serves React app + API
```

### Option B — Nginx Reverse Proxy (Recommended)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Serve uploaded images
    location /uploads/ {
        alias /path/to/project/backend/uploads/;
    }

    # Proxy API and everything else to Node
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Option C — PM2 Process Manager

```bash
npm install -g pm2
cd backend
pm2 start server.js --name "psu-agro-food" --env production
pm2 save
pm2 startup
```

---

## 📁 Project Structure

```
psu-agro-food/
├── backend/
│   ├── controllers/        # Business logic
│   │   ├── authController.js
│   │   ├── mainController.js    # All CRUD
│   │   └── settingsController.js
│   ├── middleware/
│   │   ├── auth.js         # JWT verification
│   │   └── upload.js       # Multer image upload (10MB limit)
│   ├── models/db.js        # SQLite wrapper (async-compatible)
│   ├── routes/             # Express routes (8 modules)
│   ├── uploads/            # Saved images (auto-created)
│   ├── init-db.js          # Schema + seed data
│   ├── server.js           # Entry point
│   ├── database.sqlite     # SQLite file (auto-created)
│   ├── .env                # Your config (don't commit!)
│   └── .env.example        # Template
├── frontend/
│   ├── public/
│   │   ├── logo.jpg        # Company logo (used everywhere)
│   │   ├── hero-banner.png # Default home banner
│   │   └── favicon.svg
│   └── src/
│       ├── pages/public/   # 8 public pages
│       ├── pages/admin/    # 8 admin CMS pages
│       ├── components/     # Navbar, Footer, AdminLayout, etc.
│       ├── context/        # AuthContext
│       ├── hooks/          # useSettings (cached)
│       └── utils/api.js    # Axios with JWT interceptor
├── .gitignore
└── README.md
```

---

## 🔑 Admin Panel (`/admin/login`)

| Page | URL | Features |
|------|-----|----------|
| Dashboard | /admin | Stats, recent news |
| สินค้า | /admin/products | CRUD + image upload, active toggle |
| ข่าวสาร | /admin/news | CRUD + image, publish toggle |
| รีวิว | /admin/reviews | CRUD + image |
| ใบรับรอง | /admin/certificates | CRUD + image, sort order |
| คณะกรรมการ | /admin/board-members | CRUD + image, board/mgmt type |
| แบนเนอร์ | /admin/banners | CRUD + image, active toggle, sort |
| **ตั้งค่า** | **/admin/settings** | **Edit ALL page text & images** |

---

## 🖼️ Image Upload System

- **Accepted formats:** JPEG, JPG, PNG, GIF, WebP
- **Max file size:** 10 MB
- **Storage:** `backend/uploads/{category}/timestamp-random.ext`
- **URL pattern:** `http://host/uploads/products/xxx.jpg`
- **Old images:** automatically deleted on update/delete

---

## ⚙️ Environment Variables (`.env`)

```env
PORT=5000
NODE_ENV=development        # 'production' in prod
DB_PATH=./database.sqlite
JWT_SECRET=CHANGE_THIS_IN_PRODUCTION_MIN_32_CHARS
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
# Production: FRONTEND_URL=https://yourdomain.com
```

---

## 🗄️ SQLite Notes

- **No installation** — SQLite is file-based, works everywhere
- **Auto-created** on first server start
- **Backup:** copy `backend/database.sqlite`
- **Reset:** delete `database.sqlite`, restart server → fresh seed data
- **Default login:** `psuadmin` (change password after first login!)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, React Router v6 |
| Backend | Node.js, Express 4 |
| Database | SQLite (better-sqlite3) |
| Auth | JWT + bcrypt |
| Upload | Multer (disk storage) |
| Styling | CSS Modules + Google Fonts (Noto Sans Thai) |

---

## 🔒 Security Checklist for Production

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Change admin password after first login
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS (SSL certificate)
- [ ] Set `FRONTEND_URL` to your actual domain
- [ ] Set up regular SQLite backup (`database.sqlite`)
- [ ] Configure firewall (only expose port 80/443)
