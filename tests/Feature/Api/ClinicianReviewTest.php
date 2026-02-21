<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\{User, ClinicianReview, RiskScore};
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ClinicianReviewTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    /** @test */
    public function clinician_can_fetch_pending_queue(): void
    {
        $clinician = User::where('email', 'clinician@upip.health')->first();
        $token     = $this->loginAndGetToken($clinician);

        $response = $this->withToken($token)->getJson('/api/v1/clinician/queue');

        $response->assertOk();
        $response->assertJsonStructure(['data', 'is_diagnostic', 'message']);
        $response->assertJson(['is_diagnostic' => false]);
    }

    /** @test */
    public function clinician_can_submit_review_decision(): void
    {
        $clinician = User::where('email', 'clinician@upip.health')->first();
        $patient   = User::factory()->create()->assignRole('patient');

        $riskScore = RiskScore::create([
            'user_id'    => $patient->id,
            'uprs_score' => 0.85,
            'uprs_tier'  => 'elevated',
            'computed_at'=> now(),
        ]);

        $review = ClinicianReview::create([
            'patient_id'    => $patient->id,
            'risk_score_id' => $riskScore->id,
            'status'        => 'pending',
            'priority'      => 'high',
        ]);

        $token = $this->loginAndGetToken($clinician);

        $response = $this->withToken($token)->postJson("/api/v1/clinician/review/{$review->id}", [
            'decision'       => 'referred',
            'notes'          => 'Patient shows preventive risk markers for cardiovascular disease. Lifestyle consultation recommended.',
            'recommendation' => 'Schedule cardiology consultation within 2 weeks.',
            'follow_up_required' => true,
            'follow_up_date'     => now()->addWeeks(2)->toDateString(),
        ]);

        $response->assertOk();
        $response->assertJson([
            'decision'      => 'referred',
            'is_diagnostic' => false,
        ]);

        $this->assertDatabaseHas('clinician_reviews', [
            'id'          => $review->id,
            'status'      => 'referred',
            'clinician_id'=> $clinician->id,
        ]);
    }

    /** @test */
    public function patient_cannot_access_clinician_routes(): void
    {
        $patient = User::factory()->create()->assignRole('patient');
        $token   = $this->loginAndGetToken($patient);

        $response = $this->withToken($token)->getJson('/api/v1/clinician/queue');

        $response->assertForbidden();
    }

    /** @test */
    public function clinician_review_requires_notes_minimum_length(): void
    {
        $clinician = User::where('email', 'clinician@upip.health')->first();
        $patient   = User::factory()->create()->assignRole('patient');

        $review = ClinicianReview::create([
            'patient_id' => $patient->id,
            'status'     => 'pending',
        ]);

        $token = $this->loginAndGetToken($clinician);

        $response = $this->withToken($token)->postJson("/api/v1/clinician/review/{$review->id}", [
            'decision' => 'dismissed',
            'notes'    => 'short',  // Too short - minimum 10 chars
        ]);

        $response->assertStatus(422);
    }

    private function loginAndGetToken(User $user): string
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email'    => $user->email,
            'password' => 'password',
        ]);
        return $response->json('access_token');
    }
}
