param(
  [string]$FlutterPath = "C:\Users\LOQ\.puro\envs\stable\flutter\bin\flutter.bat",
  [string]$ApiBaseUrl = "http://localhost:3000",
  [string]$EmulatorApiBaseUrl = "http://10.0.2.2:3000",
  [switch]$InstallEmulator
)

$ErrorActionPreference = "Stop"

function Run-Step {
  param(
    [string]$Name,
    [scriptblock]$Command
  )

  Write-Host ""
  Write-Host "==> $Name" -ForegroundColor Cyan
  & $Command
}

$root = Split-Path -Parent $PSScriptRoot
$frontend = Join-Path $root "frontend\student_financial_tracker_app"
$adb = Join-Path $env:LOCALAPPDATA "Android\Sdk\platform-tools\adb.exe"

Run-Step "Backend build" {
  Push-Location $root
  npm.cmd run build
  Pop-Location
}

Run-Step "Backend tests" {
  Push-Location $root
  npm.cmd test
  Pop-Location
}

Run-Step "Flutter analyze" {
  Push-Location $frontend
  & $FlutterPath analyze
  Pop-Location
}

Run-Step "Flutter integration tests" {
  Push-Location $frontend
  & $FlutterPath test "--dart-define=API_BASE_URL=$ApiBaseUrl"
  Pop-Location
}

Run-Step "Build Android debug APK" {
  Push-Location $frontend
  & $FlutterPath build apk --debug --target-platform android-x64 "--dart-define=API_BASE_URL=$EmulatorApiBaseUrl"
  Pop-Location
}

if ($InstallEmulator) {
  Run-Step "Install and launch Android emulator APK" {
    Push-Location $frontend
    & $adb install -r "build\app\outputs\flutter-apk\app-debug.apk"
    & $adb shell monkey -p com.studentfinance.student_financial_tracker_app -c android.intent.category.LAUNCHER 1
    Pop-Location
  }
}

Write-Host ""
Write-Host "Validation completed." -ForegroundColor Green
