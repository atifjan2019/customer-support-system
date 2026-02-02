# NativePHP Mobile Setup

This project now includes NativePHP Mobile scaffolding under `backend/nativephp/`.

## What this means
- The **mobile app runs the Laravel app on-device** with an embedded PHP runtime.
- The **existing React/Vite frontend is not used** by NativePHP; mobile screens should be built with Blade/Livewire or NativePHP Edge components.
- The backend API can still be reused for data access or background tasks.

## Prerequisites (macOS)
- Xcode installed (for iOS builds)
- Android Studio + Android SDK (for Android builds)
- Java 17+ (Android tooling)
- PHP 8.2+ (already required for Laravel)

## Configure the app ID
Set the bundle identifier in `backend/.env`:

```
NATIVEPHP_APP_ID=com.atifjan.customersupport
```

## Install NativePHP (already done here)
If you need to re-run or on a new machine:

```
cd backend
composer install
php artisan native:install both --no-interaction
```

## Run on device/emulator

```
cd backend
php artisan native:run
```

## Optional: Jump (fast device preview)

```
cd backend
composer require nativephp/mobile
php artisan native:jump
```

## Where to build mobile UI
- Blade templates: `backend/resources/views`
- NativePHP Edge components: see https://nativephp.com/docs/mobile/3/edge-components

The mobile layout uses an Edge top bar component via `<native:top-bar>`.

## Starter screens included
- Home: `/mobile`
- Login: `/mobile/login`
- Dashboard: `/mobile/dashboard`
- Leads: `/mobile/leads`
- Complaints: `/mobile/complaints`
- Lead create: `/mobile/leads/create`
- Lead detail: `/mobile/leads/{lead}`
- Complaints create: `/mobile/complaints/create`
- Complaints detail: `/mobile/complaints/{lead}`
- Settings: `/mobile/settings`

The dashboard uses the Laravel web session guard. Log in through the mobile form to access it.

## Push notifications
- Tap **Enable push notifications** in Settings to enroll the device.
- Tokens are stored in the `push_notification_tokens` table when the device returns a token.

## Offline sync snapshots
- Tap **Sync now** in Settings to cache a snapshot to `storage/app/mobile-sync`.
- The snapshot stores recent leads/complaints and total counts for quick offline access.

## Notes
- iOS builds require Xcode with a valid signing setup.
- Android builds require Android SDK + emulator/device configured.
- The mobile entrypoint is the Laravel app; ensure routes and views are mobile-ready.
