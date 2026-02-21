<?php

namespace App\Services\Risk;

use App\Models\{RiskScore, RiskHistory, RiskWeightsConfig, ModelVersion};
use App\Enums\RiskTier;

class RiskAggregationService
{
    public function __construct(
        private readonly AIInferenceService $aiService,
        private readonly FeatureEngineeringService $featureService,
    ) {}

    /**
     * Compute the Unified Preventive Risk Score.
     *
     * UPRS = weighted_sum(cardio, metabolic, mental) × genetic_modifier
     */
    public function computeUPRS(int $userId): array
    {
        // 1. Compute fresh features
        $features = $this->featureService->compute($userId);

        // 2. Call AI inference for each domain
        $cardio    = $this->aiService->inferCardiovascularRisk($features);
        $metabolic = $this->aiService->inferMetabolicRisk($features);
        $mental    = $this->aiService->inferMentalRisk($features);
        $anomaly   = $this->aiService->inferAnomaly($features);

        // 3. Fetch configurable weights
        $weights  = RiskWeightsConfig::getActive();

        // 4. Genetic modifier (default 1.0 if no genetic data)
        $genetic  = $this->getGeneticModifier($userId);

        // 5. Weighted sum
        $rawScore = (
            ($cardio['probability']    * $weights->cardiovascular_weight) +
            ($metabolic['probability'] * $weights->metabolic_weight) +
            ($mental['probability']    * $weights->mental_weight)
        ) * $genetic;

        $uprsTier = $this->resolveTier($rawScore);

        // 6. Get active model version
        $modelVersion = ModelVersion::where('is_active', true)->latest()->first();

        // 7. Persist
        $score = RiskScore::create([
            'user_id'              => $userId,
            'cardiovascular_score' => $cardio['probability'],
            'metabolic_score'      => $metabolic['probability'],
            'mental_score'         => $mental['probability'],
            'genetic_modifier'     => $genetic,
            'uprs_score'           => round($rawScore, 6),
            'uprs_tier'            => $uprsTier->value,
            'model_version_id'     => $modelVersion?->id,
            'calibration_score'    => $cardio['calibration_score'] ?? null,
            'confidence_score'     => $this->avgConfidence($cardio, $metabolic, $mental),
            'explanation_vector'   => [
                'cardiovascular' => $cardio['explanation_vector'] ?? [],
                'metabolic'      => $metabolic['explanation_vector'] ?? [],
                'mental'         => $mental['explanation_vector'] ?? [],
                'anomaly'        => $anomaly,
            ],
            'computed_at'          => now(),
        ]);

        // 8. Longitudinal history snapshot
        RiskHistory::create([
            'user_id'              => $userId,
            'uprs_score'           => $score->uprs_score,
            'uprs_tier'            => $score->uprs_tier,
            'cardiovascular_score' => $score->cardiovascular_score,
            'metabolic_score'      => $score->metabolic_score,
            'mental_score'         => $score->mental_score,
            'model_version_id'     => $modelVersion?->id,
            'computed_at'          => now(),
        ]);

        return [
            'uprs_score'           => $score->uprs_score,
            'uprs_tier'            => $score->uprs_tier,
            'cardiovascular_score' => $score->cardiovascular_score,
            'metabolic_score'      => $score->metabolic_score,
            'mental_score'         => $score->mental_score,
            'genetic_modifier'     => $score->genetic_modifier,
            'confidence_score'     => $score->confidence_score,
            'explanation_vector'   => $score->explanation_vector,
            'computed_at'          => $score->computed_at,
            'model_version'        => $modelVersion?->version,
        ];
    }

    public function storeFamilyHistory(int $userId, array $data): void
    {
        // Store in behavioral_metrics or separate family_histories table
        \DB::table('family_histories')->updateOrInsert(
            ['user_id' => $userId],
            array_merge($data, ['updated_at' => now()])
        );
    }

    private function resolveTier(float $score): RiskTier
    {
        return match (true) {
            $score <= config('upip.uprs.low_threshold', 0.33)      => RiskTier::LOW,
            $score <= config('upip.uprs.moderate_threshold', 0.66) => RiskTier::MODERATE,
            default                                                  => RiskTier::ELEVATED,
        };
    }

    private function getGeneticModifier(int $userId): float
    {
        $genetic = \DB::table('genetic_data')
            ->where('user_id', $userId)
            ->value('modifier_score');

        return $genetic ?? 1.0;
    }

    private function avgConfidence(array ...$inferences): float
    {
        $scores = array_map(fn ($i) => $i['confidence_score'] ?? 0.5, $inferences);
        return round(array_sum($scores) / count($scores), 4);
    }
}
