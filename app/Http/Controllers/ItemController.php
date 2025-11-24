<?php

namespace App\Http\Controllers;

use App\Models\Pengajuan;
use App\Models\StokMutasi;
use App\Exports\StokLaporanExport;
use App\Models\Item;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

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
            // 'stok' => 'required|integer',
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
                // 'stok' => 'required|integer',
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
        return Inertia::render('Items/LaporanPage');
    }

    /**
    * Laporan Stok Bulanan
    **/
    public function downloadLaporanStok(Request $request)
    {
        // validasi input
        $data = $request->validate([
            'bulan' => 'required|integer|min:1|max:12',
            'tahun' => 'required|integer|min:2020|max:2099',
        ]);

        $bulan = $data['bulan'];
        $tahun = $data['tahun'];

        // rentang tanggal
        $tanggalAwalBulan = Carbon::create($tahun, $bulan, 1)->startOfMonth();
        $tanggalAkhirBulan = Carbon::create($tahun, $bulan, 1)->endOfMonth();

        // hitung data
        $hasil = $this->hitungDataLaporan($tanggalAwalBulan, $tanggalAkhirBulan);

        // judul periode
        $namaBulan = $tanggalAwalBulan->monthName; 
        $periode = "LAPORAN PERIODE " . strtoupper($namaBulan) . " $tahun";

        $fileName = "laporan-stok-bulanan-{$bulan}-{$tahun}.xlsx";

        return (new StokLaporanExport($hasil['data'], $hasil['totals'], $periode))
            ->download($fileName);
    }

    /**
     * Menyimpan data barang masuk & update stok.
     */
    public function storeStokMasuk(Request $request)
    {
        $data = $request->validate([
            'item_id' => 'required|exists:items,id',
            'jumlah' => 'required|integer|min:1',
            'keterangan' => 'required|string|max:255',
        ]);

        try {
            DB::transaction(function () use ($data) {
                // 1. Ambil item-nya
                $item = Item::findOrFail($data['item_id']);

                // 2. Tambah stok di tabel items (stok utama)
                $item->stok += $data['jumlah'];
                $item->save();

                // 3. Catat di "buku besar" (log mutasi)
                StokMutasi::create([
                    'item_id' => $data['item_id'],
                    'user_id' => Auth::id(), // Admin yg login
                    'jumlah' => $data['jumlah'], // Angka positif (+)
                    'tipe' => 'masuk',
                    'keterangan' => $data['keterangan'],
                ]);
            });
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menyimpan stok: ' . $e->getMessage());
        }

        return redirect()->route('items.index')->with('success', 'Stok berhasil ditambahkan!');
    }

    public function downloadLaporanSemesteran(Request $request)
    {
        // 1. Validasi input (SAMA)
        $data = $request->validate([
            'semester' => 'required|integer|in:1,2',
            'tahun' => 'required|integer|min:2020|max:2099',
        ]);

        $semester = $data['semester'];
        $tahun = $data['tahun'];

        // 2. Tentukan rentang tanggal (SAMA)
        if ($semester == 1) {
            $tanggalAwalSemester = Carbon::create($tahun, 1, 1)->startOfMonth();
            $tanggalAkhirSemester = Carbon::create($tahun, 6, 1)->endOfMonth();
        } else {
            $tanggalAwalSemester = Carbon::create($tahun, 7, 1)->startOfMonth();
            $tanggalAkhirSemester = Carbon::create($tahun, 12, 1)->endOfMonth();
        }

        // 3. Hitung data menggunakan helper function (BARU)
        $hasil = $this->hitungDataLaporan($tanggalAwalSemester, $tanggalAkhirSemester);

        // 4. Buat Judul Periode (BARU)
        $periode = "LAPORAN PERIODE SEMESTER $semester TAHUN $tahun";

        // 5. Buat nama file (SAMA)
        $fileName = "laporan-stok-semester-{$semester}-{$tahun}.xlsx";

        // 6. Download file menggunakan Class Export (BARU)
        return (new StokLaporanExport($hasil['data'], $hasil['totals'], $periode))
            ->download($fileName);
    }

    private function hitungDataLaporan(Carbon $tanggalAwal, Carbon $tanggalAkhir)
    {
        $items = Item::all();

        // Siapkan array kosong untuk menampung data baris
        $data = [];

        // Siapkan array untuk menampung total di baris paling bawah
        $totals = [
            'stokAwal_Tampilan' => 0,
            'stokAwal_Jumlah' => 0,
            'pengeluaran_Volume' => 0,
            'pengeluaran_Jumlah' => 0,
            'stokAkhir_Volume' => 0,
            'stokAkhir_Jumlah' => 0,
        ];

        foreach ($items as $item) {
            $harga = $item->harga;

            // ---- Lakukan 4 Query Inti ----
            $stokAwal_BulanLalu = StokMutasi::where('item_id', $item->id)
                ->where('created_at', '<', $tanggalAwal)
                ->sum('jumlah');

            $barangMasuk_BulanIni = StokMutasi::where('item_id', $item->id)
                ->where('tipe', 'masuk')
                ->whereBetween('created_at', [$tanggalAwal, $tanggalAkhir])
                ->sum('jumlah');

            $pengeluaran_BulanIni = StokMutasi::where('item_id', $item->id)
                ->where('tipe', 'keluar')
                ->whereBetween('created_at', [$tanggalAwal, $tanggalAkhir])
                ->sum('jumlah');

            $stokAkhir = StokMutasi::where('item_id', $item->id)
                ->where('created_at', '<=', $tanggalAkhir)
                ->sum('jumlah');

            // ---- Lakukan Kalkulasi Tampilan ----
            $stokAwal_Tampilan = $stokAwal_BulanLalu + $barangMasuk_BulanIni;
            $pengeluaran_Volume = abs($pengeluaran_BulanIni); // ubah -5 jadi 5

            // ---- Simpan hasil kalkulasi ke array $data ----
            $data[] = [
                'nama_barang' => $item->nama_barang,
                'harga' => $harga,
                'stokAwal_Tampilan' => $stokAwal_Tampilan,
                'pengeluaran_Volume' => $pengeluaran_Volume,
                'stokAkhir' => $stokAkhir,
            ];

            // ---- Tambahkan ke Total ----
            $totals['stokAwal_Tampilan'] += $stokAwal_Tampilan;
            $totals['stokAwal_Jumlah'] += $stokAwal_Tampilan * $harga;
            $totals['pengeluaran_Volume'] += $pengeluaran_Volume;
            $totals['pengeluaran_Jumlah'] += $pengeluaran_Volume * $harga;
            $totals['stokAkhir_Volume'] += $stokAkhir;
            $totals['stokAkhir_Jumlah'] += $stokAkhir * $harga;
        }

        // Kembalikan kedua array tersebut
        return ['data' => $data, 'totals' => $totals];
    }
}
