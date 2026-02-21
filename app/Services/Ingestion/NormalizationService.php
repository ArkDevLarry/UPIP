<?php

namespace App\Services\Ingestion;

use Illuminate\Support\Facades\Log;

class NormalizationService
{
    /**
     * Normalize observation payload to canonical FHIR-inspired schema.
     */
    public function normalize(string $type, array $payload): array
    {
        return match ($type) {
            'wearable'   => $this->normalizeWearable($payload),
            'behavioral' => $this->normalizeBehavioral($payload),
            'speech'     => $this->normalizeSpeech($payload),
            'diagnostic' => $this->normalizeDiagnostic($payload),
            default      => $payload,
        };
    }

    private function normalizeWearable(array $p): array
    {
        $subType = $p['sub_type'] ?? 'unknown';

        $normalized = [
            'resource_type'    => 'Observation',
            'sub_type'         => $subType,
            'value'            => $p['value'] ?? null,
            'unit'             => $this->canonicalUnit($subType, $p['unit'] ?? null),
            'device_platform'  => $p['platform'] ?? null,
            'health_api'       => $p['health_api'] ?? null,
            'raw_value'        => $p['value'] ?? null,
            'raw_unit'         => $p['unit'] ?? null,
        ];

        // Unit conversion
        if ($subType === 'sleep' && ($p['unit'] ?? null) === 'hours') {
            $normalized['value'] = ($p['value'] ?? 0) * 60;
            $normalized['unit']  = 'minutes';
        }

        // Glucose unit conversion mg/dL → mmol/L
        if ($subType === 'glucose' && ($p['unit'] ?? null) === 'mg/dL') {
            $normalized['value'] = round(($p['value'] ?? 0) / 18.01559, 2);
            $normalized['unit']  = 'mmol/L';
        }

        return $normalized;
    }

    private function normalizeBehavioral(array $p): array
    {
        return [
            'resource_type'    => 'Observation',
            'sub_type'         => $p['sub_type'] ?? 'behavioral',
            'value'            => $p['value'] ?? null,
            'unit'             => $p['unit'] ?? null,
            'metrics'          => [
                'step_count'       => $p['step_count'] ?? null,
                'active_minutes'   => $p['active_minutes'] ?? null,
                'sedentary_minutes'=> $p['sedentary_minutes'] ?? null,
                'social_events'    => $p['social_events'] ?? null,
                'screen_time_min'  => $p['screen_time_min'] ?? null,
            ],
        ];
    }

    private function normalizeSpeech(array $p): array
    {
        // Speech data is stored encrypted — we only normalize metadata here.
        return [
            'resource_type'   => 'Observation',
            'sub_type'        => 'speech',
            'duration_sec'    => $p['duration_sec'] ?? null,
            'language'        => $p['language'] ?? 'en',
            'features_vector' => $p['features_vector'] ?? null, // pre-extracted on device
            'encrypted'       => true,
        ];
    }

    private function normalizeDiagnostic(array $p): array
    {
        return [
            'resource_type'   => 'Observation',
            'sub_type'        => $p['sub_type'] ?? 'diagnostic',
            'value'           => $p['value'] ?? null,
            'unit'            => $p['unit'] ?? null,
            'loinc_code'      => $p['loinc_code'] ?? null,
            'snomed_code'     => $p['snomed_code'] ?? null,
            'reference_range' => $p['reference_range'] ?? null,
            'lab_name'        => $p['lab_name'] ?? null,
        ];
    }

    private function canonicalUnit(string $subType, ?string $unit): ?string
    {
        $map = [
            'heart_rate' => ['bpm', 'beats/min'],
            'hrv'        => ['ms', 'milliseconds'],
            'spo2'       => ['%', 'percent'],
            'steps'      => ['count'],
            'glucose'    => ['mmol/L', 'mg/dL'],
            'bp'         => ['mmHg'],
            'sleep'      => ['minutes', 'hours'],
            'temperature'=> ['°C', 'celsius'],
        ];

        $canonical = [
            'heart_rate' => 'bpm',
            'hrv'        => 'ms',
            'spo2'       => '%',
            'steps'      => 'count',
            'glucose'    => 'mmol/L',
            'bp'         => 'mmHg',
            'sleep'      => 'minutes',
            'temperature'=> '°C',
        ];

        return $canonical[$subType] ?? $unit;
    }
}
