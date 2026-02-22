<?php

namespace App\Enums;

enum RiskTier: string
{
    case LOW      = 'low';
    case MODERATE = 'moderate';
    case ELEVATED = 'elevated';

    public function requiresClinicianReview(): bool
    {
        return $this === self::ELEVATED;
    }

    public function color(): string
    {
        return match ($this) {
            self::LOW      => '#22c55e',
            self::MODERATE => '#f59e0b',
            self::ELEVATED => '#ef4444',
        };
    }
}
