<?php

namespace App\Http\Middleware;

use App\Models\AuditLog;
use Closure;
use Illuminate\Http\Request;

/**
 * Logs every API access to the audit_logs table for compliance.
 * Records: data access, inference calls, clinician decisions.
 */
class AuditLogMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Only log authenticated requests
        if (!auth()->check()) return $response;

        AuditLog::create([
            'user_id'       => auth()->id(),
            'actor_id'      => auth()->id(),
            'action'        => $this->resolveAction($request),
            'resource_type' => $this->resolveResourceType($request),
            'resource_id'   => $request->route('id') ?? $request->route('caseId'),
            'ip_address'    => $request->ip(),
            'user_agent'    => $request->userAgent(),
            'metadata'      => [
                'method'       => $request->method(),
                'path'         => $request->path(),
                'status_code'  => $response->getStatusCode(),
                'query_params' => $request->query(),
            ],
            'created_at'    => now(),
        ]);

        return $response;
    }

    private function resolveAction(Request $request): string
    {
        $method = $request->method();
        $path   = $request->path();

        return match (true) {
            str_contains($path, 'observations')   => "{$method}_observation",
            str_contains($path, 'risk')            => "{$method}_risk_data",
            str_contains($path, 'clinician/review')=> 'clinician_review_submitted',
            str_contains($path, 'consent')         => "{$method}_consent",
            str_contains($path, 'audit')           => 'audit_log_access',
            default                                 => strtolower($method) . '_request',
        };
    }

    private function resolveResourceType(Request $request): string
    {
        $path = $request->path();

        return match (true) {
            str_contains($path, 'observations') => 'Observation',
            str_contains($path, 'risk/genetic') => 'GeneticData',
            str_contains($path, 'risk')          => 'RiskScore',
            str_contains($path, 'clinician')     => 'ClinicianReview',
            str_contains($path, 'consent')       => 'ConsentRecord',
            str_contains($path, 'devices')       => 'Device',
            str_contains($path, 'users')         => 'User',
            default                               => 'Unknown',
        };
    }
}
