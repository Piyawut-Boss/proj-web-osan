#!/bin/bash
# Production Cleanup Script
# Removes all development/test files for production deployment
# Usage: bash cleanup-for-production.sh

echo "╔════════════════════════════════════════╗"
echo "║  PSU Agro Food Production Cleanup      ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "⚠️  This script will remove development files"
echo "✅ Safe to run - only removes dev files"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 1
fi

echo ""
echo "🧹 Starting cleanup..."
echo ""

# Count removed files
REMOVED=0

# Backend test files
echo "Removing backend test files..."
cd backend || exit 1

for file in test-*.js check-*.js debug-*.js verify-*.js create-*-images.js create-*-certificates.js \
            add-*.js update-*.js audit-*.js set-*.js convert-*.js init-about-images.js; do
  if ls $file 1> /dev/null 2>&1; then
    echo "  ❌ Removing: $file"
    rm -f $file
    REMOVED=$((REMOVED + 1))
  fi
done

# Remove SQLite database (use MySQL instead)
if [ -f "database.sqlite" ]; then
  echo "  ❌ Removing: database.sqlite (using MySQL)"
  rm -f database.sqlite
  REMOVED=$((REMOVED + 1))
fi

# Remove test HTML
if [ -f "image-test.html" ]; then
  echo "  ❌ Removing: image-test.html"
  rm -f image-test.html
  REMOVED=$((REMOVED + 1))
fi

# Remove markdown files from backend
for file in *.md; do
  if [ -f "$file" ]; then
    echo "  ❌ Removing: $file"
    rm -f "$file"
    REMOVED=$((REMOVED + 1))
  fi
done

# Remove alternate setup scripts
if [ -f "setup-database.js" ]; then
  echo "  ❌ Removing: setup-database.js (use init-db.js)"
  rm -f setup-database.js
  REMOVED=$((REMOVED + 1))
fi

if [ -f "setup-mysql.js" ]; then
  echo "  ❌ Removing: setup-mysql.js"
  rm -f setup-mysql.js
  REMOVED=$((REMOVED + 1))
fi

cd ..

# Root development files
echo ""
echo "Removing root development files..."

for file in SETUP.md TEAM_STARTUP.md QUICKSTART.md TESTING_READY.md IMAGE_MANAGEMENT*.md \
            setup.bat setup.sh verify-images.ps1 verify-images.sh; do
  if [ -f "$file" ]; then
    echo "  ❌ Removing: $file"
    rm -f "$file"
    REMOVED=$((REMOVED + 1))
  fi
done

echo ""
echo "╔════════════════════════════════════════╗"
echo "║  ✅ Cleanup Complete!                 ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "📊 Summary:"
echo "   Files removed: $REMOVED"
echo ""
echo "✅ Kept in production:"
echo "   • All core application files"
echo "   • All configuration files"
echo "   • Deployment documentation"
echo "   • Database schema (database.sql)"
echo ""
echo "📦 Ready for production deployment!"
echo ""
echo "Next steps:"
echo "1. cd backend"
echo "2. cp .env.production.example .env"
echo "3. Edit .env with production values"
echo "4. npm install --production"
echo "5. npm run init-db"
echo "6. npm start"
echo ""
