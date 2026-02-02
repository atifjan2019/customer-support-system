<?php

namespace App\Providers;

use App\Listeners\StorePushNotificationToken;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Native\Mobile\Events\PushNotification\TokenGenerated;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        TokenGenerated::class => [
            StorePushNotificationToken::class,
        ],
    ];
}
