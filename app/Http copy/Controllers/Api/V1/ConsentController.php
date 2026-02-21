<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Consent\ConsentRequest;
use App\Services\Consent\ConsentService;
use App\Enums\ConsentModule;
use Illuminate\Http\JsonResponse;

class ConsentController extends Controller
{
    public function __construct(private readonly ConsentService $consentService) {}

    /**
     * GET /consent
     * List all consent records for authenticated user.
     */
    public function index(): JsonResponse
    {
        $consents = $this->consentService->getUserConsents(auth()->id());

        return response()->json([
            'data'    => $consents,
            'modules' => ConsentModule::cases(),
        ]);
    }

    /**
     * POST /consent
     * Grant consent for one or more modules.
     */
    public function store(ConsentRequest $request): JsonResponse
    {
        $records = $this->consentService->grant(
            userId: auth()->id(),
            modules: $request->modules,
            ipAddress: $request->ip(),
            userAgent: $request->userAgent(),
        );

        return response()->json([
            'message' => 'Consent recorded.',
            'data'    => $records,
        ], 201);
    }

    /**
     * DELETE /consent/{module}
     * Revoke consent for a specific module.
     * This stops all processing for that module immediately.
     */
    public function revoke(string $module): JsonResponse
    {
        try {
            $moduleEnum = ConsentModule::from($module);
        } catch (\ValueError) {
            return response()->json(['message' => "Invalid module: {$module}."], 422);
        }

        $this->consentService->revoke(
            userId: auth()->id(),
            module: $moduleEnum,
            ipAddress: request()->ip(),
        );

        return response()->json([
            'message' => "Consent for '{$module}' revoked. Processing of this data type has been stopped.",
        ]);
    }
}
