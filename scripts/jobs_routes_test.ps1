$base = "http://127.0.0.1:5000"

$jobBody = @{
  title       = "Test Job"
  description = "Test job description"
  location    = "Remote"
  salary      = 80000
  employer_id = 1
} | ConvertTo-Json

Write-Host "Creating job..."
$job = Invoke-RestMethod -Method Post -Uri "$base/jobs/" -ContentType "application/json" -Body $jobBody
$job | Out-Host

Write-Host "Listing jobs..."
Invoke-RestMethod -Method Get -Uri "$base/jobs/" | Out-Host

Write-Host "Getting job by id..."
Invoke-RestMethod -Method Get -Uri "$base/jobs/$($job.id)" | Out-Host

Write-Host "Updating job..."
$updateJobBody = @{
  title = "Updated Job"
  salary = 90000
} | ConvertTo-Json
Invoke-RestMethod -Method Put -Uri "$base/jobs/$($job.id)" -ContentType "application/json" -Body $updateJobBody | Out-Host

Write-Host "Deleting job..."
$deleteResp = Invoke-RestMethod -Method Delete -Uri "$base/jobs/$($job.id)"
$deleteResp | Out-Host
