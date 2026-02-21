<?php

namespace App\Http\Requests\Observation;

use Illuminate\Foundation\Http\FormRequest;

/**
 * POST /observations/wearable
 * Supports iOS (HealthKit) and Android (Health Connect) payloads.
 */
class WearableObservationRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'sub_type'    => 'required|string|in:heart_rate,hrv,spo2,sleep,steps,temperature,bp_systolic,bp_diastolic',
            'value'       => 'required|numeric',
            'unit'        => 'required|string|max:20',
            'observed_at' => 'required|date|before_or_equal:now',
            'platform'    => 'nullable|string|in:ios,android',
            'health_api'  => 'nullable|string|in:HealthKit,HealthConnect,GoogleFit',
            'device_id'   => 'nullable|string|max:255',
        ];
    }
}

// ─── BehavioralObservationRequest ─────────────────────────────────────────────

namespace App\Http\Requests\Observation;

use Illuminate\Foundation\Http\FormRequest;

class BehavioralObservationRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'observed_at'       => 'required|date|before_or_equal:now',
            'sub_type'          => 'nullable|string|max:50',
            'step_count'        => 'nullable|integer|min:0',
            'active_minutes'    => 'nullable|integer|min:0',
            'sedentary_minutes' => 'nullable|integer|min:0',
            'social_events'     => 'nullable|integer|min:0',
            'screen_time_min'   => 'nullable|integer|min:0',
            'value'             => 'nullable|numeric',
            'unit'              => 'nullable|string|max:20',
        ];
    }
}

// ─── SpeechObservationRequest ─────────────────────────────────────────────────

namespace App\Http\Requests\Observation;

use Illuminate\Foundation\Http\FormRequest;

class SpeechObservationRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'observed_at'      => 'required|date|before_or_equal:now',
            'duration_sec'     => 'required|integer|min:1|max:600',
            'language'         => 'nullable|string|size:2',
            'features_vector'  => 'required|array',  // pre-extracted on device, never raw audio
            'features_vector.*'=> 'numeric',
        ];
    }
}

// ─── DiagnosticObservationRequest ─────────────────────────────────────────────

namespace App\Http\Requests\Observation;

use Illuminate\Foundation\Http\FormRequest;

class DiagnosticObservationRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'sub_type'        => 'required|string|in:blood_pressure,glucose,cholesterol,ecg,other',
            'value'           => 'required|numeric',
            'unit'            => 'required|string|max:20',
            'observed_at'     => 'required|date|before_or_equal:now',
            'loinc_code'      => 'nullable|string|max:30',
            'snomed_code'     => 'nullable|string|max:30',
            'reference_range' => 'nullable|array',
            'lab_name'        => 'nullable|string|max:255',
        ];
    }
}
