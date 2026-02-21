<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Device;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeviceController extends Controller
{
    /**
     * POST /devices
     * Register iOS/Android device.
     */
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'platform'         => 'required|in:ios,android',
            'device_id'        => 'required|string|max:255',
            'device_name'      => 'nullable|string|max:255',
            'os_version'       => 'nullable|string|max:50',
            'app_version'      => 'nullable|string|max:50',
            'health_api'       => 'nullable|string', // HealthKit, HealthConnect, GoogleFit
            'push_token'       => 'nullable|string',
        ]);

        $device = Device::updateOrCreate(
            [
                'user_id'   => auth()->id(),
                'device_id' => $request->device_id,
            ],
            [
                'platform'    => $request->platform,
                'device_name' => $request->device_name,
                'os_version'  => $request->os_version,
                'app_version' => $request->app_version,
                'health_api'  => $request->health_api,
                'push_token'  => $request->push_token,
                'last_seen_at' => now(),
                'is_active'   => true,
            ]
        );

        return response()->json([
            'message' => 'Device registered.',
            'data'    => $device,
        ], 201);
    }

    /**
     * GET /devices
     */
    public function index(): JsonResponse
    {
        $devices = Device::where('user_id', auth()->id())
            ->where('is_active', true)
            ->get();

        return response()->json(['data' => $devices]);
    }

    /**
     * DELETE /devices/{id}
     */
    public function unregister(string $id): JsonResponse
    {
        $device = Device::where('user_id', auth()->id())->findOrFail($id);
        $device->update(['is_active' => false]);

        return response()->json(['message' => 'Device unregistered.']);
    }
}
