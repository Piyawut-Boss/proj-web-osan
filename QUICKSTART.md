# Quick Start Guide - 5 Minutes

Get the PSU Agro Food project running in 5 minutes or less.

## Prerequisites ✅

Ensure you have installed:
- **Node.js** (v14+)
- **MySQL** (v5.7+)
- **Git**

## 1️⃣ Clone & Install (1-2 min)

```bash
git clone <YOUR_REPO>
cd proj-web-osan-main

# On Windows:
setup.bat

# On macOS/Linux:
bash setup.sh
```

## 2️⃣ Configure Database (1 min)

**If prompted to edit .env:**

1. Open `backend/.env` in a text editor
2. Update these values:
```env
DB_PASSWORD=your_mysql_root_password
DB_HOST=localhost
```
3. Save the file

## 3️⃣ Start Servers (1-2 min)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Wait for: ✅ MySQL connected & 🚀 Server running
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Wait for: ➜ Local: http://localhost:5173
```

## 4️⃣ Access Application ✨

| URL | Purpose |
|-----|---------|
| http://localhost:5173 | Website |
| http://localhost:5173/admin | Admin Panel |
| Username | psuadmin |
| Password | (see setup output) |

## 🆘 Quick Troubleshooting

### MySQL Connection Error
```bash
# Make sure MySQL is running
# Windows: Open Services and restart MySQL96
# macOS: brew services start mysql
# Linux: sudo systemctl start mysql
```

### Port Already in Use
```bash
# Windows - Kill process on port 5000/5173
Get-Process node | Stop-Process -Force

# macOS/Linux - Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Reset Database
```bash
# Delete existing database and let setup recreate it
mysql -u root -p
> DROP DATABASE psu_agro_food;
> EXIT;

# Run setup again
node backend/setup-database.js
```

## ✅ What Gets Set Up

- ✅ MySQL database with 8 tables
- ✅ Admin user (psuadmin / hashed password)
- ✅ 11 sample products
- ✅ 3 certificates
- ✅ 8 board members
- ✅ Site settings with image paths
- ✅ Image upload directories
- ✅ API routes and server configuration

## 📚 Need More Details?

See `SETUP.md` for:
- Detailed setup instructions
- Complete troubleshooting guide
- Database structure overview
- Development commands
- Production deployment

## 💡 Tips

1. **Keep both terminals running** - Backend on 5000, Frontend on 5173
2. **Auto-reload** - Both servers auto-reload on code changes
3. **Admin default password** - Change it in admin panel after first login
4. **Image uploads** - Images saved to `backend/uploads/products/`
5. **Database** - Data persists between server restarts

## 🚀 Common Tasks

### Add a New Product
1. Go to Admin → Products
2. Click "Add Product"
3. Fill details and upload image
4. Save

### Change Site Settings
1. Go to Admin → Settings
2. Edit any field
3. Click Save for each section

### View Database
```bash
mysql -u root -p psu_agro_food
> SELECT * FROM products;
> SELECT * FROM site_settings;
```

## 📞 Need Help?

1. Check the Troubleshooting section above
2. Review MySQL logs: `mysql -u root -p`
3. Check Node console output for errors
4. Create an issue on GitHub with error details

**Happy coding! 🎉**
