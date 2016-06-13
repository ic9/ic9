@setlocal enableextensions enabledelayedexpansion
echo off
set xargs=
set nargs=
for %%b in (%*) do (
    set arg=%%b
    set tmp=a!arg:-X=!
    if not !tmp!==a!arg! ( set "xargs=!xargs! !arg!" ) else ( set "nargs=!nargs! !arg!" )
)
:whilerun
FOR /f "tokens=*" %%G IN ('dir /b %~dp0..\ic9.jar') DO set jpath=%~dp0..\%%G
java -jar %xargs% "%jpath%" %nargs%
IF %ERRORLEVEL% EQU 2 GOTO whilerun