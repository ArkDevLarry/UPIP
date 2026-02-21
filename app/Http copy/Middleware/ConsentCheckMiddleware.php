<?php

namespace App\Http\Middleware;

use App\Services\Consent\ConsentService;
use Closure;
use Illuminate\Http\Request;

/**
 * Checks for active consent before processing sensitive observation routes.
 * Blocks processing if consent is missing.
 */
class ConsentCheckMiddleware
{
    private const ROUTE_CONSENT_MAP = [
        'observations.wearable'   => 'wearable',
        'observations.behavioral' => 'behavioral',
        'observations.speech'     => 'speech',
        'observations.diagnostic' => 'clinical',
        'risk.genetic'            => 'genetic',
    ];

    public function __construct(private readonly ConsentService $consentService) {}

    public function handle(Request $request, Closure $next)
    {
        $routeName = $request->route()?->getName();
        $module    = self::ROUTE_CONSENT_MAP[$routeName] ?? null;

        if ($module && !$this->consentService->hasConsent(auth()->id(), $module)) {
            return response()->json([
                'message'       => "Consent for '{$module}' data processing is required.",
                'action'        => 'Grant consent at POST /v1/consent',
                'is_diagnostic' => false,
            ], 403);
        }

        return $next($request);
    }
}
