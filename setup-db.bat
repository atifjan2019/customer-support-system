@echo off
echo Running Database Migrations...
cd backend
php artisan migrate
echo.
echo If migration failed, please make sure XAMPP MySQL is running!
pause
