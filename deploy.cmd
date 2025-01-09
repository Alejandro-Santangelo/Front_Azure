@echo off

:: 1. Select folder
IF EXIST "%DEPLOYMENT_SOURCE%\dist\app-bio\browser" (
  cd "%DEPLOYMENT_SOURCE%\dist\app-bio\browser"
) ELSE (
  echo \dist\app-bio\browser folder not found.
  exit /b 1
)

:: 2. Copy web.config
IF EXIST "%DEPLOYMENT_SOURCE%\web.config" (
  copy "%DEPLOYMENT_SOURCE%\web.config" "%DEPLOYMENT_TARGET%"
)

:: 3. Copy content
xcopy /d /y . "%DEPLOYMENT_TARGET%"
