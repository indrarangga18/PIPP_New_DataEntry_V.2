<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        if (!$request->hasFile('file')) {
            return response()->json(['error' => 'No file uploaded'], 422);
        }

        $file = $request->file('file');
        if (!$file || !$file->isValid()) {
            return response()->json(['error' => 'Invalid file'], 422);
        }

        $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($file->getMimeType(), $allowed)) {
            return response()->json(['error' => 'Unsupported file type'], 422);
        }

        $uploadsPath = public_path('uploads');
        if (!file_exists($uploadsPath)) {
            @mkdir($uploadsPath, 0755, true);
        }

        $ext = $file->getClientOriginalExtension() ?: 'jpg';
        $filename = Str::uuid()->toString() . '.' . $ext;
        $file->move($uploadsPath, $filename);

        $url = url('/uploads/' . $filename);
        return response()->json(['url' => $url]);
    }
}