<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('observations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('device_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type', 20)->comment('wearable|behavioral|speech|diagnostic');
            $table->string('sub_type', 50)->nullable()->comment('heart_rate|hrv|spo2|sleep|...');
            $table->jsonb('payload')->comment('Normalized FHIR-inspired payload');
            $table->string('unit', 30)->nullable();
            $table->float('confidence_score')->default(0.75);
            $table->string('source_reliability', 10)->default('medium')->comment('high|medium|low');
            $table->boolean('is_encrypted')->default(false);
            $table->timestamp('observed_at');
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'type', 'observed_at']);
            $table->index(['user_id', 'sub_type', 'observed_at']);
            $table->index('observed_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('observations');
    }
};