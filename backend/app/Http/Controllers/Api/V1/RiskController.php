<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Risk\{FamilyHistoryRequest, GeneticDataRequest};
use App\Models\{RiskScore, RiskHistory, RiskWeightsConfig, ModelVersion};
use App\Services\Risk\{RiskAggregationService, GeneticDataService};
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RiskController extends Controller
{
    public function __construct(
        private readonly RiskAggregationService $riskService,
        private readonly GeneticDataService $geneticService,
    ) {}

    /**
     * POST /risk/family-history
     */
    public function storeFamilyHistory(FamilyHistoryRequest $request): JsonResponse
    {
        $this->riskService->storeFamilyHistory(auth()->id(), $request->validated());

        return response()->json([
            'message'       => 'Family history recorded. Recalculating risk profile.',
            'is_diagnostic' => false,
        ], 202);
    }

    /**
     * POST /risk/genetic
     * Field-level encrypted. Requires explicit 'genetic' consent.
     */
    public function storeGenetic(GeneticDataRequest $request): JsonResponse
    {
        $this->geneticService->store(auth()->id(), $request->validated());

        return response()->json([
            'message'       => 'Genetic risk markers recorded securely.',
            'is_diagnostic' => false,
        ], 202);
    }

    /**
     * GET /risk/scores
     * Current domain-level risk scores.
     */
    public function getScores(): JsonResponse
    {
        $scores = RiskScore::where('user_id', auth()->id())
            ->latest('computed_at')
            ->first();

        if (!$scores) {
            return response()->json([
                'message'       => 'No risk scores computed yet. Submit observations to generate scores.',
                'is_diagnostic' => false,
            ], 404);
        }

        return response()->json([
            'data'          => $scores,
            'is_diagnostic' => false,
            'message'       => 'Risk scores are probabilistic and not medical diagnoses.',
        ]);
    }

    /**
     * GET /risk/uprs
     * Unified Preventive Risk Score.
     */
    public function getUPRS(): JsonResponse
    {
        $uprs = $this->riskService->computeUPRS(auth()->id());

        return response()->json([
            'data'          => $uprs,
            'is_diagnostic' => false,
            'message'       => 'Risk scores are probabilistic and not medical diagnoses.',
        ]);
    }

    /**
     * GET /risk/history
     * Longitudinal UPRS history.
     */
    public function getHistory(Request $request): JsonResponse
    {
        $history = RiskHistory::where('user_id', auth()->id())
            ->when($request->from, fn ($q, $f) => $q->where('computed_at', '>=', $f))
            ->when($request->to,   fn ($q, $t) => $q->where('computed_at', '<=', $t))
            ->latest('computed_at')
            ->paginate($request->per_page ?? 30);

        return response()->json([
            'data'          => $history,
            'is_diagnostic' => false,
            'message'       => 'Risk scores are probabilistic and not medical diagnoses.',
        ]);
    }

    // ─── Admin only ───────────────────────────────────────────────────────

    public function getWeights(): JsonResponse
    {
        return response()->json(RiskWeightsConfig::getActive());
    }

    public function updateWeights(Request $request): JsonResponse
    {
        $request->validate([
            'cardiovascular_weight' => 'required|numeric|min:0|max:1',
            'metabolic_weight'      => 'required|numeric|min:0|max:1',
            'mental_weight'         => 'required|numeric|min:0|max:1',
        ]);

        $weights = $request->only(['cardiovascular_weight', 'metabolic_weight', 'mental_weight']);

        if (array_sum($weights) !== 1.0) {
            return response()->json(['message' => 'Weights must sum to 1.0.'], 422);
        }

        RiskWeightsConfig::updateActive($weights, auth()->id());

        return response()->json(['message' => 'Risk weights updated.', 'data' => $weights]);
    }

    public function modelVersions(): JsonResponse
    {
        return response()->json(ModelVersion::latest()->paginate(20));
    }
}
