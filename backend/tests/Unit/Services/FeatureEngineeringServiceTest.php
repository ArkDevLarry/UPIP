<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\Risk\FeatureEngineeringService;
use App\Models\{Observation, User};
use Illuminate\Foundation\Testing\RefreshDatabase;

class FeatureEngineeringServiceTest extends TestCase
{
    use RefreshDatabase;

    private FeatureEngineeringService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(FeatureEngineeringService::class);
    }

    /** @test */
    public function computes_resting_hr_baseline_from_wearable_observations(): void
    {
        $user = User::factory()->create();

        // Seed heart rate observations
        foreach ([68, 72, 70, 75, 69] as $hr) {
            Observation::create([
                'id'          => \Str::uuid(),
                'user_id'     => $user->id,
                'type'        => 'wearable',
                'sub_type'    => 'heart_rate',
                'payload'     => ['sub_type' => 'heart_rate', 'value' => $hr, 'unit' => 'bpm'],
                'unit'        => 'bpm',
                'observed_at' => now()->subHours(rand(1, 100)),
            ]);
        }

        $features = $this->service->compute($user->id);

        $this->assertNotNull($features->resting_hr_baseline);
        $this->assertEqualsWithDelta(70.8, $features->resting_hr_baseline, 0.5);
    }

    /** @test */
    public function sleep_efficiency_capped_at_one(): void
    {
        $user = User::factory()->create();

        // 8 hours sleep = 480 minutes → efficiency > 1 but capped
        Observation::create([
            'id'          => \Str::uuid(),
            'user_id'     => $user->id,
            'type'        => 'wearable',
            'sub_type'    => 'sleep',
            'payload'     => ['sub_type' => 'sleep', 'value' => 480, 'unit' => 'minutes'],
            'unit'        => 'minutes',
            'observed_at' => now()->subHours(10),
        ]);

        $features = $this->service->compute($user->id);

        $this->assertLessThanOrEqual(1.0, $features->sleep_efficiency);
    }

    /** @test */
    public function returns_null_features_when_insufficient_data(): void
    {
        $user     = User::factory()->create();
        $features = $this->service->compute($user->id);

        $this->assertNull($features->resting_hr_baseline);
        $this->assertNull($features->hrv_deviation);
        $this->assertNotNull($features->computed_at);
    }
}
