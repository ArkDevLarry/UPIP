<?php
// ─── ModelVersion ─────────────────────────────────────────────────────────────

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModelVersion extends Model
{
    protected $fillable = [
        'model_name', 'version', 'domain', 'description',
        'calibration_score', 'bias_test_passed', 'drift_threshold',
        'deployed_at', 'deprecated_at', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'calibration_score' => 'float',
            'drift_threshold'   => 'float',
            'bias_test_passed'  => 'boolean',
            'is_active'         => 'boolean',
            'deployed_at'       => 'datetime',
            'deprecated_at'     => 'datetime',
        ];
    }
}

