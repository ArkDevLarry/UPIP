<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Observation\{
    WearableObservationRequest,
    BehavioralObservationRequest,
    SpeechObservationRequest,
    DiagnosticObservationRequest
};
use App\Models\Observation;
use App\Services\Ingestion\IngestionService;
use App\Services\Risk\FeatureEngineeringService;
use App\Jobs\ProcessObservationJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ObservationController extends Controller
{
    public function __construct(
        private readonly IngestionService $ingestionService,
    ) {}

    /**
     * POST /observations/wearable
     * Accepts heart rate, HRV, SpO2, steps, sleep from iOS/Android.
     */
    public function storeWearable(WearableObservationRequest $request): JsonResponse
    {
        $observation = $this->ingestionService->ingest(
            userId: auth()->id(),
            type: 'wearable',
            payload: $request->validated(),
            source: $request->header('X-Device-Platform', 'unknown'),
        );

        ProcessObservationJob::dispatch($observation);

        return $this->success($observation, 'Wearable observation recorded.', 202);
    }

    /**
     * POST /observations/behavioral
     * Movement entropy, social withdrawal, rhythm stability.
     */
    public function storeBehavioral(BehavioralObservationRequest $request): JsonResponse
    {
        $observation = $this->ingestionService->ingest(
            userId: auth()->id(),
            type: 'behavioral',
            payload: $request->validated(),
            source: $request->header('X-Device-Platform', 'unknown'),
        );

        ProcessObservationJob::dispatch($observation);

        return $this->success($observation, 'Behavioral observation recorded.', 202);
    }

    /**
     * POST /observations/speech
     * Field-level encrypted. Requires 'speech' consent module.
     */
    public function storeSpeech(SpeechObservationRequest $request): JsonResponse
    {
        $observation = $this->ingestionService->ingest(
            userId: auth()->id(),
            type: 'speech',
            payload: $request->validated(),
            source: $request->header('X-Device-Platform', 'unknown'),
            encrypted: true,
        );

        ProcessObservationJob::dispatch($observation);

        return $this->success($observation, 'Speech observation recorded.', 202);
    }

    /**
     * POST /observations/diagnostic
     * Lab results, vitals, BP, glucose.
     */
    public function storeDiagnostic(DiagnosticObservationRequest $request): JsonResponse
    {
        $observation = $this->ingestionService->ingest(
            userId: auth()->id(),
            type: 'diagnostic',
            payload: $request->validated(),
            source: 'manual',
        );

        ProcessObservationJob::dispatch($observation);

        return $this->success($observation, 'Diagnostic observation recorded.', 202);
    }

    /**
     * GET /observations
     * List observations for authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $observations = Observation::query()
            ->where('user_id', auth()->id())
            ->when($request->type, fn ($q, $t) => $q->where('type', $t))
            ->when($request->from, fn ($q, $f) => $q->where('observed_at', '>=', $f))
            ->when($request->to,   fn ($q, $t) => $q->where('observed_at', '<=', $t))
            ->latest('observed_at')
            ->paginate($request->per_page ?? 20);

        return response()->json($observations);
    }

    /**
     * GET /observations/{id}
     */
    public function show(string $id): JsonResponse
    {
        $observation = Observation::where('user_id', auth()->id())
            ->findOrFail($id);

        return response()->json($observation);
    }

    private function success(Observation $observation, string $message, int $status): JsonResponse
    {
        return response()->json([
            'data'          => $observation->only(['id', 'type', 'observed_at', 'confidence_score']),
            'message'       => $message,
            'is_diagnostic' => false,
        ], $status);
    }
}
