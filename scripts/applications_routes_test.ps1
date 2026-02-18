$base = "http://127.0.0.1:5000"

$applicationBody = @{
  user_id = 1
  job_id  = 1
  status  = "pending"
} | ConvertTo-Json

Write-Host "Creating application..."
$application = Invoke-RestMethod -Method Post -Uri "$base/applications/" -ContentType "application/json" -Body $applicationBody
$application | Out-Host

Write-Host "Listing applications..."
Invoke-RestMethod -Method Get -Uri "$base/applications/" | Out-Host

Write-Host "Getting application by id..."
Invoke-RestMethod -Method Get -Uri "$base/applications/$($application.id)" | Out-Host

Write-Host "Updating application..."
$updateApplicationBody = @{
  status = "accepted"
} | ConvertTo-Json
Invoke-RestMethod -Method Put -Uri "$base/applications/$($application.id)" -ContentType "application/json" -Body $updateApplicationBody | Out-Host

Write-Host "Deleting application..."
Invoke-RestMethod -Method Delete -Uri "$base/applications/$($application.id)" | Out-Host
