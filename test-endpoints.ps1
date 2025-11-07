# Script de test des endpoints - Style Postman 🚀
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🧪 TEST DES ENDPOINTS - MODE POSTMAN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "📋 Test 1: Health Check" -ForegroundColor Yellow
Write-Host "GET /health" -ForegroundColor Gray
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method GET
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host "Response: $($health | ConvertTo-Json -Compress)" -ForegroundColor White
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Register (Cadastro)
Write-Host "📋 Test 2: Register (Cadastro)" -ForegroundColor Yellow
Write-Host "POST /api/users/register" -ForegroundColor Gray
$randomNum = Get-Random -Minimum 1000 -Maximum 9999
$registerEmail = "testuser$randomNum@example.com"
$registerBody = @{
    name = "Test User $randomNum"
    email = $registerEmail
    password = "Test123456"
} | ConvertTo-Json

Write-Host "Body: $registerBody" -ForegroundColor Gray
try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/users/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host "Response: $($registerResponse | ConvertTo-Json -Depth 5)" -ForegroundColor White
    $token = $registerResponse.token
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 3: Login
Write-Host "📋 Test 3: Login" -ForegroundColor Yellow
Write-Host "POST /api/users/login" -ForegroundColor Gray
$loginBody = @{
    email = $registerEmail
    password = "Test123456"
} | ConvertTo-Json

Write-Host "Body: $loginBody" -ForegroundColor Gray
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/users/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host "Response: $($loginResponse | ConvertTo-Json -Depth 5)" -ForegroundColor White
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 4: Login avec mauvais mot de passe
Write-Host "📋 Test 4: Login avec mauvais mot de passe (doit échouer)" -ForegroundColor Yellow
Write-Host "POST /api/users/login" -ForegroundColor Gray
$badLoginBody = @{
    email = $registerEmail
    password = "WrongPassword123"
} | ConvertTo-Json

Write-Host "Body: $badLoginBody" -ForegroundColor Gray
try {
    $badLoginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/users/login" -Method POST -Body $badLoginBody -ContentType "application/json"
    Write-Host "❌ UNEXPECTED SUCCESS (should have failed)" -ForegroundColor Red
    Write-Host "Response: $($badLoginResponse | ConvertTo-Json -Depth 5)" -ForegroundColor White
} catch {
    Write-Host "✅ EXPECTED FAILURE" -ForegroundColor Green
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}
Write-Host ""

# Test 5: Register avec email déjà existant
Write-Host "📋 Test 5: Register avec email existant (doit échouer)" -ForegroundColor Yellow
Write-Host "POST /api/users/register" -ForegroundColor Gray
$duplicateBody = @{
    name = "Duplicate User"
    email = $registerEmail
    password = "Test123456"
} | ConvertTo-Json

Write-Host "Body: $duplicateBody" -ForegroundColor Gray
try {
    $duplicateResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/users/register" -Method POST -Body $duplicateBody -ContentType "application/json"
    Write-Host "❌ UNEXPECTED SUCCESS (should have failed)" -ForegroundColor Red
    Write-Host "Response: $($duplicateResponse | ConvertTo-Json -Depth 5)" -ForegroundColor White
} catch {
    Write-Host "✅ EXPECTED FAILURE" -ForegroundColor Green
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ TESTS TERMINÉS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
