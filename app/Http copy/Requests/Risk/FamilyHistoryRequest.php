<?php
// ─── FamilyHistoryRequest ─────────────────────────────────────────────────────
namespace App\Http\Requests\Risk;

use Illuminate\Foundation\Http\FormRequest;

class FamilyHistoryRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'family_diabetes'        => 'nullable|boolean',
            'family_cardiovascular'  => 'nullable|boolean',
            'family_hypertension'    => 'nullable|boolean',
            'family_cancer'          => 'nullable|boolean',
            'family_mental_illness'  => 'nullable|boolean',
            'additional_conditions'  => 'nullable|array',
            'additional_conditions.*.condition' => 'required|string|max:100',
            'additional_conditions.*.relative'  => 'required|string|max:50',
        ];
    }
}

// ─── GeneticDataRequest ────────────────────────────────────────────────────────
namespace App\Http\Requests\Risk;

use Illuminate\Foundation\Http\FormRequest;

class GeneticDataRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'source'                      => 'nullable|string|in:patient_provided,lab_partner,research',
            'markers'                     => 'nullable|array',
            'markers.*.gene'              => 'required_with:markers|string|max:20',
            'markers.*.variant'           => 'nullable|string|max:50',
            'markers.*.risk_allele'       => 'nullable|string|max:10',
            'polygenic_risk_scores'       => 'nullable|array',
            'polygenic_risk_scores.*'     => 'numeric|min:0|max:1',
        ];
    }
}

// ─── ConsentRequest ────────────────────────────────────────────────────────────
namespace App\Http\Requests\Consent;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\ConsentModule;

class ConsentRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $validModules = array_column(ConsentModule::cases(), 'value');
        return [
            'modules'   => 'required|array|min:1',
            'modules.*' => 'required|string|in:' . implode(',', $validModules),
        ];
    }
}

// ─── ClinicianReviewRequest ────────────────────────────────────────────────────
namespace App\Http\Requests\Clinician;

use Illuminate\Foundation\Http\FormRequest;

class ClinicianReviewRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'decision'           => 'required|string|in:dismissed,escalated,referred',
            'notes'              => 'required|string|min:10|max:5000',
            'recommendation'     => 'nullable|string|max:5000',
            'follow_up_required' => 'nullable|boolean',
            'follow_up_date'     => 'nullable|date|after:today',
        ];
    }

    public function messages(): array
    {
        return [
            'decision.in' => 'Decision must be: dismissed, escalated, or referred. AI cannot finalize medical decisions.',
            'notes.min'   => 'Clinical notes must be at least 10 characters.',
        ];
    }
}

// ─── RegisterRequest ───────────────────────────────────────────────────────────
namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:10|confirmed',
            'dob'      => 'nullable|date|before:today',
            'gender'   => 'nullable|in:male,female,other,prefer_not_to_say',
            'region'   => 'nullable|string|size:2',
        ];
    }
}

// ─── LoginRequest ──────────────────────────────────────────────────────────────
namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'email'    => 'required|email',
            'password' => 'required|string',
        ];
    }
}
