<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $query = ActivityLog::with('user');

        if ($user->role !== 'super_admin') {
            $query->whereHas('user', function($q) use ($user) {
                $q->where('company_id', $user->company_id);
            });
        }

        return $query->latest()->paginate(50);
    }
}
