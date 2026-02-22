<?php

// ─── ClinicianReview ─────────────────────────────────────────────────────────

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, HasMany, HasOne};

class ClinicianReview extends Model
{
    protected $fillable = [
        'patient_id', 'clinician_id', 'risk_score_id',
        'status', 'priority', 'clinician_notes', 'recommendation',
        'follow_up_required', 'follow_up_date', 'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'follow_up_required' => 'boolean',
            'follow_up_date'     => 'date',
            'reviewed_at'        => 'datetime',
        ];
    }

    public function patient(): BelongsTo { return $this->belongsTo(User::class, 'patient_id'); }
    public function clinician(): BelongsTo { return $this->belongsTo(User::class, 'clinician_id'); }
    public function riskScore(): BelongsTo { return $this->belongsTo(RiskScore::class); }

    public function latestRiskScore(): HasOne
    {
        return $this->hasOne(RiskScore::class, 'user_id', 'patient_id')->latestOfMany('computed_at');
    }

    public function observations(): HasMany
    {
        return $this->hasMany(Observation::class, 'user_id', 'patient_id');
    }
}
