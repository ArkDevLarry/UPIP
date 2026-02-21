<?php

namespace App\Services\Risk;

use App\Models\{Observation, Feature};
use Illuminate\Support\Collection;

class FeatureEngineeringService
{
    private const WINDOW_HOURS = 168; // 7-day default rolling window

    /**
     * Compute and persist feature set for a user.
     */
    public function compute(int $userId, int $windowHours = self::WINDOW_HOURS): Feature
    {
        $since = now()->subHours($windowHours);

        $wearable   = Observation::forUser($userId)->wearable()->where('observed_at', '>=', $since)->get();
        $behavioral = Observation::forUser($userId)->behavioral()->where('observed_at', '>=', $since)->get();

        $physiological = $this->computePhysiological($wearable);
        $behav         = $this->computeBehavioral($behavioral);
        $mental        = $this->computeMental($behavioral, $wearable);

        return Feature::create([
            'user_id'                    => $userId,
            'window_hours'               => $windowHours,
            'feature_set'                => array_merge($physiological, $behav, $mental),
            'resting_hr_baseline'        => $physiological['resting_hr_baseline'],
            'hrv_deviation'              => $physiological['hrv_deviation'],
            'sleep_efficiency'           => $physiological['sleep_efficiency'],
            'bp_slope'                   => $physiological['bp_slope'],
            'glucose_variability'        => $physiological['glucose_variability'],
            'movement_entropy'           => $behav['movement_entropy'],
            'social_withdrawal_index'    => $behav['social_withdrawal_index'],
            'rhythm_stability_index'     => $behav['rhythm_stability_index'],
            'stress_trend'               => $mental['stress_trend'],
            'behavioral_deviation_z_score' => $mental['behavioral_deviation_z_score'],
            'computed_at'                => now(),
        ]);
    }

    // ─── Physiological Features ───────────────────────────────────────────

    private function computePhysiological(Collection $obs): array
    {
        $hr      = $this->extractValues($obs, 'heart_rate');
        $hrv     = $this->extractValues($obs, 'hrv');
        $sleep   = $this->extractValues($obs, 'sleep');
        $glucose = $this->extractValues($obs, 'glucose');
        $bpSys   = $this->extractValues($obs, 'bp_systolic');

        return [
            'resting_hr_baseline'  => $hr->count()      ? round($hr->avg(), 2)            : null,
            'hrv_deviation'        => $hrv->count() > 1 ? round($this->stdDev($hrv), 4)   : null,
            'sleep_efficiency'     => $sleep->count()   ? $this->sleepEfficiency($sleep)   : null,
            'bp_slope'             => $bpSys->count() > 2 ? $this->linearSlope($bpSys)    : null,
            'glucose_variability'  => $glucose->count() > 1 ? round($this->cv($glucose), 4) : null,
        ];
    }

    private function computeBehavioral(Collection $obs): array
    {
        $steps       = $this->extractValues($obs, 'step_count');
        $social      = $this->extractValues($obs, 'social_events');
        $activeMin   = $this->extractValues($obs, 'active_minutes');

        return [
            'movement_entropy'        => $steps->count() > 1 ? $this->entropy($steps) : null,
            'social_withdrawal_index' => $this->socialWithdrawalIndex($social),
            'rhythm_stability_index'  => $activeMin->count() > 1 ? 1 - $this->cv($activeMin) : null,
        ];
    }

    private function computeMental(Collection $behavioral, Collection $wearable): array
    {
        $hrv   = $this->extractValues($wearable, 'hrv');
        $sleep = $this->extractValues($wearable, 'sleep');

        // Stress proxy: inverse HRV trend + sleep deficit
        $stressTrend = null;
        if ($hrv->count() > 1) {
            $slope = $this->linearSlope($hrv);
            $stressTrend = round(-$slope, 4); // declining HRV → higher stress
        }

        return [
            'stress_trend'                => $stressTrend,
            'behavioral_deviation_z_score' => $this->computeZScore($behavioral),
        ];
    }

    // ─── Math Helpers ─────────────────────────────────────────────────────

    private function extractValues(Collection $obs, string $subType): Collection
    {
        return $obs
            ->filter(fn ($o) => ($o->payload['sub_type'] ?? $o->sub_type) === $subType)
            ->pluck('payload.value')
            ->filter(fn ($v) => $v !== null)
            ->values();
    }

    private function stdDev(Collection $values): float
    {
        $mean = $values->avg();
        $variance = $values->map(fn ($v) => pow($v - $mean, 2))->avg();
        return sqrt($variance);
    }

    private function cv(Collection $values): float
    {
        $mean = $values->avg();
        return $mean > 0 ? $this->stdDev($values) / $mean : 0;
    }

    private function entropy(Collection $values): float
    {
        $total = $values->sum();
        if ($total === 0) return 0.0;
        return $values
            ->map(fn ($v) => ($v / $total) * log($v / $total + 1e-9))
            ->sum() * -1;
    }

    private function linearSlope(Collection $values): float
    {
        $n = $values->count();
        if ($n < 2) return 0.0;
        $x = collect(range(0, $n - 1));
        $xMean = $x->avg();
        $yMean = $values->avg();
        $num   = $x->zip($values)->map(fn ($pair) => ($pair[0] - $xMean) * ($pair[1] - $yMean))->sum();
        $den   = $x->map(fn ($xi) => pow($xi - $xMean, 2))->sum();
        return $den > 0 ? $num / $den : 0.0;
    }

    private function sleepEfficiency(Collection $sleepMinutes): float
    {
        $avg = $sleepMinutes->avg();
        // Target: 420 min (7 hours). Efficiency capped 0–1.
        return round(min(1.0, $avg / 420), 4);
    }

    private function socialWithdrawalIndex(Collection $socialEvents): ?float
    {
        if ($socialEvents->count() < 2) return null;
        $recent = $socialEvents->take(-3)->avg();
        $prior  = $socialEvents->take(3)->avg();
        if ($prior == 0) return 1.0;
        return round(1 - ($recent / $prior), 4);
    }

    private function computeZScore(Collection $obs): ?float
    {
        $vals = $this->extractValues($obs, 'active_minutes');
        if ($vals->count() < 3) return null;
        $last   = $vals->last();
        $mean   = $vals->avg();
        $std    = $this->stdDev($vals);
        return $std > 0 ? round(($last - $mean) / $std, 4) : 0.0;
    }
}
