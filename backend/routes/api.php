<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\NotificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Dashboard
    Route::get('/dashboard/stats', [\App\Http\Controllers\DashboardController::class, 'stats']);
    Route::get('/reports', [\App\Http\Controllers\ReportController::class, 'index']);

    // Leads
    Route::get('/leads', [LeadController::class, 'index']);
    Route::post('/leads', [LeadController::class, 'store']);
    Route::get('/leads/{id}', [LeadController::class, 'show']);
    Route::put('/leads/{id}', [LeadController::class, 'update']);
    Route::patch('/leads/{id}/status', [LeadController::class, 'updateStatus']);
    Route::post('/leads/{id}/assign', [LeadController::class, 'assignAgent']);

    // Complaints
    Route::post('/complaints', [ComplaintController::class, 'store']);
    Route::post('/complaints/{id}/resolve', [ComplaintController::class, 'resolve']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);

    // Users
    Route::apiResource('users', \App\Http\Controllers\UserController::class);

    // Logs
    Route::get('/logs', [\App\Http\Controllers\ActivityLogController::class, 'index']);

    // Companies
    Route::apiResource('companies', \App\Http\Controllers\CompanyController::class);
});
