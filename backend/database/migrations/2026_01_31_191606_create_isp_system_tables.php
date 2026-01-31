<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Leads Table
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->enum('lead_type', ['new_connection', 'complaint']);
            $table->string('location')->nullable();
            $table->string('company')->nullable();
            $table->string('customer_name');
            $table->string('phone');
            $table->text('address')->nullable();
            $table->string('status')->default('open'); // open, in_progress, resolved
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });

        // Complaints Details (linked to leads if it's a complaint)
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained('leads')->cascadeOnDelete();
            $table->string('category')->default('general'); // connectivity, billing, hardware, etc.
            $table->text('description')->nullable();
            $table->enum('severity', ['minor', 'major', 'critical'])->default('minor');
            $table->text('resolution_notes')->nullable();
            $table->integer('resolution_time_minutes')->nullable();
            $table->integer('customer_feedback')->nullable(); // 1-5 rating
            $table->timestamps();
        });

        // Notifications
        Schema::create('notifications_log', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('message');
            $table->string('type')->default('info');
            $table->json('data')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        // Reports
        Schema::create('generated_reports', function (Blueprint $table) {
            $table->id();
            $table->string('report_type'); // daily, weekly, custom
            $table->foreignId('generated_by')->constrained('users');
            $table->date('date_from')->nullable();
            $table->date('date_to')->nullable();
            $table->json('data_snapshot')->nullable();
            $table->string('file_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('generated_reports');
        Schema::dropIfExists('notifications_log');
        Schema::dropIfExists('complaints');
        Schema::dropIfExists('leads');
        // Users table modification should be reverted in its own migration
    }
};
