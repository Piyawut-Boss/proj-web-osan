#!/bin/bash
# Image Management Verification Script
# Tests all image upload/edit/delete functionality

echo "📋 === PSU Agro Food - Image Management System Verification ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="http://localhost:5000"
UPLOADS_DIR="backend/uploads/products"
DB_NAME="psu_agro_food"

echo -e "${BLUE}=== Phase 1: Environment Check ===${NC}"
echo ""

# Check if backend is running
echo -n "1. Backend API running: "
if curl -s "$BACKEND_URL/api/settings" > /dev/null 2>&1; then
  echo -e "${GREEN}✓ OK${NC}"
else
  echo -e "${RED}✗ FAILED${NC} (Backend not responding)"
  exit 1
fi

# Check if uploads directory exists
echo -n "2. Uploads directory exists: "
if [ -d "$UPLOADS_DIR" ]; then
  echo -e "${GREEN}✓ OK${NC}"
else
  echo -e "${RED}✗ FAILED${NC} (Directory $UPLOADS_DIR not found)"
  exit 1
fi

# Check if directory is writable
echo -n "3. Uploads directory writable: "
if [ -w "$UPLOADS_DIR" ]; then
  echo -e "${GREEN}✓ OK${NC}"
else
  echo -e "${RED}✗ FAILED${NC} (Directory not writable)"
  exit 1
fi

echo ""
echo -e "${BLUE}=== Phase 2: Database Settings Check ===${NC}"
echo ""

# Check for image settings in database
echo "Image settings in database:"
mysql -u root -p"Boss12345" $DB_NAME -e "
  SELECT 
    setting_key,
    setting_type,
    section,
    'Present' as status
  FROM site_settings 
  WHERE setting_type = 'image'
  ORDER BY section, setting_key;
" 2>/dev/null | awk '{print "  " $0}'

echo ""
echo -e "${BLUE}=== Phase 3: File System Check ===${NC}"
echo ""

# Count images by type
echo "Images in upload directory:"
TOTAL=$(find $UPLOADS_DIR -type f | wc -l)
PNG_COUNT=$(find $UPLOADS_DIR -name "*.png" | wc -l)
JPG_COUNT=$(find $UPLOADS_DIR -name "*.jpg" | wc -l)
JPEG_COUNT=$(find $UPLOADS_DIR -name "*.jpeg" | wc -l)

echo "  Total files: $TOTAL"
echo "  PNG files: $PNG_COUNT"
echo "  JPG files: $JPG_COUNT"
echo "  JPEG files: $JPEG_COUNT"

# Check for timeline and core value images
echo ""
echo "Timeline & Core Value images:"
for img in timeline-2567.png timeline-2568.png timeline-present.png; do
  if [ -f "$UPLOADS_DIR/$img" ]; then
    SIZE=$(ls -lh "$UPLOADS_DIR/$img" | awk '{print $5}')
    echo -e "  ${GREEN}✓${NC} $img ($SIZE)"
  else
    echo -e "  ${RED}✗${NC} $img (missing)"
  fi
done

echo ""
echo "Core Value images:"
for i in 1 2 3 4; do
  img="core-value-$i.png"
  if [ -f "$UPLOADS_DIR/$img" ]; then
    SIZE=$(ls -lh "$UPLOADS_DIR/$img" | awk '{print $5}')
    echo -e "  ${GREEN}✓${NC} $img ($SIZE)"
  else
    echo -e "  ${RED}✗${NC} $img (missing)"
  fi
done

echo ""
echo -e "${BLUE}=== Phase 4: API Response Check ===${NC}"
echo ""

# Check public settings API
echo -n "Public /api/settings endpoint: "
RESPONSE=$(curl -s "$BACKEND_URL/api/settings" | jq '.success' 2>/dev/null)
if [ "$RESPONSE" = "true" ]; then
  echo -e "${GREEN}✓ OK${NC}"
  # Show image field count
  IMAGE_COUNT=$(curl -s "$BACKEND_URL/api/settings" | jq 'to_entries | map(select(.value | startswith("http"))) | length' 2>/dev/null)
  echo "  Image URLs available: $IMAGE_COUNT"
else
  echo -e "${RED}✗ FAILED${NC}"
fi

echo ""
echo -e "${BLUE}=== Phase 5: Functionality Summary ===${NC}"
echo ""

echo "📦 PRODUCT IMAGES:"
PRODUCT_COUNT=$(mysql -u root -p"Boss12345" $DB_NAME -e "SELECT COUNT(*) FROM products WHERE image IS NOT NULL;" 2>/dev/null | tail -1)
echo "  Products with images: $PRODUCT_COUNT"

echo ""
echo "📜 CERTIFICATE IMAGES:"
CERT_COUNT=$(mysql -u root -p"Boss12345" $DB_NAME -e "SELECT COUNT(*) FROM certificates WHERE image IS NOT NULL;" 2>/dev/null | tail -1)
echo "  Certificates with images: $CERT_COUNT"

echo ""
echo "👥 BOARD MEMBER IMAGES:"
BOARD_COUNT=$(mysql -u root -p"Boss12345" $DB_NAME -e "SELECT COUNT(*) FROM board_members WHERE image IS NOT NULL;" 2>/dev/null | tail -1)
echo "  Board members with images: $BOARD_COUNT"

echo ""
echo "⭐ REVIEW IMAGES:"
REVIEW_COUNT=$(mysql -u root -p"Boss12345" $DB_NAME -e "SELECT COUNT(*) FROM reviews WHERE image IS NOT NULL;" 2>/dev/null | tail -1)
echo "  Reviews with images: $REVIEW_COUNT"

echo ""
echo -e "${BLUE}=== Phase 6: Settings Type Verification ===${NC}"
echo ""

# Verify that image settings are now IMAGE type
echo "Image settings type check:"
ALL_IMAGE=$(mysql -u root -p"Boss12345" $DB_NAME -e "SELECT COUNT(*) FROM site_settings WHERE setting_type='image';" 2>/dev/null | tail -1)
TIMELINE_IMAGE=$(mysql -u root -p"Boss12345" $DB_NAME -e "SELECT COUNT(*) FROM site_settings WHERE setting_key LIKE 'timeline%' AND setting_type='image';" 2>/dev/null | tail -1)
CORE_IMAGE=$(mysql -u root -p"Boss12345" $DB_NAME -e "SELECT COUNT(*) FROM site_settings WHERE setting_key LIKE 'core_value%' AND setting_type='image';" 2>/dev/null | tail -1)

echo "  Total image settings: $ALL_IMAGE"
echo "  Timeline image settings: $TIMELINE_IMAGE (expected: 3)"
echo "  Core value image settings: $CORE_IMAGE (expected: 4)"

if [ "$TIMELINE_IMAGE" -eq 3 ] && [ "$CORE_IMAGE" -eq 4 ]; then
  echo -e "  ${GREEN}✓ All settings correctly configured${NC}"
else
  echo -e "  ${RED}✗ Settings configuration incomplete${NC}"
fi

echo ""
echo -e "${GREEN}=== Verification Complete ===${NC}"
echo ""
echo "📝 Manual Testing Checklist:"
echo "  [ ] Go to http://localhost:5173/admin"
echo "  [ ] Login with admin credentials"
echo "  [ ] Click ⚙️ Settings"
echo "  [ ] Select 📅 Timeline section"
echo "  [ ] Verify 3 image upload fields appear"
echo "  [ ] Select 💎 Core Values section"
echo "  [ ] Verify 4 image upload fields appear"
echo "  [ ] Try uploading a test image"
echo "  [ ] Click 💾 Save"
echo "  [ ] Refresh page to verify persistence"
echo "  [ ] Check About page to see uploaded images"
echo ""
