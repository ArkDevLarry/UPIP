<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('behavioral_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('metric_date');
            $table->integer('step_count')->nullable();
            $table->integer('active_minutes')->nullable();
            $table->integer('sedentary_minutes')->nullable();
            $table->integer('social_events')->nullable();
            $table->integer('screen_time_min')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'metric_date']);
            $table->index(['user_id', 'metric_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('behavioral_metrics');
    }
};