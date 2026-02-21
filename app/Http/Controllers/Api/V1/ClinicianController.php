<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Clinician\ClinicianReviewRequest;
use App\Models\{ClinicianReview, User, RiskHistory};
use App\Services\Alert\AlertService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClinicianController extends Controller
{
    public function __construct(private readonly AlertService $alertService) {}

    /**
     * GET /clinician/queue
     * All pending elevated cases requiring review.
     */
    public function queue(Request $request): JsonResponse
    {
        $cases = ClinicianReview::with(['patient:id,name,dob,gender,region', 'latestRiskScore'])
            ->where('status', 'pending')
            ->when($request->priority, fn ($q, $p) => $q->where('priority', $p))
            ->latest('created_at')
            ->paginate($request->per_page ?? 20);

        return response()->json([
            'data'         => $cases,
            'is_diagnostic' => false,
            'message'      => 'Risk scores are probabilistic and not medical diagnoses.',
        ]);
    }

    /**
     * GET /clinician/cases/{caseId}
     * Full case detail including risk history, features, SHAP explanation.
     */
    public function show(string $caseId): JsonResponse
    {
        $case = ClinicianReview::with([
            'patient',
            'riskScore',
            'observations' => fn ($q) => $q->latest('observed_at')->limit(50),
            'features',
        ])->findOrFail($caseId);

        return response()->json([
            'data'          => $case,
            'is_diagnostic' => false,
            'message'       => 'Risk scores are probabilistic. Clinical judgment is required.',
        ]);
    }

    /**
     * POST /clinician/review/{caseId}
     * Submit human review decision. AI cannot finalize medical decision.
     */
    public function submitReview(ClinicianReviewRequest $request, string $caseId): JsonResponse
    {
        $case = ClinicianReview::where('status', 'pending')->findOrFail($caseId);

        $case->update([
            'status'             => $request->decision,   // 'dismissed' | 'escalated' | 'referred'
            'clinician_id'       => auth()->id(),
            'clinician_notes'    => $request->notes,
            'recommendation'     => $request->recommendation,
            'reviewed_at'        => now(),
            'follow_up_required' => $request->follow_up_required ?? false,
            'follow_up_date'     => $request->follow_up_date,
        ]);

        // Notify patient of outcome (no diagnosis language)
        $this->alertService->notifyPatientOfReview($case);

        return response()->json([
            'message'       => 'Review submitted successfully.',
            'case_id'       => $caseId,
            'decision'      => $request->decision,
            'is_diagnostic' => false,
        ]);
    }

    /**
     * GET /clinician/patients
     */
    public function patients(Request $request): JsonResponse
    {
        $patients = User::role('patient')
            ->with(['latestRiskScore'])
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->paginate($request->per_page ?? 20);

        return response()->json($patients);
    }

    /**
     * GET /clinician/patients/{userId}/history
     */
    public function patientHistory(string $userId): JsonResponse
    {
        $history = RiskHistory::where('user_id', $userId)
            ->with('modelVersion')
            ->latest('computed_at')
            ->paginate(30);

        return response()->json([
            'data'          => $history,
            'is_diagnostic' => false,
            'message'       => 'Risk scores are probabilistic and not medical diagnoses.',
        ]);
    }
}
