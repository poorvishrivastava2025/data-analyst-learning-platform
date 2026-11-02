# start-server.ps1 - Launch AnalystPath AI Platform & Database
$Host.UI.RawUI.WindowTitle = "AnalystPath AI - Running Platform & Database"
Set-Location $PSScriptRoot

Write-Host "========================================================" -ForegroundColor Green
Write-Host "       Starting AnalystPath AI Platform & Database       " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host ""

$nodeExec = $null
if (Test-Path "$env:APPDATA\Antigravity\bin\agy-node.cmd") {
    $nodeExec = "$env:APPDATA\Antigravity\bin\agy-node.cmd"
} elseif (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeExec = "node"
} elseif (Test-Path "$env:LOCALAPPDATA\Programs\antigravity\Antigravity.exe") {
    $env:ELECTRON_RUN_AS_NODE = "1"
    $nodeExec = "$env:LOCALAPPDATA\Programs\antigravity\Antigravity.exe"
}

if (-not $nodeExec) {
    Write-Host "[ERROR] Node.js runtime not found." -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org or run within Antigravity."
    Read-Host "Press Enter to exit..."
    exit 1
}

Write-Host "[INFO] Using runtime: $nodeExec" -ForegroundColor Cyan
Write-Host "[INFO] Database: analystpath.db (SQLite)" -ForegroundColor Cyan
Write-Host "[INFO] Opening http://localhost:3000 in your browser..." -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================================" -ForegroundColor Yellow
Write-Host "  Default Demo Credentials:" -ForegroundColor Yellow
Write-Host "  - Email:    learner@analystpath.ai" -ForegroundColor Yellow
Write-Host "  - Password: password123" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Yellow
Write-Host ""

Start-Process "http://localhost:3000"

& $nodeExec server.js
