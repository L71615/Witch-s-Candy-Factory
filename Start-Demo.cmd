@echo off
setlocal
cd /d "%~dp0"
set "CANDY_RIVE=%USERPROFILE%\.rive\bin\rive.exe"
if not exist "%CANDY_RIVE%" (
  echo Rive CLI is required. See README.md for installation instructions.
  pause
  exit /b 1
)
"%CANDY_RIVE%" factory --fit=contain --viewport=1440x810
if errorlevel 1 pause
