<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pengajuan;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Item;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class PengajuanController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        // 2. Ambil data pengajuan HANYA milik user tsb.
        // 'with('item')' = ambil juga data dari tabel 'items' yang terhubung
        $pengajuans = Pengajuan::where('user_id', $userId)
                                ->with('item') // Ini disebut "Eager Loading"
                                ->orderBy('created_at', 'desc')
                                ->get();

        // 3. Tampilkan halaman React dan kirim datanya
        return Inertia::render('Pengajuan/Index', [
            'pengajuans' => $pengajuans
        ]);
    }

    public function create()
    {
        $items = Item::all();

        return Inertia::render('Pengajuan/Create', [
            'items' => $items
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'item_id' => 'required|exists:items,id',
            'jumlah' => 'required|integer|min:1',
            'berkas' => 'required|file|mimes:jpg,jpeg,png,pdf,doc,docx|max:2048',
        ]);

        $berkasPath = $request->file('berkas')->store('berkas_pengajuan', 'public');

        Pengajuan::create([
            'user_id' => Auth::id(),
            'item_id' => $validatedData['item_id'],
            'jumlah' => $validatedData['jumlah'],
            'berkas_path' => $berkasPath,
            'status' => 'Pending',
        ]);

        return redirect()->route('pengajuan.index');
    }

    public function kabagIndex()
    {
        $pengajuans = Pengajuan::where('status', 'Pending')
                                ->with('user', 'item')
                                ->orderBy('created_at', 'asc')
                                ->get();
        
        return Inertia::render('Kabag/Index', [
            'pengajuans' => $pengajuans
        ]);
    }

    public function kabagSetuju(string $id)
    {
        $pengajuans = Pengajuan::findOrFail($id);

        $pengajuans->update(['status' => 'Disetujui Kabag']);

        return redirect()->route('kabag.index');
    }

    public function kabagTolak(string $id)
    {
        $pengajuans = Pengajuan::findOrFail($id);

        $pengajuans->update(['status' => 'Ditolak']);

        return redirect()->route('kabag.index');
    }

    public function adminIndex()
    {
        // 1. Ambil semua pengajuan yang statusnya 'Disetujui Kabag'
        $pengajuans = Pengajuan::where('status', 'Disetujui Kabag')
                                ->with('user', 'item') // Ambil data user & item
                                ->orderBy('created_at', 'asc')
                                ->get();

        // 2. Tampilkan halaman React 'Admin/Index.jsx'
        return Inertia::render('Admin/Index', [
            'pengajuans' => $pengajuans
        ]);
    }

    /**
     * Memproses pengajuan (Aksi Admin).
     */
    public function adminProses(string $id)
    {
        $pengajuan = Pengajuan::findOrFail($id);
        $item = $pengajuan->item; // Ambil item yang terhubung

        // 1. Cek Stok Dulu
        if ($item->stok < $pengajuan->jumlah) {
            // Jika stok tidak cukup, redirect kembali dengan pesan error
            // Pesan ini akan ditangkap oleh Inertia sebagai 'flash message'
            return redirect()->route('admin.index')->with('error', 'Stok barang tidak mencukupi!');
        }

        // 2. Gunakan DB Transaction
        // Ini memastikan jika salah satu query gagal, semua akan dibatalkan (rollback).
        // Mencegah stok berkurang TAPI status tidak berubah (atau sebaliknya).
        try {
            DB::transaction(function () use ($pengajuan, $item) {
                // Kurangi stok barang
                $item->stok -= $pengajuan->jumlah;
                $item->save();

                // Ubah status pengajuan
                $pengajuan->status = 'Selesai';
                $pengajuan->save();
            });
        } catch (\Exception $e) {
            // Jika terjadi error selama transaksi
            return redirect()->route('admin.index')->with('error', 'Gagal memproses pengajuan: ' . $e->getMessage());
        }

        // 3. Jika sukses, redirect kembali
        return redirect()->route('admin.index');
    }
}
