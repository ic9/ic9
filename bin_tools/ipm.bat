echo off
FOR /f "tokens=*" %%G IN ('dir /b %~dp0\ipm.js') DO set jspath=%~dp0\%%G
ic9 %jspath% %*