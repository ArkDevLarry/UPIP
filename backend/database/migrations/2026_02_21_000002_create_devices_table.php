<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('platform', 10)->comment('ios|android');
            $table->string('device_id')->index();
            $table->string('device_name')->nullable();
            $table->string('os_version', 50)->nullable();
            $table->string('app_version', 50)->nullable();
            $table->string('health_api')->nullable()->comment('HealthKit|HealthConnect|GoogleFit');
            $table->text('push_token')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_seen_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'device_id']);
            $table->index(['user_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};