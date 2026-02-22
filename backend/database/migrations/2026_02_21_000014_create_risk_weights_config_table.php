<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('risk_weights_configs', function (Blueprint $table) {
            $table->id();
            $table->float('cardiovascular_weight')->default(0.40);
            $table->float('metabolic_weight')->default(0.35);
            $table->float('mental_weight')->default(0.25);
            $table->boolean('is_active')->default(true);
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('risk_weights_configs');
    }
};