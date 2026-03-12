# deploy.ps1

# To run this: powershell -ExecutionPolicy Bypass -File deploy.ps1

# -----------------------------------------
# Load .env.deploy
# -----------------------------------------
$envFile = ".env.deploy"

if (-not (Test-Path $envFile)) {
  Write-Host "ERROR: $envFile not found. Create it first."
  exit 1
}

# Parse each line into variables
Get-Content $envFile | ForEach-Object {
  $line = $_.Trim()
  # skip empty lines and comments
  if ($line -eq "" -or $line.StartsWith("#")) { return }

  $parts = $line -split "=", 2
  $key   = $parts[0].Trim()
  $value = $parts[1].Trim()

  Set-Variable -Name $key -Value $value -Scope Script
}

# -----------------------------------------
# Validate required vars
# -----------------------------------------
foreach ($var in @("FTP_HOST", "FTP_USER", "FTP_PASS", "FTP_REMOTE_DIR")) {
  if (-not (Get-Variable -Name $var -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Missing $var in $envFile"
    exit 1
  }
}

Write-Host "Loaded config from $envFile"
Write-Host "  Host: $FTP_HOST"
Write-Host "  User: $FTP_USER"
Write-Host "  Remote: $FTP_REMOTE_DIR"
Write-Host ""

# -----------------------------------------
# Check branch
# -----------------------------------------
Write-Host "Checking branch..."
$branch = git rev-parse --abbrev-ref HEAD
if ($branch -ne "main") {
  Write-Host "ERROR: Must be on main branch (current: $branch)"
  exit 1
}

# -----------------------------------------
# Install
# -----------------------------------------
Write-Host "Installing dependencies..."
pnpm install --frozen-lockfile
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: Install failed"; exit 1 }

# -----------------------------------------
# Build
# -----------------------------------------
Write-Host "Building..."
pnpm build
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: Build failed"; exit 1 }

if (-not (Test-Path "./dist")) {
  Write-Host "ERROR: dist/ folder not found"
  exit 1
}

# -----------------------------------------
# Upload
# -----------------------------------------
Write-Host "Uploading to server..."
$distPath = Resolve-Path "./dist"
$files = Get-ChildItem -Path "./dist" -Recurse -File
$total = $files.Count
$count = 0

foreach ($file in $files) {
  $count++
  $relativePath = $file.FullName.Replace($distPath.Path, "").Replace("\", "/").TrimStart("/")
  $remotePath = "ftp://${FTP_HOST}${FTP_REMOTE_DIR}${relativePath}"

  try {
    $request = [System.Net.WebRequest]::Create($remotePath)
    $request.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
    $request.Credentials = New-Object System.Net.NetworkCredential($FTP_USER, $FTP_PASS)
    $request.UsePassive = $true

    $content = [System.IO.File]::ReadAllBytes($file.FullName)
    $request.ContentLength = $content.Length
    $stream = $request.GetRequestStream()
    $stream.Write($content, 0, $content.Length)
    $stream.Close()

    Write-Host "  ($count/$total) OK: $relativePath"
  } catch {
    Write-Host "  ($count/$total) FAILED: $relativePath - $_"
  }
}

Write-Host ""
Write-Host "Deploy complete! ($count files uploaded)"