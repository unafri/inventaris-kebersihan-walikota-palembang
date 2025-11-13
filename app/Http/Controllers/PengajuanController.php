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

        $pengajuans = Pengajuan::where('user_id', $userId)
                                ->with('item')
                                ->orderBy('created_at', 'desc')
                                ->get();

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

    // Kabag
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
        // ambil pengajuan yg disetujui kabag
        $pengajuans = Pengajuan::where('status', 'Disetujui Kabag')
                                ->with('user', 'item')
                                ->orderBy('created_at', 'asc')
                                ->get();

        return Inertia::render('Admin/Index', [
            'pengajuans' => $pengajuans
        ]);
    }

    // Admin
    public function adminProses(string $id)
    {
        $pengajuan = Pengajuan::findOrFail($id);
        $item = $pengajuan->item;

        // cek stok
        if ($item->stok < $pengajuan->jumlah) {
            return redirect()->route('admin.index')->with('error', 'Stok barang tidak mencukupi!');
        }

        // DB Trransaction
        try {
            DB::transaction(function () use ($pengajuan, $item) {
                $item->stok -= $pengajuan->jumlah;
                $item->save();

                // ubah status
                $pengajuan->status = 'Selesai';
                $pengajuan->save();
            });
        } catch (\Exception $e) {
            return redirect()->route('admin.index')->with('error', 'Gagal memproses pengajuan: ' . $e->getMessage());
        }

        // success
        return redirect()->route('admin.index');
    }
}
