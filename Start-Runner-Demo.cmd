@echo off
setlocal
cd /d "%~dp0"
set "RUNNER_RIVE=%USERPROFILE%\.rive\bin\rive.exe"
if not exist "%RUNNER_RIVE%" (
  echo Rive CLI is required to run this demo.
  pause
  exit /b 1
)
"%RUNNER_RIVE%" runner --fit=contain --viewport=1280x720
if errorlevel 1 pause
