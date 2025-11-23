<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PengajuanController;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::redirect('/', '/login');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // STAFF ROUTE
    Route::middleware('role:staff')->group(function() {
        // list pengajuan
        Route::get('/pengajuan', [PengajuanController::class, 'index'])
            ->name('pengajuan.index');

        // form pengajuan
        Route::get('/pengajuan/create', [PengajuanController::class, 'create'])
            ->name('pengajuan.create');

        // submit form
        Route::post('/pengajuan', [PengajuanController::class, 'store'])
            ->name('pengajuan.store');
    });

    // KABAG ROUTE
    Route::middleware('role:kabag')->group(function() {
        // daftar persetujuan kabag
        Route::get('/persetujuan-kabag', [PengajuanController::class, 'kabagIndex'])
            ->name('kabag.index');

        // action
        Route::patch('/persetujuan-kabag/{id}/setuju', [PengajuanController::class, 'kabagSetuju'])
            ->name('kabag.setuju');

        Route::patch('/persetujuan-kabag/{id}/tolak', [PengajuanController::class, 'kabagTolak'])
            ->name('kabag.tolak');
    });

    // ADMIN ROUTE
    Route::middleware('role:admin')->group(function() {
        // items dan users
        Route::resource('items', ItemController::class);
        Route::resource('users', UserController::class);

        // page persetujuan admin
        Route::get('/proses-admin', [PengajuanController::class, 'adminIndex'])
            ->name('admin.index');

        // process action
        Route::patch('/proses-admin/{id}/proses', [PengajuanController::class, 'adminProses'])
            ->name('admin.proses');
        
        Route::get('/stok-masuk', [ItemController::class, 'showStokMasukPage'])
            ->name('stok.masuk.page');

        Route::post('/stok-masuk', [ItemController::class, 'storeStokMasuk'])
            ->name('stok.masuk.store');
    });

    // ROUTE UNTUK LAPORAN STOK BULANAN
    Route::middleware('role:admin,kabag')->group(function() {
        // page laporan
        Route::get('/laporan/stok', [ItemController::class, 'showLaporanStokPage'])
            ->name('laporan.stok.page');

        // download
        Route::get('/laporan/stok/download', [ItemController::class, 'downloadLaporanStok'])
            ->name('laporan.stok.download');
        
        Route::get('/laporan-semesteran-download', [ItemController::class, 'downloadLaporanSemesteran'])
            ->name('laporan.semesteran');
    });
});

require __DIR__ . '/auth.php';
