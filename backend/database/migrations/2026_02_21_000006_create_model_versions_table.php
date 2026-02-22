<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('model_versions', function (Blueprint $table) {
            $table->id();
            $table->string('model_name', 100);
            $table->string('version', 30);
            $table->string('domain', 30);
            $table->text('description')->nullable();
            $table->float('calibration_score')->nullable();
            $table->boolean('bias_test_passed')->default(false);
            $table->float('drift_threshold')->default(0.05);
            $table->boolean('is_active')->default(false);
            $table->timestamp('deployed_at')->nullable();
            $table->timestamp('deprecated_at')->nullable();
            $table->timestamps();

            $table->index(['domain', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('model_versions');
    }
};