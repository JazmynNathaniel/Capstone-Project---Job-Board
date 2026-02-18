$base = "http://127.0.0.1:5000"

$registerBody = @{
  username = "John Green"
  email    = "JohnGreen3@example.com"
  password = "password!123"
  role     = "user"
} | ConvertTo-Json

$loginBody = @{
  email    = "JohnGreen3@example.com"
  password = "password!123"
} | ConvertTo-Json

Write-Host "Registering..."
Invoke-RestMethod -Method Post -Uri "$base/auth/register" -ContentType "application/json" -Body $registerBody

Write-Host "Logging in..."
$loginResp = Invoke-RestMethod -Method Post -Uri "$base/auth/login" -ContentType "application/json" -Body $loginBody

Write-Host "Token:"
$loginResp.token
