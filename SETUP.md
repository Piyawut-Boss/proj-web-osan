# PSU Agro Food - Project Setup Guide

This guide will help you set up the PSU Agro Food project on your local machine.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v5.7 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)
- **Git** - [Download](https://git-scm.com/)

### MySQL Installation

**Windows:**
1. Download MySQL from the official website
2. Run the installer and choose "Developer Default" setup
3. Follow the configuration wizard
4. Remember the root password you set (default is often blank or `root`)

**macOS (using Homebrew):**
```bash
brew install mysql
brew services start mysql
```

**Linux:**
```bash
sudo apt-get install mysql-server
sudo systemctl start mysql
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <YOUR_REPO_URL>
cd proj-web-osan-main
```

### 2. Configure Environment Variables

#### Backend Configuration

1. Navigate to the backend folder:
```bash
cd backend
```

2. Copy the example environment file:
```bash
cp .env.example .env
```

3. Edit `.env` with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=psu_agro_food
DB_PORT=3306
PORT=5000
JWT_SECRET=your_secret_key_change_in_production
FRONTEND_URL=http://localhost:5173
```

### 3. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 4. Initialize Database

From the backend folder, run the database setup script:

```bash
node setup-database.js
```

This script will:
- ✅ Create the MySQL database (`psu_agro_food`)
- ✅ Create all necessary tables (products, users, settings, etc.)
- ✅ Initialize seed data (admin user, sample products, etc.)
- ✅ Set up site settings and image paths
- ✅ Generate placeholder images (if optional dependencies are available)

**Expected Output:**
```
╔════════════════════════════════════════════════════════════════╗
║          PSU Agro Food - Database Setup Initialization         ║
╚════════════════════════════════════════════════════════════════╝

📁 Step 1: Creating uploads directory...
✅ Uploads directory created: D:\...\backend\uploads\products

🔌 Step 2: Connecting to MySQL server...
   Host: localhost:3306
   User: root
✅ Connected to MySQL successfully

🗄️  Step 3: Setting up database...
✅ Database created/verified: psu_agro_food

📊 Step 4: Creating database tables...
   ✅ admins
   ✅ banners
   ✅ products
   ✅ news
   ✅ reviews
   ✅ certificates
   ✅ board_members
   ✅ site_settings

[... more output ...]

╔════════════════════════════════════════════════════════════════╗
║                  ✅ SETUP COMPLETED SUCCESSFULLY              ║
╚════════════════════════════════════════════════════════════════╝

📝 Next steps:
   1. npm install (if not done)
   2. npm run dev (to start the server)
```

### 5. Start the Development Servers

**Terminal 1 - Start Backend Server:**
```bash
cd backend
npm run dev
```

Expected output:
```
✅ MySQL connected
🚀 Server running on http://localhost:5000
```

**Terminal 2 - Start Frontend Server:**
```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v... ready in ... ms

➜  Local:   http://localhost:5173/
```

### 6. Access the Application

- **Frontend**: http://localhost:5173/
- **Backend API**: http://localhost:5000/api/
- **Admin Dashboard**: http://localhost:5173/admin
  - Username: `admin`
  - Password: `admin123`

## Troubleshooting

### MySQL Connection Error

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solution:**
1. Ensure MySQL service is running:
   - **Windows**: Open Services and restart MySQL96
   - **macOS**: `brew services start mysql`
   - **Linux**: `sudo systemctl start mysql`

2. Verify credentials in `.env` file match your MySQL setup

3. Check MySQL is accessible:
   ```bash
   mysql -u root -p
   ```

### Port Already in Use

**Error:** `Error: listen EADDRINUSE :::5000` or `:::5173`

**Solution:**
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

**Windows:**
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force
```

### Database Already Exists

If you want to reset the database:

```bash
# Option 1: Let the setup script handle it (it checks for existing data)
node setup-database.js

# Option 2: Manual reset (back up first!)
mysql -u root -p
> DROP DATABASE psu_agro_food;
> EXIT;

# Then run setup again
node setup-database.js
```

### Missing Dependencies

If you get module not found errors:

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Database Structure

The setup creates the following tables:

| Table | Purpose |
|-------|---------|
| `admins` | Admin users for dashboard access |
| `products` | Product listings (PSU Blen, Meal Box, OEM) |
| `certificates` | Company certificates and awards |
| `board_members` | Board directors and management team |
| `news` | News/blog posts |
| `reviews` | Customer reviews |
| `banners` | Website banners |
| `site_settings` | Configuration and editable content |

### Default Seed Data

The setup initializes:

- **1 Admin User**: username `admin` / password `admin123`
- **11 Products**:
  - 3 PSU Blen products (350g, 200g, 150g)
  - 4 Meal Box products
  - 4 OEM products
- **3 Certificates**: Halal, Food Production License, Food Registration
- **8 Board Members**: 4 board directors + 4 management staff
- **8 Image Settings**: Timeline, core values, OEM images
- **2 General Settings**: Site title and tagline

## File Structure

```
proj-web-osan-main/
├── backend/
│   ├── setup-database.js      ← Run this on first setup
│   ├── init-db.js             ← Alternative initialization
│   ├── .env.example           ← Copy to .env and configure
│   ├── server.js              ← Main server
│   ├── package.json
│   ├── controllers/           ← Business logic
│   ├── models/                ← Database models
│   ├── routes/                ← API routes
│   ├── middleware/            ← Authentication, file upload
│   └── uploads/               ← Product images
│
├── frontend/
│   ├── src/
│   │   ├── pages/             ← Page components
│   │   ├── components/        ← Reusable components
│   │   ├── utils/             ← Helper functions
│   │   └── App.jsx
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## Next Steps

### Admin Dashboard

1. Log in at http://localhost:5173/admin
2. Navigate to different sections:
   - **Products**: Manage PSU Blen, Meal Box, and OEM products
   - **Certificates**: Upload and manage certificates
   - **Board Members**: Manage team information
   - **Settings**: Configure site-wide settings and image uploads
   - **Reviews**: Manage customer reviews
   - **Banners**: Create website banners

### Uploading Images

All product images can be uploaded through the admin dashboard:

1. Go to the respective section (Products, Certificates, etc.)
2. Click edit on an item
3. Upload an image
4. Save changes

Images are stored in `/backend/uploads/products/` and automatically served by the API.

## Development Commands

```bash
# Backend
cd backend
npm run dev          # Start development server with auto-reload
npm test             # Run tests (if configured)

# Frontend
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Production Deployment

For production deployment:

1. Update `.env` with production database credentials
2. Set `NODE_ENV=production` in `.env`
3. Build frontend: `cd frontend && npm run build`
4. Deploy using your preferred hosting (Heroku, DigitalOcean, etc.)

For detailed production deployment instructions, see `DEPLOYMENT.md` (if available).

## Contributing

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Create a Pull Request

## Support

For issues or questions:

1. Check this troubleshooting section first
2. Review the existing GitHub issues
3. Create a new issue with detailed error messages
4. Include your setup details (OS, Node version, MySQL version)

## License

This project is proprietary. All rights reserved.
