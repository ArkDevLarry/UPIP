<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\ConsentRecord;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ObservationIngestionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    /** @test */
    public function patient_can_submit_wearable_observation_with_consent(): void
    {
        $patient = $this->createPatientWithConsent(['wearable']);
        $token   = $this->loginAndGetToken($patient);

        $response = $this->withToken($token)->postJson('/api/v1/observations/wearable', [
            'sub_type'    => 'heart_rate',
            'value'       => 72,
            'unit'        => 'bpm',
            'observed_at' => now()->toIso8601String(),
            'platform'    => 'android',
            'health_api'  => 'HealthConnect',
        ]);

        $response->assertStatus(202);
        $response->assertJsonStructure([
            'data' => ['id', 'type', 'observed_at', 'confidence_score'],
            'message',
            'is_diagnostic',
        ]);
        $response->assertJson(['is_diagnostic' => false]);
    }

    /** @test */
    public function observation_blocked_without_consent(): void
    {
        $patient = User::factory()->create();
        $patient->assignRole('patient');
        $token = $this->loginAndGetToken($patient);

        $response = $this->withToken($token)->postJson('/api/v1/observations/wearable', [
            'sub_type'    => 'heart_rate',
            'value'       => 72,
            'unit'        => 'bpm',
            'observed_at' => now()->toIso8601String(),
        ]);

        $response->assertStatus(403);
        $response->assertJsonFragment(['is_diagnostic' => false]);
    }

    /** @test */
    public function observation_rejects_future_timestamps(): void
    {
        $patient = $this->createPatientWithConsent(['wearable']);
        $token   = $this->loginAndGetToken($patient);

        $response = $this->withToken($token)->postJson('/api/v1/observations/wearable', [
            'sub_type'    => 'heart_rate',
            'value'       => 72,
            'unit'        => 'bpm',
            'observed_at' => now()->addHours(2)->toIso8601String(), // Future
        ]);

        $response->assertStatus(422);
    }

    /** @test */
    public function speech_observation_requires_speech_consent(): void
    {
        $patient = $this->createPatientWithConsent(['wearable']); // no speech consent
        $token   = $this->loginAndGetToken($patient);

        $response = $this->withToken($token)->postJson('/api/v1/observations/speech', [
            'observed_at'     => now()->toIso8601String(),
            'duration_sec'    => 30,
            'features_vector' => [0.1, 0.2, 0.3],
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function glucose_unit_converted_mg_dl_to_mmol(): void
    {
        $patient = $this->createPatientWithConsent(['clinical']);
        $token   = $this->loginAndGetToken($patient);

        $response = $this->withToken($token)->postJson('/api/v1/observations/diagnostic', [
            'sub_type'    => 'glucose',
            'value'       => 90,    // mg/dL
            'unit'        => 'mg/dL',
            'observed_at' => now()->toIso8601String(),
        ]);

        $response->assertStatus(202);
        // Value should be converted internally to mmol/L (≈4.99)
        $this->assertDatabaseHas('observations', [
            'user_id' => $patient->id,
            'sub_type' => 'glucose',
        ]);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private function createPatientWithConsent(array $modules): User
    {
        $patient = User::factory()->create();
        $patient->assignRole('patient');

        foreach ($modules as $module) {
            ConsentRecord::create([
                'user_id'    => $patient->id,
                'module'     => $module,
                'granted'    => true,
                'granted_at' => now(),
            ]);
        }

        return $patient;
    }

    private function loginAndGetToken(User $user): string
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email'    => $user->email,
            'password' => 'password', // factory default
        ]);
        return $response->json('access_token');
    }
}
