$base = "http://127.0.0.1:5000"

$profileBody = @{
  user_id   = 1
  full_name = "Test User"
  bio       = "Test bio"
} | ConvertTo-Json

Write-Host "Creating profile..."
$profile = Invoke-RestMethod -Method Post -Uri "$base/profiles/" -ContentType "application/json" -Body $profileBody
$profile | Out-Host

Write-Host "Listing profiles..."
Invoke-RestMethod -Method Get -Uri "$base/profiles/" | Out-Host

Write-Host "Getting profile by id..."
Invoke-RestMethod -Method Get -Uri "$base/profiles/$($profile.id)" | Out-Host

Write-Host "Updating profile..."
$updateProfileBody = @{
  full_name = "Updated User"
  bio       = "Updated bio"
} | ConvertTo-Json
Invoke-RestMethod -Method Put -Uri "$base/profiles/$($profile.id)" -ContentType "application/json" -Body $updateProfileBody | Out-Host

Write-Host "Deleting profile..."
Invoke-RestMethod -Method Delete -Uri "$base/profiles/$($profile.id)" | Out-Host
