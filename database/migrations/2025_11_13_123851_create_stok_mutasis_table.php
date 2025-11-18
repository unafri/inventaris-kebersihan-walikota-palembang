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
        Schema::create('stok_mutasis', function (Blueprint $table) {
        $table->id();
        $table->foreignId('item_id')->constrained('items');
        $table->foreignId('user_id')->nullable()->constrained('users');
        $table->integer('jumlah'); 
        $table->string('tipe');
        $table->string('keterangan')->nullable();
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stok_mutasis');
    }
};
