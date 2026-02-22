<?php

namespace App\Services\Risk;

use App\Models\Feature;
use Illuminate\Support\Facades\{Http, Log, Cache};

class AIInferenceService
{
    private string $baseUrl;
    private string $token;

    public function __construct()
    {
        $this->baseUrl = config('upip.ai_service.url');
        $this->token   = config('upip.ai_service.token');
    }

    /**
     * POST /infer/anomaly
     */
    public function inferAnomaly(Feature $features): array
    {
        return $this->call('/infer/anomaly', $this->buildPayload($features));
    }

    /**
     * POST /infer/cardiovascular-risk
     */
    public function inferCardiovascularRisk(Feature $features): array
    {
        return $this->call('/infer/cardiovascular-risk', $this->buildPayload($features));
    }

    /**
     * POST /infer/metabolic-risk
     */
    public function inferMetabolicRisk(Feature $features): array
    {
        return $this->call('/infer/metabolic-risk', $this->buildPayload($features));
    }

    /**
     * POST /infer/mental-risk
     */
    public function inferMentalRisk(Feature $features): array
    {
        return $this->call('/infer/mental-risk', $this->buildPayload($features));
    }

    private function buildPayload(Feature $features): array
    {
        return [
            'user_id'                      => $features->user_id,
            'window_hours'                 => $features->window_hours,
            'resting_hr_baseline'          => $features->resting_hr_baseline,
            'hrv_deviation'                => $features->hrv_deviation,
            'sleep_efficiency'             => $features->sleep_efficiency,
            'bp_slope'                     => $features->bp_slope,
            'glucose_variability'          => $features->glucose_variability,
            'movement_entropy'             => $features->movement_entropy,
            'social_withdrawal_index'      => $features->social_withdrawal_index,
            'rhythm_stability_index'       => $features->rhythm_stability_index,
            'stress_trend'                 => $features->stress_trend,
            'behavioral_deviation_z_score' => $features->behavioral_deviation_z_score,
        ];
    }

    /**
     * HTTP call to Python AI service.
     * Returns: { probability, confidence_score, model_version, explanation_vector }
     */
    private function call(string $endpoint, array $payload): array
    {
        try {
            $response = Http::timeout(10)
                ->withToken($this->token)
                ->post($this->baseUrl . $endpoint, $payload);

            if ($response->failed()) {
                Log::error("AI service error [{$endpoint}]", [
                    'status'  => $response->status(),
                    'body'    => $response->body(),
                ]);
                return $this->fallbackResponse();
            }

            $data = $response->json();

            // Validate response shape
            if (!isset($data['probability'])) {
                Log::warning("AI service returned unexpected shape", ['endpoint' => $endpoint]);
                return $this->fallbackResponse();
            }

            return [
                'probability'        => (float) $data['probability'],
                'confidence_score'   => (float) ($data['confidence_score'] ?? 0.5),
                'model_version'      => $data['model_version'] ?? 'unknown',
                'explanation_vector' => $data['explanation_vector'] ?? [],
                'calibration_score'  => $data['calibration_score'] ?? null,
            ];
        } catch (\Exception $e) {
            Log::error("AI service exception [{$endpoint}]", ['error' => $e->getMessage()]);
            return $this->fallbackResponse();
        }
    }

    /**
     * Return a neutral fallback when AI service is unavailable.
     * Prevents system failure but flags low confidence.
     */
    private function fallbackResponse(): array
    {
        return [
            'probability'        => 0.5,
            'confidence_score'   => 0.0,
            'model_version'      => 'fallback',
            'explanation_vector' => [],
            'calibration_score'  => null,
        ];
    }
}
