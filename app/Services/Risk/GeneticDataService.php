<?php

namespace App\Services\Risk;

use Illuminate\Support\Facades\{DB, Crypt, Log};
use App\Services\Consent\ConsentService;
use App\Enums\ConsentModule;

class GeneticDataService
{
    public function __construct(private readonly ConsentService $consentService) {}

    /**
     * Store genetic risk markers with field-level AES-256 encryption.
     * Consent for 'genetic' module is mandatory.
     */
    public function store(int $userId, array $data): void
    {
        $this->consentService->requireConsent($userId, ConsentModule::GENETIC->value);

        $markers = $data['markers'] ?? [];
        $polygenic = $data['polygenic_risk_scores'] ?? [];

        DB::table('genetic_data')->updateOrInsert(
            ['user_id' => $userId],
            [
                'markers_encrypted'          => Crypt::encryptString(json_encode($markers)),
                'polygenic_scores_encrypted' => Crypt::encryptString(json_encode($polygenic)),
                'modifier_score'             => $this->computeModifier($markers, $polygenic),
                'data_source'                => $data['source'] ?? 'patient_provided',
                'updated_at'                 => now(),
            ]
        );

        Log::channel('audit')->info('genetic_data_stored', [
            'user_id'  => $userId,
            'has_polygenic' => !empty($polygenic),
        ]);
    }

    /**
     * Retrieve and decrypt genetic data for a user.
     * Only callable by authenticated clinicians.
     */
    public function retrieve(int $userId): array
    {
        $record = DB::table('genetic_data')->where('user_id', $userId)->first();

        if (!$record) return [];

        return [
            'markers'               => json_decode(Crypt::decryptString($record->markers_encrypted), true),
            'polygenic_risk_scores' => json_decode(Crypt::decryptString($record->polygenic_scores_encrypted), true),
            'modifier_score'        => $record->modifier_score,
            'data_source'           => $record->data_source,
            'updated_at'            => $record->updated_at,
        ];
    }

    /**
     * Compute a genetic risk modifier (1.0 = neutral, >1 = elevated familial risk).
     */
    private function computeModifier(array $markers, array $polygenic): float
    {
        if (empty($markers) && empty($polygenic)) return 1.0;

        $modifier = 1.0;

        // High-risk marker bonus
        $highRiskMarkers = ['BRCA1', 'BRCA2', 'APOE4', 'FH'];
        foreach ($markers as $marker) {
            if (in_array($marker['gene'] ?? '', $highRiskMarkers)) {
                $modifier += 0.05;
            }
        }

        // Polygenic risk score contribution
        foreach ($polygenic as $trait => $score) {
            if ($score > 0.8) $modifier += 0.03;
        }

        return round(min(1.5, $modifier), 4); // cap at 1.5× modifier
    }
}
