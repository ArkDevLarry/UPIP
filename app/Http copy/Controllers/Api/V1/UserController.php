<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\{User, AuditLog};
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function profile(): JsonResponse
    {
        $user = auth()->user()->load(['roles', 'devices', 'latestRiskScore']);
        return response()->json(['data' => $user]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $request->validate([
            'name'   => 'sometimes|string|max:255',
            'dob'    => 'sometimes|date',
            'gender' => 'sometimes|in:male,female,other,prefer_not_to_say',
            'region' => 'sometimes|string|size:2',
        ]);

        auth()->user()->update($request->only(['name', 'dob', 'gender', 'region']));

        return response()->json(['message' => 'Profile updated.', 'data' => auth()->user()]);
    }
}

// ─── AuditController ──────────────────────────────────────────────────────────

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditController extends Controller
{
    /**
     * GET /audit-logs  (own user)
     */
    public function index(Request $request): JsonResponse
    {
        $logs = AuditLog::where('user_id', auth()->id())
            ->latest()
            ->paginate($request->per_page ?? 30);

        return response()->json(['data' => $logs]);
    }

    /**
     * GET /admin/audit-logs  (admin)
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $logs = AuditLog::with('user:id,name,email')
            ->when($request->user_id, fn ($q, $u) => $q->where('user_id', $u))
            ->when($request->action,  fn ($q, $a) => $q->where('action', $a))
            ->when($request->from,    fn ($q, $f) => $q->where('created_at', '>=', $f))
            ->latest()
            ->paginate($request->per_page ?? 50);

        return response()->json(['data' => $logs]);
    }
}
