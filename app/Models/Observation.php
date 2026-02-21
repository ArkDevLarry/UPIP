<?php

namespace App\Models;

use Illuminate\Database\Eloquent\{Model, Builder};
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * FHIR-inspired Observation model.
 *
 * @property string   $id
 * @property int      $user_id
 * @property int|null $device_id
 * @property string   $type          wearable|behavioral|speech|diagnostic
 * @property string   $sub_type      heart_rate|hrv|spo2|sleep|steps|glucose|bp|...
 * @property array    $payload       Normalized FHIR-inspired payload
 * @property string   $unit
 * @property float    $confidence_score
 * @property string   $source_reliability  high|medium|low
 * @property bool     $is_encrypted
 * @property string   $observed_at
 */
class Observation extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 'user_id', 'device_id', 'type', 'sub_type',
        'payload', 'unit', 'confidence_score', 'source_reliability',
        'is_encrypted', 'observed_at', 'processed_at',
    ];

    protected function casts(): array
    {
        return [
            'payload'          => 'array',
            'is_encrypted'     => 'boolean',
            'confidence_score' => 'float',
            'observed_at'      => 'datetime',
            'processed_at'     => 'datetime',
        ];
    }

    // Scopes
    public function scopeWearable(Builder $q): Builder
    {
        return $q->where('type', 'wearable');
    }

    public function scopeBehavioral(Builder $q): Builder
    {
        return $q->where('type', 'behavioral');
    }

    public function scopeRecent(Builder $q, int $days = 7): Builder
    {
        return $q->where('observed_at', '>=', now()->subDays($days));
    }

    public function scopeForUser(Builder $q, int $userId): Builder
    {
        return $q->where('user_id', $userId);
    }

    // Relations
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }
}
