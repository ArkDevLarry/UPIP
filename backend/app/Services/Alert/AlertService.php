<?php

namespace App\Services\Alert;

use App\Models\{RiskScore, ClinicianReview, User, Alert};
use App\Enums\RiskTier;
use Illuminate\Support\Facades\{Mail, Notification, Log, DB};
use App\Notifications\{ElevatedRiskClinicianNotification, PatientReviewOutcomeNotification};

class AlertService
{
    /**
     * Evaluate a risk score and trigger human-in-the-loop if elevated.
     * AI cannot finalize medical decisions.
     */
    public function evaluateAndAlert(RiskScore $riskScore): void
    {
        $tier = RiskTier::from($riskScore->uprs_tier);

        if (!$tier->requiresClinicianReview()) {
            Log::info('UPRS non-elevated, no alert required.', [
                'user_id' => $riskScore->user_id,
                'tier'    => $tier->value,
            ]);
            return;
        }

        // Prevent duplicate open reviews
        $existing = ClinicianReview::where('patient_id', $riskScore->user_id)
            ->where('status', 'pending')
            ->exists();

        if ($existing) {
            Log::info('Elevated risk: clinician review already open.', [
                'user_id' => $riskScore->user_id,
            ]);
            return;
        }

        // Create clinician review case
        $review = ClinicianReview::create([
            'patient_id'    => $riskScore->user_id,
            'risk_score_id' => $riskScore->id,
            'status'        => 'pending',
            'priority'      => $this->computePriority($riskScore),
        ]);

        // Persist alert record
        DB::table('alerts')->insert([
            'user_id'             => $riskScore->user_id,
            'clinician_review_id' => $review->id,
            'type'                => 'elevated_uprs',
            'uprs_score'          => $riskScore->uprs_score,
            'notified_at'         => now(),
            'created_at'          => now(),
            'updated_at'          => now(),
        ]);

        // Notify assigned/available clinicians (NOT emergency services)
        $this->notifyClinicians($review, $riskScore);

        Log::warning('Elevated UPRS alert created.', [
            'user_id'   => $riskScore->user_id,
            'review_id' => $review->id,
            'uprs'      => $riskScore->uprs_score,
        ]);
    }

    /**
     * Notify patient after clinician review is submitted.
     * Uses non-diagnostic, preventive language.
     */
    public function notifyPatientOfReview(ClinicianReview $review): void
    {
        $patient = $review->patient;

        $patient->notify(new PatientReviewOutcomeNotification($review));
    }

    private function notifyClinicians(ClinicianReview $review, RiskScore $riskScore): void
    {
        $clinicians = User::role('clinician')->get();

        foreach ($clinicians as $clinician) {
            $clinician->notify(new ElevatedRiskClinicianNotification($review, $riskScore));
        }
    }

    private function computePriority(RiskScore $riskScore): string
    {
        return match (true) {
            $riskScore->uprs_score >= 0.90 => 'urgent',
            $riskScore->uprs_score >= 0.75 => 'high',
            default                         => 'normal',
        };
    }
}
