$base = "http://127.0.0.1:5000"

$employerBody = @{
  user_id        = 1
  name           = "Your Future Really Nice Boss"
  email          = "youWannaWorkHere@example.com"
  company_name   = "Software Engineer Paradise Remote Jobs Palace"
  contact_person = "Jake FromStateFarm"
  password_hash  = "not-a-real-hash"
} | ConvertTo-Json

Write-Host "Creating employer..."
$employer = Invoke-RestMethod -Method Post -Uri "$base/employers/" -ContentType "application/json" -Body $employerBody
$employer | Out-Host

Write-Host "Listing employers..."
Invoke-RestMethod -Method Get -Uri "$base/employers/" | Out-Host

Write-Host "Getting employer by id..."
Invoke-RestMethod -Method Get -Uri "$base/employers/$($employer.id)" | Out-Host

Write-Host "Updating employer..."
$updateEmployerBody = @{
  company_name = "Updated Company Name Hello"
  contact_person = "Updated Contact Information"
} | ConvertTo-Json
Invoke-RestMethod -Method Put -Uri "$base/employers/$($employer.id)" -ContentType "application/json" -Body $updateEmployerBody | Out-Host

Write-Host "Deleting employer..."
Invoke-RestMethod -Method Delete -Uri "$base/employers/$($employer.id)" | Out-Host
