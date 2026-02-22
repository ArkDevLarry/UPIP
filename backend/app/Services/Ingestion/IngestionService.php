<?php

namespace App\Services\Ingestion;

use App\Models\{Observation, Device};
use App\Services\Consent\ConsentService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\{Log, DB};
use Carbon\Carbon;

class IngestionService
{
    // Accepted units per sub_type → canonical unit
    private const UNIT_MAP = [
        'heart_rate' => ['bpm' => 'bpm', 'beats/min' => 'bpm'],
        'hrv'        => ['ms' => 'ms', 'milliseconds' => 'ms'],
        'spo2'       => ['%' => '%', 'percent' => '%'],
        'glucose'    => ['mmol/L' => 'mmol/L', 'mg/dL' => 'mg/dL'],
        'bp'         => ['mmHg' => 'mmHg'],
        'steps'      => ['count' => 'count'],
        'sleep'      => ['minutes' => 'minutes', 'hours' => 'minutes'], // convert hours to minutes on ingest
        'temperature'=> ['°C' => '°C', 'celsius' => '°C'],
    ];

    private const SOURCE_RELIABILITY_MAP = [
        'ios'     => 'high',   // Apple HealthKit
        'android' => 'high',   // Health Connect
        'manual'  => 'medium',
        'unknown' => 'low',
    ];

    public function __construct(
        private readonly ConsentService $consentService,
        private readonly NormalizationService $normalization,
    ) {}

    /**
     * Validate, normalize, and persist an observation.
     */
    public function ingest(
        int $userId,
        string $type,
        array $payload,
        string $source = 'unknown',
        bool $encrypted = false,
    ): Observation {
        // Consent guard
        $this->consentService->requireConsent($userId, $type);

        // Validate timestamp
        $observedAt = $this->resolveTimestamp($payload['observed_at'] ?? null);

        // Normalize units
        $normalized = $this->normalization->normalize($type, $payload);

        // Confidence scoring
        $confidence = $this->computeConfidence($normalized, $source);

        return DB::transaction(function () use (
            $userId, $type, $normalized, $source, $encrypted, $observedAt, $confidence, $payload
        ) {
            return Observation::create([
                'id'                  => Str::uuid(),
                'user_id'             => $userId,
                'type'                => $type,
                'sub_type'            => $payload['sub_type'] ?? $type,
                'payload'             => $normalized,
                'unit'                => $normalized['unit'] ?? null,
                'confidence_score'    => $confidence,
                'source_reliability'  => self::SOURCE_RELIABILITY_MAP[$source] ?? 'low',
                'is_encrypted'        => $encrypted,
                'observed_at'         => $observedAt,
            ]);
        });
    }

    private function resolveTimestamp(?string $ts): Carbon
    {
        if (!$ts) {
            return now();
        }

        try {
            $dt = Carbon::parse($ts);
            // Reject future timestamps (allow 5 min clock skew)
            if ($dt->isAfter(now()->addMinutes(5))) {
                throw new \InvalidArgumentException('Timestamp is in the future.');
            }
            return $dt;
        } catch (\Exception $e) {
            throw new \InvalidArgumentException("Invalid timestamp: {$ts}");
        }
    }

    private function computeConfidence(array $normalized, string $source): float
    {
        $base = match ($source) {
            'ios', 'android' => 0.90,
            'manual'         => 0.75,
            default          => 0.50,
        };

        // Penalize missing values
        $missingCount = count(array_filter($normalized, fn ($v) => $v === null));
        $penalty = $missingCount * 0.05;

        return max(0.10, $base - $penalty);
    }
}
