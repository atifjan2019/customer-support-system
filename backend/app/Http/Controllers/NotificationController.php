<?php

namespace App\Http\Controllers;

use App\Models\NotificationLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        return Auth::user()->notifications()->latest()->paginate(20);
    }

    public function markAsRead($id)
    {
        $notification = NotificationLog::where('user_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();
            
        $notification->update(['is_read' => true]);
        
        return response()->json($notification);
    }
    
    public function markAllAsRead()
    {
        Auth::user()->notifications()->update(['is_read' => true]);
        return response()->json(['message' => 'All notifications marked as read']);
    }
}
