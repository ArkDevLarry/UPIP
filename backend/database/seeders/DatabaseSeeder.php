<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\{Role, Permission};
use App\Models\{User, RiskWeightsConfig, ModelVersion};
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Roles ────────────────────────────────────────────────────────
        $roles = ['patient', 'clinician', 'admin'];
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'api']);
        }

        // ─── Admin user ───────────────────────────────────────────────────
        $admin = User::firstOrCreate(['email' => 'admin@upip.health'], [
            'name'     => 'UPIP Admin',
            'password' => Hash::make('admin-change-me!'),
            'region'   => 'NG',
        ]);
        $admin->assignRole('admin');

        // ─── Demo clinician ───────────────────────────────────────────────
        $clinician = User::firstOrCreate(['email' => 'clinician@upip.health'], [
            'name'     => 'Demo Clinician',
            'password' => Hash::make('clinician-change-me!'),
            'region'   => 'NG',
        ]);
        $clinician->assignRole('clinician');

        // ─── Risk weights ─────────────────────────────────────────────────
        RiskWeightsConfig::firstOrCreate(['is_active' => true], [
            'cardiovascular_weight' => 0.40,
            'metabolic_weight'      => 0.35,
            'mental_weight'         => 0.25,
        ]);

        // ─── Seed model version placeholder ──────────────────────────────
        ModelVersion::firstOrCreate(['version' => 'v1.0.0', 'domain' => 'cardiovascular'], [
            'model_name'       => 'CardioRisk-LGBM',
            'description'      => 'LightGBM cardiovascular risk model — Phase 1',
            'bias_test_passed' => false,
            'is_active'        => true,
            'deployed_at'      => now(),
        ]);

        $this->command->info('UPIP seed complete.');
    }
}
