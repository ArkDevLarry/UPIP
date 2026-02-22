<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\{
    AuthController,
    ObservationController,
    RiskController,
    ConsentController,
    ClinicianController,
    UserController,
    DeviceController,
    AuditController
};

/*
|--------------------------------------------------------------------------
| API Routes - UPIP v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ─── Auth ────────────────────────────────────────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('register',       [AuthController::class, 'register']);
        Route::post('login',          [AuthController::class, 'login'])->name('login');
        Route::post('refresh',        [AuthController::class, 'refresh'])->middleware('auth:sanctum');
        Route::post('logout',         [AuthController::class, 'logout'])->middleware('auth:sanctum');
        Route::get('me',              [AuthController::class, 'me'])->middleware('auth:sanctum');
    });

    // ─── Authenticated Routes ─────────────────────────────────────────────
    Route::middleware(['auth:sanctum', 'consent.check', 'audit.log'])->group(function () {

        // Observations ingestion
        Route::prefix('observations')->group(function () {
            Route::post('wearable',    [ObservationController::class, 'storeWearable']);
            Route::post('behavioral',  [ObservationController::class, 'storeBehavioral']);
            Route::post('speech',      [ObservationController::class, 'storeSpeech']);
            Route::post('diagnostic',  [ObservationController::class, 'storeDiagnostic']);
            Route::get('/',            [ObservationController::class, 'index']);
            Route::get('{id}',         [ObservationController::class, 'show']);
        });

        // Risk data
        Route::prefix('risk')->group(function () {
            Route::post('family-history',  [RiskController::class, 'storeFamilyHistory']);
            Route::post('genetic',         [RiskController::class, 'storeGenetic']);
            Route::get('scores',           [RiskController::class, 'getScores']);
            Route::get('history',          [RiskController::class, 'getHistory']);
            Route::get('uprs',             [RiskController::class, 'getUPRS']);
        });

        // Consent management
        Route::prefix('consent')->group(function () {
            Route::post('/',              [ConsentController::class, 'store']);
            Route::get('/',               [ConsentController::class, 'index']);
            Route::delete('{module}',     [ConsentController::class, 'revoke']);
        });

        // Devices
        Route::prefix('devices')->group(function () {
            Route::post('/',    [DeviceController::class, 'register']);
            Route::get('/',     [DeviceController::class, 'index']);
            Route::delete('{id}', [DeviceController::class, 'unregister']);
        });

        // User profile
        Route::prefix('users')->group(function () {
            Route::get('profile',   [UserController::class, 'profile']);
            Route::put('profile',   [UserController::class, 'updateProfile']);
        });

        // Audit logs (own user)
        Route::get('audit-logs', [AuditController::class, 'index']);
    });

    // ─── Clinician Routes ─────────────────────────────────────────────────
    Route::middleware(['auth:sanctum', 'role:clinician|admin', 'audit.log'])->prefix('clinician')->group(function () {
        Route::get('queue',                       [ClinicianController::class, 'queue']);
        Route::get('cases/{caseId}',              [ClinicianController::class, 'show']);
        Route::post('review/{caseId}',            [ClinicianController::class, 'submitReview']);
        Route::get('patients',                    [ClinicianController::class, 'patients']);
        Route::get('patients/{userId}/history',   [ClinicianController::class, 'patientHistory']);
    });

    // ─── Admin Routes ─────────────────────────────────────────────────────
    Route::middleware(['auth:sanctum', 'role:admin', 'audit.log'])->prefix('admin')->group(function () {
        Route::get('audit-logs',             [AuditController::class, 'adminIndex']);
        Route::get('risk-weights',           [RiskController::class, 'getWeights']);
        Route::put('risk-weights',           [RiskController::class, 'updateWeights']);
        Route::get('model-versions',         [RiskController::class, 'modelVersions']);
    });
});


Route::get('/documentation', function () {
    return view('documentation');
});