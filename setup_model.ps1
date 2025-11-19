# Setup script for downloading the offline LLM model for disaster relief chatbot
# This script downloads a lightweight Gemma model optimized for mobile deployment
# The model will be stored locally to enable offline functionality

param(
    [switch]$Force,
    [string]$ModelUrl = "https://huggingface.co/TheBloke/gemma-3-270m-GGUF/resolve/main/gemma-3-270m.q4_k_m.gguf",
    [string]$TargetDir = "assets\models",
    [string]$ModelFile = "gemma-3-270m.q4_k_m.gguf"
)

$FullPath = Join-Path $TargetDir $ModelFile

Write-Host "Starting offline chatbot model setup..." -ForegroundColor Green
Write-Host "Target directory: $TargetDir" -ForegroundColor Cyan
Write-Host "Model file: $ModelFile" -ForegroundColor Cyan

# Create the models directory if it doesn't exist
if (-not (Test-Path $TargetDir)) {
    Write-Host "Creating models directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
    Write-Host "Directory created successfully" -ForegroundColor Green
} else {
    Write-Host "Models directory already exists" -ForegroundColor Yellow
}

# Check if model already exists
if (Test-Path $FullPath) {
    if (-not $Force) {
        $response = Read-Host "Model file already exists. Do you want to re-download? (y/N)"
        if ($response -notmatch '^[Yy]$') {
            Write-Host "Using existing model file" -ForegroundColor Green
            exit 0
        }
    }
    Write-Host "Removing existing model file..." -ForegroundColor Yellow
    Remove-Item $FullPath -Force
}

# Download the model
Write-Host "Downloading model from Hugging Face..." -ForegroundColor Cyan
Write-Host "Model size: ~150MB (optimized for mobile)" -ForegroundColor Cyan
Write-Host "This may take a few minutes depending on your connection..." -ForegroundColor Yellow

try {
    # Use Invoke-WebRequest to download the file
    $ProgressPreference = 'Continue'
    Invoke-WebRequest -Uri $ModelUrl -OutFile $FullPath -ErrorAction Stop
    
    Write-Host "Model downloaded successfully!" -ForegroundColor Green
    Write-Host "Model location: $FullPath" -ForegroundColor Cyan
    
    # Verify the download
    if (Test-Path $FullPath) {
        $fileSize = (Get-Item $FullPath).Length
        $fileSizeMB = [math]::Round($fileSize / 1MB, 2)
        Write-Host "Downloaded file size: $fileSizeMB MB" -ForegroundColor Cyan
        Write-Host "Setup complete! Your offline chatbot is ready to use." -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor White
        Write-Host "1. Import the LocalChatbot component in your app" -ForegroundColor White
        Write-Host "2. The model will be automatically loaded when the component mounts" -ForegroundColor White
        Write-Host "3. No internet connection required for inference!" -ForegroundColor White
    } else {
        Write-Host "Error: Model file not found after download" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error: Failed to download model" -ForegroundColor Red
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   - Check your internet connection" -ForegroundColor Yellow
    Write-Host "   - Verify the Hugging Face URL is accessible" -ForegroundColor Yellow
    Write-Host "   - Ensure you have sufficient disk space (~200MB)" -ForegroundColor Yellow
    Write-Host "Error details: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Offline disaster relief chatbot setup complete!" -ForegroundColor Green
Write-Host "This model works entirely offline - perfect for emergency situations." -ForegroundColor Green
