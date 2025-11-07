# Test des endpoints API
Write-Host ""
Write-Host "========================================"
Write-Host "TEST DES ENDPOINTS - MODE POSTMAN"
Write-Host "========================================"
Write-Host ""

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Yellow
Write-Host "GET /health"
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method GET
    Write-Host "SUCCESS" -ForegroundColor Green
    Write-Host ($health | ConvertTo-Json -Compress)
} catch {
    Write-Host "FAILED" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
Write-Host ""

# Test 2: Register
Write-Host "Test 2: Register (Cadastro)" -ForegroundColor Yellow
Write-Host "POST /api/users/register"
$randomNum = Get-Random -Minimum 1000 -Maximum 9999
$registerEmail = "testuser$randomNum@example.com"
$registerBody = @{
    name = "Test User $randomNum"
    email = $registerEmail
    password = "Test123456"
} | ConvertTo-Json

Write-Host "Body: $registerBody"
try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/users/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "SUCCESS" -ForegroundColor Green
    Write-Host ($registerResponse | ConvertTo-Json -Depth 5)
} catch {
    Write-Host "FAILED" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message
    } else {
        Write-Host $_.Exception.Message
    }
}
Write-Host ""

# Test 3: Login
Write-Host "Test 3: Login" -ForegroundColor Yellow
Write-Host "POST /api/users/login"
$loginBody = @{
    email = $registerEmail
    password = "Test123456"
} | ConvertTo-Json

Write-Host "Body: $loginBody"
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/users/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "SUCCESS" -ForegroundColor Green
    Write-Host ($loginResponse | ConvertTo-Json -Depth 5)
} catch {
    Write-Host "FAILED" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message
    } else {
        Write-Host $_.Exception.Message
    }
}
Write-Host ""

# Test 4: Login avec mauvais mot de passe
Write-Host "Test 4: Login avec mauvais mot de passe (doit echouer)" -ForegroundColor Yellow
Write-Host "POST /api/users/login"
$badLoginBody = @{
    email = $registerEmail
    password = "WrongPassword123"
} | ConvertTo-Json

Write-Host "Body: $badLoginBody"
try {
    $badLoginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/users/login" -Method POST -Body $badLoginBody -ContentType "application/json"
    Write-Host "UNEXPECTED SUCCESS" -ForegroundColor Red
} catch {
    Write-Host "EXPECTED FAILURE" -ForegroundColor Green
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message
    }
}
Write-Host ""

# Test 5: Register avec email existant
Write-Host "Test 5: Register avec email existant (doit echouer)" -ForegroundColor Yellow
Write-Host "POST /api/users/register"
$duplicateBody = @{
    name = "Duplicate User"
    email = $registerEmail
    password = "Test123456"
} | ConvertTo-Json

Write-Host "Body: $duplicateBody"
try {
    $duplicateResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/users/register" -Method POST -Body $duplicateBody -ContentType "application/json"
    Write-Host "UNEXPECTED SUCCESS" -ForegroundColor Red
} catch {
    Write-Host "EXPECTED FAILURE" -ForegroundColor Green
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message
    }
}
Write-Host ""

Write-Host "========================================"
Write-Host "TESTS TERMINES"
Write-Host "========================================"
