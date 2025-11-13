<?php

namespace App\Http\Controllers;

use App\Models\Pengajuan;
use Rap2hpoutre\FastExcel\FastExcel;
use App\Models\Item;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = Item::all();
        return Inertia::render('Items/Index', [
            'items' => $items
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nama_barang' => 'required|string|max:255',
            'stok' => 'required|integer',
            'harga' => 'required|numeric|min:0',
        ]);

        $item = Item::create($validatedData);

        return redirect()->route('items.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $item = Item::findOrFail($id);

        return Inertia::render('Items/Edit', [
            'item' => $item
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate(
            [
                'nama_barang' => 'required|string|max:255',
                'stok' => 'required|integer',
                'harga' => 'required|numeric|min:0',
            ],
            [
                'nama_barang.required' => 'nama barang harus diisi',
            ]
        );

        $item = Item::findOrFail($id);

        $item->update($validatedData);

        return redirect()->route('items.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $item = Item::findOrFail($id);

        $item->delete();

        return redirect()->route('items.index');
    }

    public function showLaporanStokPage()
    {
        // Kita hanya perlu tampilkan halaman React-nya
        return Inertia::render('Items/LaporanPage');
    }

    /**
     * Memicu download laporan stok bulanan (menggunakan FastExcel).
     */
    public function downloadLaporanStok(Request $request)
    {
        // 1. Validasi input dari form
        $data = $request->validate([
            'bulan' => 'required|integer|min:1|max:12',
            'tahun' => 'required|integer|min:2020|max:2099',
        ]);

        $bulan = $data['bulan'];
        $tahun = $data['tahun'];

        // 2. Siapkan data (Logika persis seperti format CSV)
        $items = Item::all();
        $no = 1;

        // Kita gunakan 'generator function' (yield) agar cepat
        $generator = function() use ($items, $bulan, $tahun, $no) {

            // Hasilkan baris Judul Kolom
            yield [
                'No' => 'No',
                'Nama Barang' => 'Nama Barang',
                'Stok Awal (Volume)' => 'Stok Awal (Volume)',
                'Stok Awal (Harga Satuan)' => 'Stok Awal (Harga Satuan)',
                'Stok Awal (Jumlah)' => 'Stok Awal (Jumlah)',
                'Pengeluaran (Volume)' => 'Pengeluaran (Volume)',
                'Pengeluaran (Harga Satuan)' => 'Pengeluaran (Harga Satuan)',
                'Pengeluaran (Jumlah)' => 'Pengeluaran (Jumlah)',
                'Sisa Persediaan (Volume)' => 'Sisa Persediaan (Volume)',
                'Sisa Persediaan (Harga Satuan)' => 'Sisa Persediaan (Harga Satuan)',
                'Sisa Persediaan (Jumlah)' => 'Sisa Persediaan (Jumlah)',
            ];

            // Hasilkan baris Data
            foreach ($items as $item) {
                $pengeluaran_vol = Pengajuan::where('item_id', $item->id)
                    ->where('status', 'Selesai')
                    ->whereMonth('updated_at', $bulan)
                    ->whereYear('updated_at', $tahun)
                    ->sum('jumlah');

                $sisa_vol = $item->stok;
                $awal_vol = $sisa_vol + $pengeluaran_vol;

                yield [
                    'No' => $no++,
                    'Nama Barang' => $item->nama_barang,
                    'Stok Awal (Volume)' => $awal_vol,
                    'Stok Awal (Harga Satuan)' => $item->harga,
                    'Stok Awal (Jumlah)' => $awal_vol * $item->harga,
                    'Pengeluaran (Volume)' => $pengeluaran_vol,
                    'Pengeluaran (Harga Satuan)' => $item->harga,
                    'Pengeluaran (Jumlah)' => $pengeluaran_vol * $item->harga,
                    'Sisa Persediaan (Volume)' => $sisa_vol,
                    'Sisa Persediaan (Harga Satuan)' => $item->harga,
                    'Sisa Persediaan (Jumlah)' => $sisa_vol * $item->harga,
                ];
            }
        };

        // 3. Buat nama file
        $fileName = "laporan-stok-bulanan-{$bulan}-{$tahun}.xlsx";

        // 4. Download file menggunakan FastExcel
        return (new FastExcel($generator()))->download($fileName);
    }
}
