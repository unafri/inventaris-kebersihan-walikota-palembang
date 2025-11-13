<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PengajuanController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('items', ItemController::class);
    Route::resource('users', UserController::class);

    // ROUTING UNTUK PENGAJUAN BARANG

    // staff liat riwayat pengajuan
    Route::get('/pengajuan', [PengajuanController::class, 'index'])
        ->name('pengajuan.index');

    // staff form pengajuan
    Route::get('/pengajuan/create', [PengajuanController::class, 'create'])
        ->name('pengajuan.create');

    // staff submit form
    Route::post('/pengajuan', [PengajuanController::class, 'store'])
        ->name('pengajuan.store');

    // ROUTING UNTUK KABAG
    
    // daftar persetujuan kabag
    Route::get('/persetujuan-kabag', [PengajuanController::class, 'kabagIndex'])
        ->name('kabag.index');

    // action
    Route::patch('/persetujuan-kabag/{id}/setuju', [PengajuanController::class, 'kabagSetuju'])
        ->name('kabag.setuju');

    Route::patch('/persetujuan-kabag/{id}/tolak', [PengajuanController::class, 'kabagTolak'])
        ->name('kabag.tolak');

    // RUTE UNTUK ADMIN PROSES
    
    // proses persetujuan admin
    Route::get('/proses-admin', [PengajuanController::class, 'adminIndex'])
        ->name('admin.index');

    // process action
    Route::patch('/proses-admin/{id}/proses', [PengajuanController::class, 'adminProses'])
        ->name('admin.proses');

        // --- RUTE UNTUK LAPORAN STOK BULANAN ---
    // Halaman untuk menampilkan filter
    Route::get('/laporan/stok', [ItemController::class, 'showLaporanStokPage'])
        ->name('laporan.stok.page');

    // Aksi untuk men-download laporan
    Route::get('/laporan/stok/download', [ItemController::class, 'downloadLaporanStok'])
        ->name('laporan.stok.download');
});

require __DIR__ . '/auth.php';
