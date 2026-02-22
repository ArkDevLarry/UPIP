<?php

namespace App\Models;

use Illuminate\Database\Eloquent\{Model, Builder};
use Illuminate\Database\Eloquent\Relations\{BelongsTo, HasOne};

class RiskScore extends Model
{
    protected $fillable = [
        'user_id', 'cardiovascular_score', 'metabolic_score', 'mental_score',
        'genetic_modifier', 'uprs_score', 'uprs_tier',
        'model_version_id', 'calibration_score', 'confidence_score',
        'explanation_vector', 'computed_at', 'drift_flag',
    ];

    protected function casts(): array
    {
        return [
            'cardiovascular_score' => 'float',
            'metabolic_score'      => 'float',
            'mental_score'         => 'float',
            'genetic_modifier'     => 'float',
            'uprs_score'           => 'float',
            'calibration_score'    => 'float',
            'confidence_score'     => 'float',
            'explanation_vector'   => 'array',
            'drift_flag'           => 'boolean',
            'computed_at'          => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function modelVersion(): BelongsTo
    {
        return $this->belongsTo(ModelVersion::class);
    }

    public function clinicianReview(): HasOne
    {
        return $this->hasOne(ClinicianReview::class);
    }

    /**
     * Computed tier label from config thresholds.
     */
    public function getTierAttribute(): string
    {
        return match (true) {
            $this->uprs_score <= config('upip.uprs.low_threshold')      => 'low',
            $this->uprs_score <= config('upip.uprs.moderate_threshold') => 'moderate',
            default                                                       => 'elevated',
        };
    }
}