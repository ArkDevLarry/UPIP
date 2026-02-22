<?php

return [

    /*
    |--------------------------------------------------------------------------
    | AI Inference Service (Python FastAPI)
    |--------------------------------------------------------------------------
    */
    'ai_service' => [
        'url'     => env('AI_SERVICE_URL', 'http://localhost:8001'),
        'token'   => env('AI_SERVICE_TOKEN'),
        'timeout' => 10,
        'retry'   => 2,
    ],

    /*
    |--------------------------------------------------------------------------
    | UPRS Score Thresholds
    |--------------------------------------------------------------------------
    | UPRS = weighted_sum(cardio, metabolic, mental) × genetic_modifier
    */
    'uprs' => [
        'low_threshold'      => (float) env('UPRS_LOW_THRESHOLD', 0.33),
        'moderate_threshold' => (float) env('UPRS_MODERATE_THRESHOLD', 0.66),
        'cardio_weight'      => (float) env('UPRS_CARDIO_WEIGHT', 0.40),
        'metabolic_weight'   => (float) env('UPRS_METABOLIC_WEIGHT', 0.35),
        'mental_weight'      => (float) env('UPRS_MENTAL_WEIGHT', 0.25),
    ],

    /*
    |--------------------------------------------------------------------------
    | Governance
    |--------------------------------------------------------------------------
    | System must always return these metadata fields.
    */
    'governance' => [
        'is_diagnostic' => false,
        'disclaimer'    => 'Risk scores are probabilistic and not medical diagnoses.',
        'system_roles'  => [
            'AI'       => 'Detect',
            'Human'    => 'Interpret',
            'System'   => 'Inform',
            'Clinician'=> 'Decide',
            'User'     => 'Prevent',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Feature Engineering
    |--------------------------------------------------------------------------
    */
    'features' => [
        'default_window_hours' => 168, // 7-day rolling window
        'min_observations'     => 5,   // Minimum observations for reliable features
    ],

    /*
    |--------------------------------------------------------------------------
    | Encryption
    |--------------------------------------------------------------------------
    | Field-level encryption for genetic_data and speech_data.
    */
    'encryption' => [
        'genetic_key' => env('GENETIC_ENCRYPTION_KEY'),
        'speech_key'  => env('SPEECH_ENCRYPTION_KEY'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Phase Build Priority
    |--------------------------------------------------------------------------
    */
    'enabled_modules' => [
        'wearable'   => true,   // Phase 1
        'cardio'     => true,   // Phase 1
        'anomaly'    => true,   // Phase 1
        'behavioral' => env('ENABLE_BEHAVIORAL', false),  // Phase 2
        'speech'     => env('ENABLE_SPEECH', false),      // Phase 3
        'genetic'    => env('ENABLE_GENETIC', false),     // Phase 4
    ],

];
