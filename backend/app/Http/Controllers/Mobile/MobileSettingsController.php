<?php

namespace App\Http\Controllers\Mobile;

use App\Http\Controllers\Controller;
use App\Services\MobileSyncService;
use Illuminate\Http\Request;

class MobileSettingsController extends Controller
{
    public function index(MobileSyncService $syncService)
    {
        $user = auth()->user();
        $status = $syncService->statusFor($user);
        
        // Check if NativePHP is available
        $network = null;
        $pushToken = null;
        
        if (class_exists(\Native\Mobile\Facades\Network::class)) {
            $network = \Native\Mobile\Facades\Network::status();
        }
        
        if (class_exists(\Native\Mobile\Facades\PushNotifications::class)) {
            $pushToken = \Native\Mobile\Facades\PushNotifications::getToken();
        }

        return view('mobile.settings', [
            'pushToken' => $pushToken,
            'network' => $network,
            'syncStatus' => $status,
        ]);
    }

    public function enrollPush(Request $request)
    {
        if (class_exists(\Native\Mobile\Facades\PushNotifications::class)) {
            \Native\Mobile\Facades\PushNotifications::enroll()->id('user-'.$request->user()->id)->remember();
            return back()->with('status', 'Push enrollment requested.');
        }

        return back()->with('status', 'Push notifications not available (NativePHP not installed).');
    }

    public function sync(MobileSyncService $syncService, Request $request)
    {
        $syncService->syncFor($request->user());

        return back()->with('status', 'Sync completed.');
    }
}
