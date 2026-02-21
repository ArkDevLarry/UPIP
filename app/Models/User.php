<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\{HasMany, HasOne};
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Traits\HasRoles;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, HasRoles, SoftDeletes;

    protected $fillable = [
        'name', 'email', 'password', 'dob', 'gender', 'region',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'dob'               => 'date',
        ];
    }

    // JWTSubject
    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [
            'roles'  => $this->getRoleNames(),
            'region' => $this->region,
        ];
    }

    // Relations
    public function observations(): HasMany
    {
        return $this->hasMany(Observation::class);
    }

    public function devices(): HasMany
    {
        return $this->hasMany(Device::class);
    }

    public function consentRecords(): HasMany
    {
        return $this->hasMany(ConsentRecord::class);
    }

    public function riskScores(): HasMany
    {
        return $this->hasMany(RiskScore::class);
    }

    public function latestRiskScore(): HasOne
    {
        return $this->hasOne(RiskScore::class)->latestOfMany('computed_at');
    }

    public function riskHistory(): HasMany
    {
        return $this->hasMany(RiskHistory::class);
    }

    public function features(): HasMany
    {
        return $this->hasMany(Feature::class);
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    public function clinicianReviews(): HasMany
    {
        return $this->hasMany(ClinicianReview::class, 'patient_id');
    }
}
