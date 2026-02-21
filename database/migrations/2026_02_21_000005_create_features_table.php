<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('features', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->integer('window_hours')->default(168);
            $table->jsonb('feature_set')->nullable();

            $table->float('resting_hr_baseline')->nullable();
            $table->float('hrv_deviation')->nullable();
            $table->float('sleep_efficiency')->nullable();
            $table->float('bp_slope')->nullable();
            $table->float('glucose_variability')->nullable();

            $table->float('movement_entropy')->nullable();
            $table->float('social_withdrawal_index')->nullable();
            $table->float('rhythm_stability_index')->nullable();

            $table->float('stress_trend')->nullable();
            $table->float('behavioral_deviation_z_score')->nullable();

            $table->timestamp('computed_at');
            $table->timestamps();

            $table->index(['user_id', 'computed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('features');
    }
};