<?php

// ─── RiskHistory ────────────────────────────────────────────────────────────

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RiskHistory extends Model
{
    protected $fillable = [
        'user_id', 'uprs_score', 'uprs_tier', 'cardiovascular_score',
        'metabolic_score', 'mental_score', 'model_version_id', 'computed_at',
    ];

    protected function casts(): array
    {
        return [
            'uprs_score'           => 'float',
            'cardiovascular_score' => 'float',
            'metabolic_score'      => 'float',
            'mental_score'         => 'float',
            'computed_at'          => 'datetime',
        ];
    }

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function modelVersion(): BelongsTo { return $this->belongsTo(ModelVersion::class); }
}