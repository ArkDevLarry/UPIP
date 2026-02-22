<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('consent_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('module', 30)->comment('wearable|behavioral|speech|genetic|clinical');
            $table->boolean('granted')->default(true);
            $table->timestamp('granted_at')->nullable();
            $table->timestamp('revoked_at')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'module']);
            $table->index(['user_id', 'granted', 'revoked_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consent_records');
    }
};