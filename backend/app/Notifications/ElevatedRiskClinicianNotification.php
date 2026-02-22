<?php

namespace App\Notifications;

use App\Models\{ClinicianReview, RiskScore};
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

/**
 * Notifies clinician of an elevated UPRS case requiring human review.
 * Language is preventive, not diagnostic.
 */
class ElevatedRiskClinicianNotification extends Notification
{
    public function __construct(
        private readonly ClinicianReview $review,
        private readonly RiskScore $riskScore,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $tier  = strtoupper($this->riskScore->uprs_tier);
        $score = round($this->riskScore->uprs_score * 100, 1);

        return (new MailMessage)
            ->subject("[UPIP] Preventive Risk Alert — {$tier} Case Requires Review")
            ->greeting("Hello {$notifiable->name},")
            ->line("A patient has been flagged with an {$tier} Unified Preventive Risk Score ({$score}/100).")
            ->line("This is a probabilistic risk indicator, not a medical diagnosis.")
            ->line("Your clinical judgment is required before any action is taken.")
            ->action('Review Case', url("/clinician/cases/{$this->review->id}"))
            ->line('Case ID: ' . $this->review->id)
            ->line('**Important:** AI risk scores are probabilistic and must not be treated as diagnoses.');
    }
}

// ─── PatientReviewOutcomeNotification ─────────────────────────────────────────

namespace App\Notifications;

use App\Models\ClinicianReview;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

/**
 * Notifies patient of clinician review outcome.
 * Uses preventive, non-diagnostic language.
 */
class PatientReviewOutcomeNotification extends Notification
{
    public function __construct(private readonly ClinicianReview $review) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('[UPIP] Your Preventive Health Review Is Ready')
            ->greeting("Hello {$notifiable->name},");

        return match ($this->review->status) {
            'dismissed' => $message
                ->line('A member of our clinical team has reviewed your recent health data.')
                ->line('No immediate preventive action has been recommended at this time.')
                ->line('Continue your current health routine and keep syncing your data.'),

            'referred' => $message
                ->line('A member of our clinical team has reviewed your recent health data.')
                ->line('Based on your preventive risk profile, they recommend scheduling a consultation.')
                ->line($this->review->recommendation ?? 'Please contact your healthcare provider.')
                ->line('This is a preventive recommendation, not a diagnosis.'),

            'escalated' => $message
                ->line('A member of our clinical team has reviewed your recent health data.')
                ->line('Your case has been escalated for further preventive evaluation.')
                ->line('You may be contacted by a healthcare professional soon.'),

            default => $message->line('Your health review has been updated.'),
        };
    }
}
