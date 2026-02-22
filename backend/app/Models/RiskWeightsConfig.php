<?php

// ─── RiskWeightsConfig ────────────────────────────────────────────────────────

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RiskWeightsConfig extends Model
{
    protected $fillable = [
        'cardiovascular_weight', 'metabolic_weight', 'mental_weight',
        'is_active', 'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'cardiovascular_weight' => 'float',
            'metabolic_weight'      => 'float',
            'mental_weight'         => 'float',
            'is_active'             => 'boolean',
        ];
    }

    public function updatedBy(): BelongsTo { return $this->belongsTo(User::class, 'updated_by'); }

    public static function getActive(): self
    {
        return static::where('is_active', true)->firstOrCreate([], [
            'cardiovascular_weight' => config('upip.uprs.cardio_weight', 0.40),
            'metabolic_weight'      => config('upip.uprs.metabolic_weight', 0.35),
            'mental_weight'         => config('upip.uprs.mental_weight', 0.25),
            'is_active'             => true,
        ]);
    }

    public static function updateActive(array $weights, int $updatedBy): self
    {
        static::where('is_active', true)->update(['is_active' => false]);
        return static::create(array_merge($weights, ['is_active' => true, 'updated_by' => $updatedBy]));
    }
}
