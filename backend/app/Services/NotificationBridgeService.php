<?php

namespace App\Services;

use App\Models\Lead;
use App\Models\NotificationLog;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class NotificationBridgeService
{
    /**
     * Send an email / SMS notification bridge
     */
    public static function bridge($userId, $title, $message, $type = 'info')
    {
        $user = User::find($userId);
        if (!$user) return;

        // 1. Always create internal notification
        NotificationLog::create([
            'user_id' => $user->id,
            'title' => $title,
            'message' => $message,
            'type' => $type,
        ]);

        // 2. Bridge to Email (System Log only for demo)
        Log::info("EMAIL BRIDGE: To: {$user->email} | Subject: {$title} | Body: {$message}");

        // 3. Bridge to SMS if urgent
        if ($type === 'danger' && $user->phone) {
            Log::info("SMS BRIDGE: To: {$user->phone} | Body: Alert! {$message}");
        }
    }

    /**
     * Check for SLA violations and alert admins
     */
    public static function checkSLAViolations()
    {
        $overdueLeads = Lead::where('status', '!=', 'resolved')
            ->where('created_at', '<=', now()->subHours(24))
            ->get();

        foreach ($overdueLeads as $lead) {
            $admins = User::where('role', 'super_admin')->get();
            foreach ($admins as $admin) {
                self::bridge(
                    $admin->id,
                    "🚨 SLA VIOLATION: {$lead->customer_name}",
                    "Lead #{$lead->id} has exceeded the 24-hour limit and is still {$lead->status}.",
                    'danger'
                );
            }
        }
    }
}
