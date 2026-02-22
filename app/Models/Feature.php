<?php

// ─── Feature ─────────────────────────────────────────────────────────────────

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Feature extends Model
{
    protected $fillable = [
        'user_id', 'window_hours', 'feature_set',
        'resting_hr_baseline', 'hrv_deviation', 'sleep_efficiency',
        'bp_slope', 'glucose_variability',
        'movement_entropy', 'social_withdrawal_index', 'rhythm_stability_index',
        'stress_trend', 'behavioral_deviation_z_score',
        'computed_at',
    ];

    protected function casts(): array
    {
        return [
            'feature_set'   => 'array',
            'computed_at'   => 'datetime',
        ];
    }

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
}