<?php

namespace App\Jobs;

use App\Models\{Observation, RiskScore};
use App\Services\Risk\{RiskAggregationService, FeatureEngineeringService};
use App\Services\Alert\AlertService;
use App\Enums\RiskTier;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\{InteractsWithQueue, SerializesModels};
use Illuminate\Support\Facades\Log;

/**
 * Triggered after each observation ingestion.
 * Runs feature engineering → AI inference → UPRS computation → alert evaluation.
 */
class ProcessObservationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 60;
    public int $backoff = 10;

    public function __construct(private readonly Observation $observation) {}

    public function handle(
        RiskAggregationService $riskService,
        AlertService $alertService,
    ): void {
        $userId = $this->observation->user_id;

        Log::info("ProcessObservationJob: computing risk for user {$userId}");

        try {
            $uprs = $riskService->computeUPRS($userId);

            // Fetch freshly created score for alert evaluation
            $score = RiskScore::where('user_id', $userId)
                ->latest('computed_at')
                ->first();

            if ($score) {
                $alertService->evaluateAndAlert($score);
            }
        } catch (\Exception $e) {
            Log::error("ProcessObservationJob failed for user {$userId}", [
                'error' => $e->getMessage(),
            ]);
            $this->fail($e);
        }
    }

    public function failed(\Throwable $e): void
    {
        Log::error("ProcessObservationJob permanently failed", [
            'observation_id' => $this->observation->id,
            'user_id'        => $this->observation->user_id,
            'error'          => $e->getMessage(),
        ]);
    }
}
