<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pengajuan;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Item;
use Illuminate\Support\Facades\Storage;

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
}
