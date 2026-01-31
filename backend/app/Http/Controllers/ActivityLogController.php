<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = ActivityLog::with('user');

        if ($user->role !== 'super_admin') {
            $query->whereHas('user', function($q) use ($user) {
                $q->where('company_id', $user->company_id);
            });
        }

        if ($request->has('date')) {
            $query->whereDate('created_at', $request->date);
        }

        return $query->latest()->paginate(50);
    }
}
