$ErrorActionPreference = "Stop"
$frontendUrl = if ($env:FRONTEND_URL) { $env:FRONTEND_URL } else { "http://127.0.0.1:8080" }
$backendUrl = if ($env:BACKEND_URL) { $env:BACKEND_URL } else { "http://127.0.0.1:3000" }

Invoke-WebRequest -UseBasicParsing "$backendUrl/health/live" | Out-Null
Invoke-WebRequest -UseBasicParsing "$backendUrl/health/ready" | Out-Null
Invoke-WebRequest -UseBasicParsing "$frontendUrl/auth/login" | Out-Null
Write-Output "Cognolith smoke checks passed."
