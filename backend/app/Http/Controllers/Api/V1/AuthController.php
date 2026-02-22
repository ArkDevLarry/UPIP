<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Services\Consent\ConsentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function __construct(private readonly ConsentService $consentService) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'dob'      => $request->dob,
            'gender'   => $request->gender,
            'region'   => $request->region ?? 'NG',
        ]);

        $user->assignRole('patient');

        // Create Sanctum token
        $token = $user->createToken('mobile-token')->plainTextToken;

        return $this->respondWithToken($token, $user, 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid credentials.'
            ], 401);
        }

        $user = Auth::user();

        // Revoke previous tokens (optional but recommended for mobile)
        $user->tokens()->delete();

        $token = $user->createToken('mobile-token')->plainTextToken;

        return $this->respondWithToken($token, $user);
    }

    public function logout(): JsonResponse
    {
        auth()->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out.'
        ]);
    }

    public function me(): JsonResponse
    {
        $user = auth()->user()->load('roles');

        return response()->json([
            'user'            => $user,
            'active_consents' => $this->consentService->getActiveModules($user->id),
            'is_diagnostic'   => false,
        ]);
    }

    private function respondWithToken(string $token, User $user, int $status = 200): JsonResponse
    {
        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames(),
            ],
            'is_diagnostic' => false,
            'message'       => 'Risk scores are probabilistic and not medical diagnoses.',
        ], $status);
    }
}