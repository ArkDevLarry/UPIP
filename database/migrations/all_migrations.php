<?php
// 2024_01_01_000001_create_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->date('dob')->nullable();
            $table->string('gender', 30)->nullable();
            $table->string('region', 2)->default('NG')->comment('ISO-3166-1 alpha-2');
            $table->string('remember_token', 100)->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('users'); }
};

// ─── 2024_01_01_000002_create_devices_table.php ──────────────────────────────
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

    public function down(): void { Schema::dropIfExists('devices'); }
};

// ─── 2024_01_01_000003_create_consent_records_table.php ──────────────────────
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

    public function down(): void { Schema::dropIfExists('consent_records'); }
};

// ─── 2024_01_01_000004_create_observations_table.php ─────────────────────────
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

            // Indexes for time-series queries
            $table->index(['user_id', 'type', 'observed_at']);
            $table->index(['user_id', 'sub_type', 'observed_at']);
            $table->index('observed_at');
        });
    }

    public function down(): void { Schema::dropIfExists('observations'); }
};

// ─── 2024_01_01_000005_create_features_table.php ─────────────────────────────
return new class extends Migration {
    public function up(): void
    {
        Schema::create('features', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->integer('window_hours')->default(168)->comment('Rolling window in hours');
            $table->jsonb('feature_set')->nullable()->comment('Full feature vector');

            // Physiological
            $table->float('resting_hr_baseline')->nullable();
            $table->float('hrv_deviation')->nullable();
            $table->float('sleep_efficiency')->nullable();
            $table->float('bp_slope')->nullable();
            $table->float('glucose_variability')->nullable();

            // Behavioral
            $table->float('movement_entropy')->nullable();
            $table->float('social_withdrawal_index')->nullable();
            $table->float('rhythm_stability_index')->nullable();

            // Mental
            $table->float('stress_trend')->nullable();
            $table->float('behavioral_deviation_z_score')->nullable();

            $table->timestamp('computed_at');
            $table->timestamps();

            $table->index(['user_id', 'computed_at']);
        });
    }

    public function down(): void { Schema::dropIfExists('features'); }
};

// ─── 2024_01_01_000006_create_model_versions_table.php ───────────────────────
return new class extends Migration {
    public function up(): void
    {
        Schema::create('model_versions', function (Blueprint $table) {
            $table->id();
            $table->string('model_name', 100);
            $table->string('version', 30);
            $table->string('domain', 30)->comment('cardiovascular|metabolic|mental|anomaly');
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

    public function down(): void { Schema::dropIfExists('model_versions'); }
};

// ─── 2024_01_01_000007_create_risk_scores_table.php ──────────────────────────
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
            $table->string('uprs_tier', 10)->nullable()->comment('low|moderate|elevated');

            $table->float('calibration_score')->nullable();
            $table->float('confidence_score')->nullable();
            $table->jsonb('explanation_vector')->nullable()->comment('SHAP values per domain');
            $table->boolean('drift_flag')->default(false);

            $table->timestamp('computed_at');
            $table->timestamps();

            $table->index(['user_id', 'computed_at']);
            $table->index(['user_id', 'uprs_tier']);
        });
    }

    public function down(): void { Schema::dropIfExists('risk_scores'); }
};

// ─── 2024_01_01_000008_create_risk_history_table.php ─────────────────────────
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

    public function down(): void { Schema::dropIfExists('risk_history'); }
};

// ─── 2024_01_01_000009_create_clinician_reviews_table.php ────────────────────
return new class extends Migration {
    public function up(): void
    {
        Schema::create('clinician_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('clinician_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('risk_score_id')->nullable()->constrained()->nullOnDelete();
            $table->string('status', 20)->default('pending')->comment('pending|dismissed|escalated|referred');
            $table->string('priority', 10)->default('normal')->comment('normal|high|urgent');
            $table->text('clinician_notes')->nullable();
            $table->text('recommendation')->nullable();
            $table->boolean('follow_up_required')->default(false);
            $table->date('follow_up_date')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'priority', 'created_at']);
            $table->index('patient_id');
        });
    }

    public function down(): void { Schema::dropIfExists('clinician_reviews'); }
};

// ─── 2024_01_01_000010_create_alerts_table.php ───────────────────────────────
return new class extends Migration {
    public function up(): void
    {
        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('clinician_review_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type', 50);
            $table->float('uprs_score')->nullable();
            $table->timestamp('notified_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void { Schema::dropIfExists('alerts'); }
};

// ─── 2024_01_01_000011_create_audit_logs_table.php ───────────────────────────
return new class extends Migration {
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action', 100);
            $table->string('resource_type', 50)->nullable();
            $table->string('resource_id')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->jsonb('metadata')->nullable();
            $table->timestamp('created_at');

            $table->index(['user_id', 'created_at']);
            $table->index(['action', 'created_at']);
            $table->index('resource_type');
        });
    }

    public function down(): void { Schema::dropIfExists('audit_logs'); }
};

// ─── 2024_01_01_000012_create_genetic_data_table.php ─────────────────────────
return new class extends Migration {
    public function up(): void
    {
        Schema::create('genetic_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->text('markers_encrypted')->comment('AES-256 encrypted JSON');
            $table->text('polygenic_scores_encrypted')->nullable()->comment('AES-256 encrypted JSON');
            $table->float('modifier_score')->default(1.0)->comment('Genetic risk modifier for UPRS');
            $table->string('data_source', 50)->default('patient_provided');
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('genetic_data'); }
};

// ─── 2024_01_01_000013_create_behavioral_metrics_table.php ───────────────────
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

    public function down(): void { Schema::dropIfExists('behavioral_metrics'); }
};

// ─── 2024_01_01_000014_create_risk_weights_config_table.php ──────────────────
return new class extends Migration {
    public function up(): void
    {
        Schema::create('risk_weights_config', function (Blueprint $table) {
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

    public function down(): void { Schema::dropIfExists('risk_weights_config'); }
};

// ─── 2024_01_01_000015_create_family_histories_table.php ─────────────────────
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

    public function down(): void { Schema::dropIfExists('family_histories'); }
};
