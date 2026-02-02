<?php

namespace App\Http\Controllers\Mobile;

use App\Http\Controllers\Controller;
use App\Services\MobileSyncService;
use Illuminate\Http\Request;
use Native\Mobile\Facades\Network;
use Native\Mobile\Facades\PushNotifications;

class MobileSettingsController extends Controller
{
    public function index(MobileSyncService $syncService)
    {
        $user = auth()->user();
        $status = $syncService->statusFor($user);
        $network = Network::status();

        return view('mobile.settings', [
            'pushToken' => PushNotifications::getToken(),
            'network' => $network,
            'syncStatus' => $status,
        ]);
    }

    public function enrollPush(Request $request)
    {
        PushNotifications::enroll()->id('user-'.$request->user()->id)->remember();

        return back()->with('status', 'Push enrollment requested.');
    }

    public function sync(MobileSyncService $syncService, Request $request)
    {
        $syncService->syncFor($request->user());

        return back()->with('status', 'Sync completed.');
    }
}
