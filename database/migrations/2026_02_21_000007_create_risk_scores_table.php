<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('risk_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('model_version_id')->nullable()->constrained()->nullOnDelete();

            $table->float('cardiovascular_score')->nullable();
            $table->float('metabolic_score')->nullable();
            $table->float('mental_score')->nullable();
            $table->float('genetic_modifier')->default(1.0);
            $table->float('uprs_score')->nullable();
            $table->string('uprs_tier', 10)->nullable();

            $table->float('calibration_score')->nullable();
            $table->float('confidence_score')->nullable();
            $table->jsonb('explanation_vector')->nullable();
            $table->boolean('drift_flag')->default(false);

            $table->timestamp('computed_at');
            $table->timestamps();

            $table->index(['user_id', 'computed_at']);
            $table->index(['user_id', 'uprs_tier']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('risk_scores');
    }
};