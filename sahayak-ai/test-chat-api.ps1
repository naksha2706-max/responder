$body = @{
    message = "Hello, I need help"
    sessionId = "TEST-002"
    language = "en"
    conversationHistory = @()
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3000/api/chat" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing

Write-Host "Status Code: $($response.StatusCode)"
Write-Host "Response: $($response.Content)"