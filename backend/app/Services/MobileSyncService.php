<?php

namespace App\Services;

use App\Models\Lead;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class MobileSyncService
{
    public function statusFor(User $user): array
    {
        $payload = $this->readPayload($user);

        return [
            'last_synced_at' => $payload['last_synced_at'] ?? null,
            'leads_count' => $payload['leads_count'] ?? 0,
            'complaints_count' => $payload['complaints_count'] ?? 0,
        ];
    }

    public function syncFor(User $user): array
    {
        $query = Lead::query();

        if ($user->role !== 'super_admin' && $user->company_id) {
            $query->where('company_id', $user->company_id);
        }

        $leads = (clone $query)->latest()->take(10)->get();
        $complaints = (clone $query)->where('lead_type', 'complaint')->latest()->take(10)->get();

        $payload = [
            'last_synced_at' => now()->toDateTimeString(),
            'leads_count' => $query->count(),
            'complaints_count' => (clone $query)->where('lead_type', 'complaint')->count(),
            'leads' => $leads->toArray(),
            'complaints' => $complaints->toArray(),
        ];

        Storage::disk('local')->put($this->pathFor($user), json_encode($payload, JSON_PRETTY_PRINT));

        return $payload;
    }

    private function readPayload(User $user): array
    {
        $path = $this->pathFor($user);

        if (! Storage::disk('local')->exists($path)) {
            return [];
        }

        $contents = Storage::disk('local')->get($path);

        return json_decode($contents, true) ?? [];
    }

    private function pathFor(User $user): string
    {
        return "mobile-sync/user-{$user->id}.json";
    }
}
