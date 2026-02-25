# 🖼️ Image Management Testing Checklist

## Overview
This documents all image upload/edit/remove functionality available in the admin panel and how to test them.

---

## 1. 📦 PRODUCTS (AdminProducts Page)
**Location:** Admin Dashboard → Products Management  
**Total Images:** Multiple product images (PSU Blen, Meal Box, OEM)  
**Database:** `products.image`

### Test Steps:
- [ ] Create new product
  - [ ] Upload image during creation
  - [ ] Verify image displays in thumbnail
  - [ ] Submit and verify image saves to database
  
- [ ] Edit product image
  - [ ] Open existing product for editing
  - [ ] Upload new image
  - [ ] Verify old image is replaced
  - [ ] Save and verify new image displays
  
- [ ] Remove product image
  - [ ] Navigate to product (will have image)
  - [ ] Clear image by uploading blank/no image
  - [ ] Save changes
  - [ ] Verify "ไม่มีรูป" (No image) appears in list

### Expected Behavior:
- Images show in 56x56px thumbnails in table
- Upload form has "📷 เลือกรูปภาพ" button
- Old images are deleted from server when replaced

---

## 2. 🏅 CERTIFICATES (AdminCertificates Page)
**Location:** Admin Dashboard → via index.js  
**Total Images:** 3 (ISO-9001, GMP, HACCP)  
**Database:** `certificates.image`

### Test Steps:
- [ ] Create new certificate
  - [ ] Upload certificate image
  - [ ] Verify preview displays
  
- [ ] Edit certificate
  - [ ] Replace with new image
  - [ ] Verify thumbnail updates
  
- [ ] Delete certificate
  - [ ] Remove entire certificate (may auto-delete image)

### Expected Behavior:
- Same UI pattern as Products
- Images display correctly in table
- Deletion properly cleans up files

---

## 3. 👥 BOARD MEMBERS (AdminBoardMembers Page)
**Location:** Admin Dashboard → Board Members  
**Total Images:** 8 (Chairman, Vice-Chairman, etc.)  
**Database:** `board_members.image`

### Test Steps:
- [ ] Add new board member with image
- [ ] Update board member photo
- [ ] Verify images display in list
- [ ] Delete board member

### Expected Behavior:
- Portrait images upload correctly
- Thumbnails show in table
- Image URL correctly referenced on public site

---

## 4. ⭐ REVIEWS (AdminReviews Page)
**Location:** Admin Dashboard → Reviews  
**Database:** `reviews.image`

### Test Steps:
- [ ] Create review with image
- [ ] Edit review image
- [ ] Delete review
- [ ] Verify image cleanup

---

## 5. 🚩 BANNERS (AdminBanners Page)
**Location:** Admin Dashboard → Banners  
**Database:** `banners.image` (if exists)

### Test Steps:
- [ ] Upload banner image
- [ ] Edit banner
- [ ] Verify on homepage

---

## 6. ⚙️ SITE SETTINGS - Image Fields (AdminSettings Page)
**Location:** Admin → ⚙️ ตั้งค่าเนื้อหาเว็บไซต์  
**Database:** `site_settings` table

### A. 🏭 OEM Section
**Setting Key:** `oem_image`  
**Database Type:** `image`  
**Section:** `oem`

Test Steps:
- [ ] Navigate to Admin Settings → OEM Section
- [ ] Click "📷 เลือกรูปภาพ" button
- [ ] Upload new OEM image
- [ ] Verify preview shows image
- [ ] Click "💾 บันทึกส่วนนี้"
- [ ] Refresh admin page, verify image persists
- [ ] Check frontend - image should display on Products page OEM section

### B. 📅 Timeline Images (NEW)
**Setting Keys:** 
- `timeline_item1_image` (ปี 2567)
- `timeline_item2_image` (ปี 2568)
- `timeline_item3_image` (ปัจจุบัน)

**Database Type:** `image` (converted from text)  
**Section:** `timeline`

Test Steps:
- [ ] Navigate to Admin Settings → Timeline Section
- [ ] For each timeline item:
  - [ ] Click "📷 เลือกรูปภาพ"
  - [ ] Upload new image
  - [ ] See preview updates
- [ ] Click "💾 บันทึกส่วนนี้"
- [ ] Refresh page to verify persistence
- [ ] Check About page - images should display in timeline section
- [ ] Verify images show correctly (colored, not placeholder)

### C. 💎 Core Values Images (NEW)
**Setting Keys:**
- `core_value1_image` (ค่านิยมที่ 1)
- `core_value2_image` (ค่านิยมที่ 2)
- `core_value3_image` (ค่านิยมที่ 3)
- `core_value4_image` (ค่านิยมที่ 4)

**Database Type:** `image` (converted from text)  
**Section:** `core_values`

Test Steps:
- [ ] Navigate to Admin Settings → Core Values Section
- [ ] For each core value:
  - [ ] Upload custom image or keep generated image
  - [ ] Verify preview shows image
- [ ] Click "💾 บันทึกส่วนนี้"
- [ ] Check About page - 4 core value images should display
- [ ] Each should show unique color

### D. Other Image Settings (to verify exist)
Check if these sections exist and have images:
- [ ] 🏠 Hero Banner
- [ ] 🥛 PSU Blen Showcase
- [ ] 🍱 Meal Box
- [ ] 📰 PSU Agro Food Today
- [ ] 🎯 Vision
- [ ] 🤝 Partners (multiple images)
- [ ] 📞 Contact
- [ ] 📋 Footer

---

## 7. ✅ DELETION & CLEANUP TESTING

### Product Image Deletion:
- [ ] Create product with image
- [ ] Verify file exists in `/backend/uploads/products/`
- [ ] Delete the product from admin
- [ ] Verify image file is deleted from server
- [ ] Verify database entry is removed

### Settings Image Deletion:
- [ ] Upload new image to a setting
- [ ] Replace with another image
- [ ] Verify old image file is deleted (via file system check)
- [ ] Check database to ensure path updated

---

## 8. 🔄 BATCH IMAGE TESTING

### Scenario: Upload multiple images simultaneously
- [ ] Go to Admin Settings
- [ ] In Timeline section: Upload images for items 1, 2, 3
- [ ] In Core Values section: Upload images for values 1, 2, 3, 4
- [ ] Click "💾 บันทึกทั้งหมด" (Save All)
- [ ] Verify all images upload without errors
- [ ] Navigate to About page to see all 7 images display

---

## 9. 🧪 EDGE CASES

- [ ] Upload very large image (>10MB) - should handle gracefully
- [ ] Upload non-image file (.txt, .pdf) - should reject or handle error
- [ ] Upload image with special characters in filename - should work
- [ ] Rapid upload same setting multiple times - no race conditions
- [ ] Upload image, then refresh page - verify persistence
- [ ] Delete all images from a section - verify shows "No image" placeholder
- [ ] Upload image to wrong section - should work (settings are global)

---

## 10. 📊 IMAGE STATISTICS

Run these commands to verify image inventory:

```bash
# Count total images
ls -la backend/uploads/products/ | wc -l

# List all images by type
find backend/uploads -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.webp"

# Check database for broken image references
mysql psu_agro_food -e "SELECT * FROM site_settings WHERE setting_type='image' AND setting_value LIKE '%uploads%'"
```

### Expected Images:
- Products: 11 images (3 PSU Blen + 4 Meal Box + 4 OEM)
- Certificates: 3 images
- Board Members: 8 images
- Timeline: 3 images
- Core Values: 4 images
- OEM Hero: 1 image
- Reviews: Variable count
- Banners: Variable count
- Other Settings: Variable count

**Total Generated:** 25+

---

## 11. ✨ FRONTEND VERIFICATION

After uploading images, verify they appear correctly:

### Products Page:
- [ ] PSU Blen products show images
- [ ] Meal Box products show images
- [ ] OEM section shows updated image
- [ ] Click product detail - image displays full size

### About Page:
- [ ] Timeline section shows 3 colored images
- [ ] Core values section shows 4 colored images
- [ ] All images load without broken image icons
- [ ] Images match database settings

### Home Page:
- [ ] Hero banner displays correctly
- [ ] PSU Blen showcase shows product images
- [ ] Meal box section shows meal images

### Admin Pages:
- [ ] All CRUD tables show image thumbnails
- [ ] Modal forms display image previews
- [ ] Image upload inputs are functional

---

## 12. 📝 QUICK TEST SCRIPT

If you want to script this test, use these curl commands:

```bash
# Get all settings
curl http://localhost:5000/api/settings

# Get admin settings with metadata
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/settings/admin

# Upload new image
curl -F "image=@/path/to/image.png" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/settings/oem_image
```

---

## Summary Checklist

**Before testing:**
- [ ] Backend running on localhost:5000
- [ ] Frontend running on localhost:5173
- [ ] MySQL database initialized
- [ ] Logged in to admin panel
- [ ] /backend/uploads/ folder exists and is writable

**After testing all features:**
- [ ] All 8+ site setting images editable
- [ ] All product images upload/edit/delete works
- [ ] All certificate images work
- [ ] Board member images work
- [ ] Review images work
- [ ] Banner images work
- [ ] Old images properly deleted when replaced
- [ ] About page timeline images display
- [ ] About page core values display
- [ ] OEM section image updates properly
- [ ] All images have correct URLs
- [ ] No broken image links on any page
- [ ] Admin settings section shows Timeline and Core Values
- [ ] All changes persist after refresh

---

**Status:** ⏳ Ready for Testing
**Last Updated:** 2026-02-25
**Tester:** [Your Name]
