# Database Documentation

## Overview

The PSU Agro Food application uses **MySQL** as its primary database. The database schema is designed to support a content management system for managing products, team members, certificates, and site settings.

## Database Credentials

Default credentials during development:
- **Host**: localhost
- **Port**: 3306
- **Database Name**: psu_agro_food
- **User**: root
- **Password**: (set in .env file)

## Tables

### 1. `admins` - Administrator Accounts
Stores admin user credentials for dashboard access.

```sql
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,              -- bcrypt hashed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Sample Data:**
| username | password_default | notes |
|----------|------------------|-------|
| admin | admin123 | Default admin user |

---

### 2. `products` - Product Listing
Stores all product information with multilingual support.

```sql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(300) NOT NULL,                  -- Thai name
  name_en VARCHAR(300),                        -- English name
  name_zh VARCHAR(300),                        -- Chinese name
  name_ms VARCHAR(300),                        -- Malay name
  name_ar VARCHAR(300),                        -- Arabic name
  category VARCHAR(50) DEFAULT 'psu_blen',     -- psu_blen, meal_box, oem
  description TEXT,                            -- Thai description
  description_en TEXT,                         -- English description
  description_zh TEXT,                         -- Chinese description
  description_ms TEXT,                         -- Malay description
  description_ar TEXT,                         -- Arabic description
  ingredients TEXT,                            -- Comma-separated
  weight VARCHAR(100),                         -- e.g., "350g"
  image VARCHAR(500),                          -- Path to image
  is_active BOOLEAN DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Categories:**
- `psu_blen` - PSU Blenderized Diet products
- `meal_box` - Ready-to-eat meal box products
- `oem` - OEM/Custom manufacturing services

**Sample Products:**
- PSU Blen 350g (ID: 1)
- PSU Blen 200g (ID: 2)
- PSU Blen 150g (ID: 3)
- Chicken Massaman with Rice (ID: 4)
- Stir-Fried Garlic Chicken (ID: 5)
- Stir-Fried Spicy Catfish (ID: 6)
- Sour Curry Mackerel (ID: 7)
- OEM Blenderized Diet Type A (ID: 8)
- OEM Blenderized Diet Type B (ID: 9)
- OEM Meal Box Type A (ID: 10)
- OEM Meal Box Type B (ID: 11)

---

### 3. `certificates` - Certifications & Awards
Stores company certifications and official documents.

```sql
CREATE TABLE certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(300) NOT NULL,                 -- Certificate name
  image VARCHAR(500),                          -- Path to certificate image
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Sample Certificates:**
1. หนังสือให้ใช้เครื่องหมายรับรองฮาลาล (Halal Certification Certificate)
2. ใบอนุญาตผลิตอาหาร (Food Production License)
3. ใบสำคัญการจดทะเบียนอาหาร (Food Registration Certificate)

---

### 4. `board_members` - Team & Management
Stores information about board directors and management staff.

```sql
CREATE TABLE board_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(300) NOT NULL,                  -- Full name
  position VARCHAR(300),                       -- Job title
  section VARCHAR(50) DEFAULT 'board',         -- board, management
  sort_order INT DEFAULT 0,
  image VARCHAR(500),                          -- Profile image path
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Sections:**
- `board` - Board of Directors (4 members)
- `management` - Management Team (4 members)

---

### 5. `news` - Blog/News Posts
Stores news articles and blog posts with publishing control.

```sql
CREATE TABLE news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,                 -- Article title
  description TEXT,                            -- Short summary
  content LONGTEXT,                            -- Full article content
  image VARCHAR(500),                          -- Featured image
  is_published BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

### 6. `reviews` - Customer Reviews
Stores customer testimonials and reviews.

```sql
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,                 -- Review title/name
  description TEXT,                            -- Review content
  image VARCHAR(500),                          -- Reviewer image/avatar
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

### 7. `banners` - Website Banners
Stores promotional banners for website display.

```sql
CREATE TABLE banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(300),                          -- Banner title
  subtitle TEXT,                               -- Banner subtitle
  image VARCHAR(500),                          -- Banner image
  link_url VARCHAR(500),                       -- URL to link to
  is_active BOOLEAN DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

### 8. `site_settings` - Configuration & Content
Stores all configurable settings, including editable images and text content.

```sql
CREATE TABLE site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,    -- Setting identifier
  setting_value TEXT,                          -- Setting value
  setting_type VARCHAR(50) DEFAULT 'text',     -- text, image, number, etc
  section VARCHAR(100),                        -- General section grouping
  display_value TEXT,                          -- Alternative display value
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Current Settings:**

| setting_key | type | section | value |
|------------|------|---------|-------|
| timeline_item1_image | image | timeline | uploads/products/timeline-2567.png |
| timeline_item2_image | image | timeline | uploads/products/timeline-2568.png |
| timeline_item3_image | image | timeline | uploads/products/timeline-present.png |
| core_value1_image | image | core_values | uploads/products/core-value-1.png |
| core_value2_image | image | core_values | uploads/products/core-value-2.png |
| core_value3_image | image | core_values | uploads/products/core-value-3.png |
| core_value4_image | image | core_values | uploads/products/core-value-4.png |
| oem_image | image | oem | uploads/products/oem-banner.png |
| site_title | text | general | PSU Agro Food |
| site_tagline | text | general | Food Innovation for Better Health |

---

## Relationships

```
Product
  ├── category → Category list (enumerated)
  └── image → Image file in uploads/products/

Board Member
  ├── section → section list (board, management)
  └── image → Profile image

Site Settings
  ├── type → Setting type (text, image, number)
  └── section → Settings grouping

Certificates, Reviews, News, Banners
  └── image → Respective image files
```

## Image Storage

All images are stored in: **`/backend/uploads/products/`**

**Image Path Format:**
```
uploads/products/[filename].png
```

**Examples:**
- `uploads/products/psu-blen-350g.png`
- `uploads/products/timeline-2567.png`
- `uploads/products/core-value-1.png`
- `uploads/products/certificate-1.png`

## Data Types

| Type | Used In | Default | Max Length |
|------|---------|---------|-----------|
| INT | IDs, Sort Order, Counts | 0 | 2,147,483,647 |
| VARCHAR | Names, Titles, Paths | NULL | 300-500 |
| TEXT | Descriptions, Content | NULL | 65,535 chars |
| LONGTEXT | Full content | NULL | 4GB |
| BOOLEAN | Flags (active, published) | 0 (false) | true/false |
| TIMESTAMP | Date tracking | CURRENT_TIMESTAMP | auto-managed |

## Encoding

All tables use UTF-8 encoding to support multilingual content:
```sql
CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
```

This supports:
- Thai characters
- English letters
- Chinese characters
- Arabic characters
- Standard Unicode emoji

## Backup & Restore

### Backup Database
```bash
mysqldump -u root -p psu_agro_food > backup.sql
```

### Restore Database
```bash
mysql -u root -p psu_agro_food < backup.sql
```

### Backup Specific Table
```bash
mysqldump -u root -p psu_agro_food products > products_backup.sql
```

## Performance Considerations

1. **Indexes**: Existing indexes on PRIMARY KEY and UNIQUE constraints
2. **Full-text Search**: Not currently enabled (can be added to news, products)
3. **Pagination**: Always use LIMIT in queries for large datasets
4. **Image Storage**: Consider CDN for production (images currently served from backend)

## Query Examples

### Get All Active Products
```sql
SELECT * FROM products WHERE is_active = 1 ORDER BY sort_order;
```

### Get Board Members by Section
```sql
SELECT * FROM board_members WHERE section = 'board' ORDER BY sort_order;
```

### Get All Image Settings
```sql
SELECT * FROM site_settings WHERE setting_type = 'image' ORDER BY section;
```

### Count Products by Category
```sql
SELECT category, COUNT(*) as count FROM products GROUP BY category;
```

### Get Recent News
```sql
SELECT * FROM news WHERE is_published = 1 ORDER BY created_at DESC LIMIT 10;
```

## Security Notes

1. **Passwords**: Admin passwords are bcrypt hashed
2. **SQL Injection**: Always use parameterized queries (prepared statements)
3. **File Upload**: Only image files are allowed via upload middleware
4. **CORS**: Configured to allow frontend requests only
5. **JWT**: API authentication via JWT tokens

## Maintenance

### Check Database Size
```sql
SELECT table_name, ROUND(((data_length + index_length) / 1024 / 1024), 1) as size_mb 
FROM information_schema.tables 
WHERE table_schema = 'psu_agro_food';
```

### Optimize Tables
```bash
mysqlcheck -u root -p --optimize psu_agro_food
```

### View Table Structure
```sql
DESCRIBE table_name;
SHOW CREATE TABLE table_name;
```

## Common Queries

### Search Products
```javascript
// From API - /api/products/search?q=PSU
const query = `SELECT * FROM products 
               WHERE name LIKE ? OR description LIKE ? 
               ORDER BY sort_order`;
```

### Get Settings by Section
```javascript
const settings = await connection.execute(
  `SELECT * FROM site_settings WHERE section = ? ORDER BY setting_key`,
  [section]
);
```

### Check Admin Credentials
```javascript
const [admin] = await connection.execute(
  `SELECT password FROM admins WHERE username = ?`,
  [username]
);
// Then verify with bcrypt.compare(password, admin[0].password)
```

## Migration Guide

If you need to modify the schema:

1. **Add Column**:
```sql
ALTER TABLE products ADD COLUMN price DECIMAL(10,2) DEFAULT 0;
```

2. **Rename Column**:
```sql
ALTER TABLE products CHANGE COLUMN old_name new_name VARCHAR(300);
```

3. **Add Index**:
```sql
ALTER TABLE products ADD INDEX idx_category (category);
```

4. **Drop Column**:
```sql
ALTER TABLE products DROP COLUMN price;
```

## Troubleshooting

### Table Doesn't Exist
```bash
# Reinitialize database
node setup-database.js
```

### Can't Connect to Database
```bash
# Check if MySQL is running
mysql -u root -p

# Check connection credentials in .env
cat .env
```

### Corrupted Data
```bash
# Check table integrity
mysqlcheck -u root -p psu_agro_food

# Repair if needed
mysqlcheck -u root -p --repair psu_agro_food
```

## Support

For database-related issues:
1. Check error messages in backend console
2. Review this documentation
3. Check MySQL logs
4. Create database export for analysis

**Happy database management! 📊**
