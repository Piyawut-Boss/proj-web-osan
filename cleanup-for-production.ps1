# Production Cleanup Script (Windows PowerShell)
# Removes all development/test files for production deployment
# Usage: .\cleanup-for-production.ps1

Write-Host @"
╔════════════════════════════════════════╗
║  PSU Agro Food Production Cleanup      ║
╚════════════════════════════════════════╝
"@ -ForegroundColor Cyan

Write-Host ""
Write-Host "⚠️  This script will remove development files" -ForegroundColor Yellow
Write-Host "✅ Safe to run - only removes dev files" -ForegroundColor Green
Write-Host ""

$response = Read-Host "Continue? (y/N)"
if ($response -ne "y" -and $response -ne "Y") {
  Write-Host "Cancelled." -ForegroundColor Yellow
  exit
}

Write-Host ""
Write-Host "🧹 Starting cleanup..." -ForegroundColor Cyan
Write-Host ""

$removed = 0

# Backend test files
Write-Host "Removing backend test files..." -ForegroundColor Cyan

$testPatterns = @(
  "test-*.js"
  "check-*.js"
  "debug-*.js"
  "verify-*.js"
  "create-*-images.js"
  "create-*-certificates.js"
  "add-*.js"
  "update-*.js"
  "audit-*.js"
  "set-*.js"
  "convert-*.js"
  "init-*about*.js"
)

Push-Location backend

foreach ($pattern in $testPatterns) {
  $files = Get-ChildItem -Filter $pattern -ErrorAction SilentlyContinue
  foreach ($file in $files) {
    Write-Host "  ❌ Removing: $($file.Name)" -ForegroundColor Red
    Remove-Item -Force $file.FullName
    $removed++
  }
}

# Remove SQLite database
if (Test-Path "database.sqlite") {
  Write-Host "  ❌ Removing: database.sqlite (using MySQL)" -ForegroundColor Red
  Remove-Item -Force "database.sqlite"
  $removed++
}

# Remove test HTML
if (Test-Path "image-test.html") {
  Write-Host "  ❌ Removing: image-test.html" -ForegroundColor Red
  Remove-Item -Force "image-test.html"
  $removed++
}

# Remove markdown files
$mdFiles = Get-ChildItem -Filter "*.md" -ErrorAction SilentlyContinue
foreach ($file in $mdFiles) {
  Write-Host "  ❌ Removing: $($file.Name)" -ForegroundColor Red
  Remove-Item -Force $file.FullName
  $removed++
}

# Remove alternate setup scripts
if (Test-Path "setup-database.js") {
  Write-Host "  ❌ Removing: setup-database.js (use init-db.js)" -ForegroundColor Red
  Remove-Item -Force "setup-database.js"
  $removed++
}

if (Test-Path "setup-mysql.js") {
  Write-Host "  ❌ Removing: setup-mysql.js" -ForegroundColor Red
  Remove-Item -Force "setup-mysql.js"
  $removed++
}

Pop-Location

# Root development files
Write-Host ""
Write-Host "Removing root development files..." -ForegroundColor Cyan

$rootPatterns = @(
  "SETUP.md"
  "TEAM_STARTUP.md"
  "QUICKSTART.md"
  "TESTING_READY.md"
  "IMAGE_MANAGEMENT*.md"
  "setup.bat"
  "setup.sh"
  "verify-images.ps1"
  "verify-images.sh"
)

foreach ($pattern in $rootPatterns) {
  $files = Get-ChildItem -Filter $pattern -ErrorAction SilentlyContinue
  foreach ($file in $files) {
    Write-Host "  ❌ Removing: $($file.Name)" -ForegroundColor Red
    Remove-Item -Force $file.FullName
    $removed++
  }
}

Write-Host ""
Write-Host @"
╔════════════════════════════════════════╗
║  ✅ Cleanup Complete!                 ║
╚════════════════════════════════════════╝
"@ -ForegroundColor Green

Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   Files removed: $removed" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Kept in production:" -ForegroundColor Green
Write-Host "   • All core application files" -ForegroundColor Gray
Write-Host "   • All configuration files" -ForegroundColor Gray
Write-Host "   • Deployment documentation" -ForegroundColor Gray
Write-Host "   • Database schema (database.sql)" -ForegroundColor Gray
Write-Host ""
Write-Host "📦 Ready for production deployment!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. cd backend" -ForegroundColor Gray
Write-Host "2. cp .env.production.example .env" -ForegroundColor Gray
Write-Host "3. Edit .env with production values" -ForegroundColor Gray
Write-Host "4. npm install --production" -ForegroundColor Gray
Write-Host "5. npm run init-db" -ForegroundColor Gray
Write-Host "6. npm start" -ForegroundColor Gray
Write-Host ""
