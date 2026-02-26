# Product Showcase and Meal Box Image Configuration

## Overview
The PSU Blen Showcase and Meal Box sections on the Products page have been converted from hardcoded emoji (🥛, 🍱) to **admin-editable images** stored in the database.

## Features
✅ **Admin-Editable**: Upload custom images via the AdminSettings panel
✅ **Database-Driven**: Images stored in `site_settings` table  
✅ **Fallback Support**: Shows emoji if no image is configured
✅ **Two-Location Display**: Shows in hero banner and product group headers

## Database Settings

### Showcase Image (PSU Blen)
- **Key**: `showcase_image`
- **Section**: `showcase`
- **Type**: `image`
- **Label**: `รูปภาพ Showcase` (Showcase Image)
- **Default**: Empty (displays 🥛 emoji)

### Meal Box Image
- **Key**: `mealbox_image`
- **Section**: `mealbox`
- **Type**: `image`
- **Label**: `รูปอาหารกล่อง` (Meal Box Image)
- **Default**: Empty (displays 🍱 emoji)

## How to Upload Images

### Step 1: Access Admin Panel
Navigate to: `http://localhost:5177/admin` or `http://yoursite.com/admin`

### Step 2: Go to Settings
Click on the ⚙️ **Settings** tab in the admin layout

### Step 3: Upload Showcase Image
1. Click **🥛 PSU Blen Showcase** in the left sidebar
2. In the "รูปภาพ Showcase" field, click **📷 เลือกรูปภาพ** (Select Image)
3. Choose an image file from your computer
4. You'll see ✓ marked as "เลือกรูปแล้ว" (Image Selected)

### Step 4: Upload Meal Box Image
1. Click **🍱 อาหารกล่อง** in the left sidebar
2. In the "รูปอาหารกล่อง" field, click **📷 เลือกรูปภาพ**
3. Choose an image file
4. Confirm selection with the checkmark

### Step 5: Save Changes
Click **💾 บันทึกทั้งหมด** (Save All) at the top right

## Image Display Behavior

### Hero Banner
Shows small images (24px height) next to product category labels:
```
[Image] อาหารปั่นเหลวพร้อมทาน
[Image] อาหารกล่องพร้อมทาน  
🏭 บริการ OEM สินค้าครบวงจร
```

### Product Group Headers
Shows larger images (100% width/height with object-fit contain) as section icons:
- Left side of PSU Blen group header
- Left side of Meal Box group header

## Code Implementation

### Frontend Changes (ProductsPage.jsx)
```jsx
// Hero banner - 24px height
{get('showcase_image') ? <img src={getImageUrl(get('showcase_image'))} alt="PSU Blen" style={{height:'24px',width:'auto'}} /> : '🥛'}

// Product group header - Full container sizing
{get('showcase_image') ? <img src={getImageUrl(get('showcase_image'))} alt="PSU Blen" style={{width:'100%',height:'100%',objectFit:'contain'}} /> : '🥛'}
```

### Backend Support
- Settings API: `/api/settings` (GET public settings)
- Admin Settings: `/api/settings/admin` (GET all for form)
- Image Upload: `PUT /api/settings/{key}` (multipart/form-data)
- Batch Update: `PUT /api/settings/batch-update` (text fields)

### Database Setup
Images are stored in:
```
Table: site_settings
Columns:
  - setting_key: 'showcase_image' or 'mealbox_image'
  - setting_value: Path to uploaded image (e.g., '/uploads/settings/showcase-image-123.jpg')
  - setting_type: 'image'
  - section: 'showcase' or 'mealbox'
  - label: Thai display name
```

## Testing Checklist

- [ ] Backend (port 5000) is running
- [ ] Frontend (port 5177) is running  
- [ ] Database is populated with `populate-all-settings.js`
- [ ] Navigate to `/products` page
  - [ ] Hero banner shows emoji (default state)
  - [ ] PSU Blen group header shows emoji (default state)
  - [ ] Meal Box group header shows emoji (default state)
- [ ] Access `/admin` → Settings
  - [ ] "🥛 PSU Blen Showcase" section appears in sidebar
  - [ ] "🍱 อาหารกล่อง" section appears in sidebar
  - [ ] Can select "รูปภาพ Showcase" image file
  - [ ] Can select "รูปอาหารกล่อง" image file
- [ ] Upload test images and save
  - [ ] Images display in admin preview
  - [ ] ProductsPage shows uploaded images
  - [ ] Fallback to emoji works if images removed

## File Structure

```
├── backend/
│   ├── populate-all-settings.js  (Contains showcase_image & mealbox_image definitions)
│   └── routes/settings.js         (Image upload and batch update endpoints)
├── frontend/
│   ├── src/pages/public/ProductsPage.jsx  (Modified to use settings)
│   ├── src/pages/admin/AdminSettings.jsx  (Image upload UI already exists)
│   ├── src/hooks/useSettings.js   (Global settings cache)
│   └── src/utils/api.js           (getImageUrl helper function)
└── database/
    └── site_settings table with showcase_image & mealbox_image settings
```

## Troubleshooting

### Images Not Showing in Admin
1. Check database has settings: `SELECT * FROM site_settings WHERE section IN ('showcase', 'mealbox')`
2. Verify AdminSettings.jsx has these sections in SECTIONS array
3. Check useSettings hook is working: `/api/settings` should return data

### Images Not Displaying on Products Page
1. Check browser console for JavaScript errors
2. Verify API response: `curl http://localhost:5000/api/settings`
3. Check getImageUrl() function in utils/api.js
4. Verify images are actually uploaded: Check `/backend/uploads/settings/` folder

### Upload Fails in Admin
1. Check backend is running on port 5000
2. Check `/backend/uploads/settings/` folder exists and is writable
3. Check HTTP response: Network tab → PUT /api/settings/{key}
4. Verify file size is reasonable (< 10MB)

## Next Steps

- Configure recommended image sizes for display
- Add image cropping/resize utility
- Set up CDN for image serving (production)
- Add image compression to reduce file size
- Create thumbnail generator for admin previews

## Related Documentation
- [Database Setup](.DATABASE_SETUP_SUMMARY.md)
- [Admin Panel Guide](./README.md#admin-panel)
- [Settings Architecture](.SETUP.md)
