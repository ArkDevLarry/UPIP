<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('risk_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('model_version_id')->nullable()->constrained()->nullOnDelete();
            $table->float('uprs_score');
            $table->string('uprs_tier', 10);
            $table->float('cardiovascular_score')->nullable();
            $table->float('metabolic_score')->nullable();
            $table->float('mental_score')->nullable();
            $table->timestamp('computed_at');
            $table->timestamps();

            $table->index(['user_id', 'computed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('risk_history');
    }
};