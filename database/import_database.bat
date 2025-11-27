@echo off
setlocal

:: configuration
set BACKUP_FILE=%1
set DB_NAME=your_database

if "%BACKUP_FILE%"=="" (
    echo Usage: import_database.bat ^<backup file path^>
    echo Example: import_database.bat mongodb_backup\backup_20240101_120000.archive
    exit /b 1
)

if not exist %BACKUP_FILE% (
    echo ❌ Error: backup file does not exist: %BACKUP_FILE%
    exit /b 1
)

echo Start importing database: %DB_NAME%
echo From file: %BACKUP_FILE%

:: import database
mongorestore --db %DB_NAME% --archive=%BACKUP_FILE% --gzip --drop

if %errorlevel% equ 0 (
    echo ✅ Database imported successfully!
) else (
    echo ❌ Database imported failed!
    exit /b 1
)

endlocal