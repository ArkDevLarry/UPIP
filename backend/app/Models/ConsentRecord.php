<?php

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