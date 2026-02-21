<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('family_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->boolean('family_diabetes')->default(false);
            $table->boolean('family_cardiovascular')->default(false);
            $table->boolean('family_hypertension')->default(false);
            $table->boolean('family_cancer')->default(false);
            $table->boolean('family_mental_illness')->default(false);
            $table->jsonb('additional_conditions')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('family_histories');
    }
};