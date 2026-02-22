<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('genetic_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->text('markers_encrypted');
            $table->text('polygenic_scores_encrypted')->nullable();
            $table->float('modifier_score')->default(1.0);
            $table->string('data_source', 50)->default('patient_provided');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('genetic_data');
    }
};