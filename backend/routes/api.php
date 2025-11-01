<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UploadController;

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

// Upload endpoint for CKEditor image uploads
Route::post('/upload-image', [UploadController::class, 'store']);