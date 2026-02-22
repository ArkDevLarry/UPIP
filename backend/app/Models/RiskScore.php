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

// ─── ConsentRecord ────────────────────────────────────────────────────────────

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConsentRecord extends Model
{
    protected $fillable = [
        'user_id', 'module', 'granted', 'granted_at', 'revoked_at',
        'ip_address', 'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'granted'    => 'boolean',
            'granted_at' => 'datetime',
            'revoked_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo { return $this->belongsTo(User::class); }

    public function scopeActive($q) { return $q->where('granted', true)->whereNull('revoked_at'); }
    public function scopeModule($q, string $module) { return $q->where('module', $module); }
}

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

// ─── AuditLog ─────────────────────────────────────────────────────────────────

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'user_id', 'actor_id', 'action', 'resource_type', 'resource_id',
        'ip_address', 'user_agent', 'metadata', 'created_at',
    ];

    protected function casts(): array
    {
        return [
            'metadata'   => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function actor(): BelongsTo { return $this->belongsTo(User::class, 'actor_id'); }
}

// ─── Device ──────────────────────────────────────────────────────────────────

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Device extends Model
{
    protected $fillable = [
        'user_id', 'platform', 'device_id', 'device_name',
        'os_version', 'app_version', 'health_api', 'push_token',
        'is_active', 'last_seen_at',
    ];

    protected function casts(): array
    {
        return [
            'is_active'    => 'boolean',
            'last_seen_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
}

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
