<?php

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