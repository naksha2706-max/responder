$body = @{
    message = "My seniors force me to do pushups at midnight"
    sessionId = "TEST-001"
    language = "en"
    conversationHistory = @()
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3000/api/classify" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing

Write-Host "Status Code: $($response.StatusCode)"
Write-Host "Response: $($response.Content)"