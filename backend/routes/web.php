<?php

use App\Http\Controllers\Mobile\MobileAuthController;
use App\Http\Controllers\Mobile\MobileComplaintsController;
use App\Http\Controllers\Mobile\MobileDashboardController;
use App\Http\Controllers\Mobile\MobileLeadsController;
use App\Http\Controllers\Mobile\MobileSettingsController;
use App\Http\Controllers\Mobile\MobileHomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/login', [MobileAuthController::class, 'showLogin'])->name('login');

Route::prefix('mobile')->name('mobile.')->group(function () {
    Route::get('/', [MobileHomeController::class, 'index'])->name('home');
    Route::get('/login', [MobileAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [MobileAuthController::class, 'login'])->name('login.submit');
    Route::post('/logout', [MobileAuthController::class, 'logout'])->name('logout');
    Route::get('/dashboard', [MobileDashboardController::class, 'index'])
        ->middleware('auth')
        ->name('dashboard');
    Route::get('/leads', [MobileLeadsController::class, 'index'])
        ->middleware('auth')
        ->name('leads');
    Route::get('/leads/create', [MobileLeadsController::class, 'create'])
        ->middleware('auth')
        ->name('leads.create');
    Route::post('/leads', [MobileLeadsController::class, 'store'])
        ->middleware('auth')
        ->name('leads.store');
    Route::get('/leads/{lead}', [MobileLeadsController::class, 'show'])
        ->middleware('auth')
        ->name('leads.show');
    Route::get('/leads/{lead}/edit', [MobileLeadsController::class, 'edit'])
        ->middleware('auth')
        ->name('leads.edit');
    Route::put('/leads/{lead}', [MobileLeadsController::class, 'update'])
        ->middleware('auth')
        ->name('leads.update');
    Route::delete('/leads/{lead}', [MobileLeadsController::class, 'destroy'])
        ->middleware('auth')
        ->name('leads.destroy');
    Route::get('/complaints', [MobileLeadsController::class, 'complaints'])
        ->middleware('auth')
        ->name('complaints');
    Route::get('/complaints/create', [MobileComplaintsController::class, 'create'])
        ->middleware('auth')
        ->name('complaints.create');
    Route::post('/complaints', [MobileComplaintsController::class, 'store'])
        ->middleware('auth')
        ->name('complaints.store');
    Route::get('/complaints/{lead}', [MobileComplaintsController::class, 'show'])
        ->middleware('auth')
        ->name('complaints.show');
    Route::get('/complaints/{lead}/edit', [MobileComplaintsController::class, 'edit'])
        ->middleware('auth')
        ->name('complaints.edit');
    Route::put('/complaints/{lead}', [MobileComplaintsController::class, 'update'])
        ->middleware('auth')
        ->name('complaints.update');
    Route::post('/complaints/{lead}/resolve', [MobileComplaintsController::class, 'resolve'])
        ->middleware('auth')
        ->name('complaints.resolve');
    Route::delete('/complaints/{lead}', [MobileComplaintsController::class, 'destroy'])
        ->middleware('auth')
        ->name('complaints.destroy');
    Route::get('/settings', [MobileSettingsController::class, 'index'])
        ->middleware('auth')
        ->name('settings');
    Route::post('/settings/push/enroll', [MobileSettingsController::class, 'enrollPush'])
        ->middleware('auth')
        ->name('settings.push.enroll');
    Route::post('/settings/sync', [MobileSettingsController::class, 'sync'])
        ->middleware('auth')
        ->name('settings.sync');
});
