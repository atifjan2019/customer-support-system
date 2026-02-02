<?php

namespace App\Listeners;

use App\Models\PushNotificationToken;
use Illuminate\Support\Facades\Auth;
use Native\Mobile\Events\PushNotification\TokenGenerated;

class StorePushNotificationToken
{
    public function handle(TokenGenerated $event): void
    {
        $userId = Auth::id();

        PushNotificationToken::updateOrCreate(
            ['token' => $event->token],
            [
                'user_id' => $userId,
                'platform' => null,
                'enrollment_id' => $event->id,
                'last_seen_at' => now(),
            ]
        );
    }
}
