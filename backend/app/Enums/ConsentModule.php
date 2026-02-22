<?php

namespace App\Enums;

enum ConsentModule: string
{
    case WEARABLE  = 'wearable';
    case BEHAVIORAL = 'behavioral';
    case SPEECH    = 'speech';
    case GENETIC   = 'genetic';
    case CLINICAL  = 'clinical';

    public function label(): string
    {
        return match ($this) {
            self::WEARABLE  => 'Wearable & Physiological Data',
            self::BEHAVIORAL => 'Behavioral Pattern Data',
            self::SPEECH    => 'Speech Analysis Data',
            self::GENETIC   => 'Genetic Risk Markers',
            self::CLINICAL  => 'Clinical & Diagnostic Data',
        };
    }

    public function isHighSensitivity(): bool
    {
        return in_array($this, [self::GENETIC, self::SPEECH]);
    }
}
