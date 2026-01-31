@echo off
echo Starting ISP Customer Support System...

echo Starting Backend Server...
start "Laravel Backend" /d "c:\xampp\htdocs\cms\backend" php artisan serve

echo Starting Frontend Server...
start "React Frontend" /d "c:\xampp\htdocs\cms\frontend" npm run dev

echo Development environment started!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
pause
