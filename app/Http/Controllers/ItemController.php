<?php

namespace App\Http\Controllers;

use App\Models\Pengajuan;
use App\Models\StokMutasi;
use Rap2hpoutre\FastExcel\FastExcel;
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
        return Inertia::render('Items/LaporanPage');
    }

    /**
     * Memicu download laporan stok bulanan (menggunakan FastExcel).
     */
    public function downloadLaporanStok(Request $request)
    {
        // validasi
        $data = $request->validate([
            'bulan' => 'required|integer|min:1|max:12',
            'tahun' => 'required|integer|min:2020|max:2099',
        ]);

        $bulan = $data['bulan'];
        $tahun = $data['tahun'];

        // rentang tanggal
        $tanggalAwalBulan = Carbon::create($tahun, $bulan, 1)->startOfMonth();
        $tanggalAkhirBulan = Carbon::create($tahun, $bulan, 1)->endOfMonth();

        // siapkan data
        $items = Item::all();
        $no = 1;

        $generator = function() use ($items, $tanggalAwalBulan, $tanggalAkhirBulan, $no) {

            // Hasilkan baris Judul Kolom (Kembali ke V1 - 9 Kolom Utama)
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

            // baris data
            foreach ($items as $item) {

                $harga = $item->harga; // Asumsi harga saat ini

                // ---- HITUNG STOK AWAL (Sisa Bulan Lalu) ----
                $stokAwal_BulanLalu = StokMutasi::where('item_id', $item->id)
                    ->where('created_at', '<', $tanggalAwalBulan)
                    ->sum('jumlah');

                // ---- HITUNG BARANG MASUK (Bulan Ini) ----
                $barangMasuk_BulanIni = StokMutasi::where('item_id', $item->id)
                    ->where('tipe', 'masuk')
                    ->whereBetween('created_at', [$tanggalAwalBulan, $tanggalAkhirBulan])
                    ->sum('jumlah'); // Hasilnya positif (misal +20)

                // ---- HITUNG PENGELUARAN (Bulan Ini) ----
                $pengeluaran_BulanIni = StokMutasi::where('item_id', $item->id)
                    ->where('tipe', 'keluar')
                    ->whereBetween('created_at', [$tanggalAwalBulan, $tanggalAkhirBulan])
                    ->sum('jumlah'); // Hasilnya negatif (misal -5)

                // ---- HITUNG SISA PERSEDIAAN (Stok Akhir) ----
                // Ini adalah cara paling akurat dan tidak berubah
                $stokAkhir = StokMutasi::where('item_id', $item->id)
                    ->where('created_at', '<=', $tanggalAkhirBulan)
                    ->sum('jumlah'); // Hasilnya 15

                // --- INI ADALAH LOGIKA GABUNGAN YANG ANDA MINTA ---
                // Gabungkan Sisa Bulan Lalu + Barang Masuk Bulan Ini
                $stokAwal_Tampilan = $stokAwal_BulanLalu + $barangMasuk_BulanIni;

                yield [
                    'No' => $no++,
                    'Nama Barang' => $item->nama_barang,

                    // --- STOK AWAL (Gabungan) ---
                    'Stok Awal (Volume)' => $stokAwal_Tampilan, // (misal: 0 + 20 = 20)
                    'Stok Awal (Harga Satuan)' => $harga,
                    'Stok Awal (Jumlah)' => $stokAwal_Tampilan * $harga,

                    // --- PENGELUARAN ---
                    'Pengeluaran (Volume)' => abs($pengeluaran_BulanIni), // (misal: 5)
                    'Pengeluaran (Harga Satuan)' => $harga,
                    'Pengeluaran (Jumlah)' => abs($pengeluaran_BulanIni) * $harga,

                    // --- SISA PERSEDIAAN ---
                    'Sisa Persediaan (Volume)' => $stokAkhir, // (misal: 15)
                    'Sisa Persediaan (Harga Satuan)' => $harga,
                    'Sisa Persediaan (Jumlah)' => $stokAkhir * $harga,
                ];
            }
        };

        // nama file
        $fileName = "laporan-stok-bulanan-{$bulan}-{$tahun}.xlsx";

        // download file
        return (new FastExcel($generator()))->download($fileName);
    }

    public function showStokMasukPage()
    {
        $items = Item::all(); // Ambil daftar barang untuk dropdown
        return Inertia::render('Items/StokMasukPage', [
            'items' => $items
        ]);
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

        // Gunakan DB Transaction untuk memastikan kedua tabel ter-update
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
        // 1. Validasi input
        $data = $request->validate([
            'semester' => 'required|integer|in:1,2',
            'tahun' => 'required|integer|min:2020|max:2099',
        ]);

        $semester = $data['semester'];
        $tahun = $data['tahun'];

        // 2. Tentukan rentang tanggal semester
        if ($semester == 1) {
            // Semester 1: 1 Jan - 30 Jun
            $tanggalAwalSemester = Carbon::create($tahun, 1, 1)->startOfMonth();
            $tanggalAkhirSemester = Carbon::create($tahun, 6, 1)->endOfMonth();
        } else {
            // Semester 2: 1 Jul - 31 Des
            $tanggalAwalSemester = Carbon::create($tahun, 7, 1)->startOfMonth();
            $tanggalAkhirSemester = Carbon::create($tahun, 12, 1)->endOfMonth();
        }

        // 3. Siapkan data (Logika SAMA PERSIS dengan Laporan Bulanan V3)
        $items = Item::all();
        $no = 1;

        $generator = function() use ($items, $tanggalAwalSemester, $tanggalAkhirSemester, $no) {

            // Hasilkan baris Judul Kolom (SAMA)
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

                $harga = $item->harga;

                // ---- HITUNG STOK AWAL (Sisa Semester Lalu) ----
                $stokAwal_SemesterLalu = StokMutasi::where('item_id', $item->id)
                    ->where('created_at', '<', $tanggalAwalSemester)
                    ->sum('jumlah');

                // ---- HITUNG BARANG MASUK (Selama Semester Ini) ----
                $barangMasuk_SemesterIni = StokMutasi::where('item_id', $item->id)
                    ->where('tipe', 'masuk')
                    ->whereBetween('created_at', [$tanggalAwalSemester, $tanggalAkhirSemester])
                    ->sum('jumlah');

                // ---- HITUNG PENGELUARAN (Selama Semester Ini) ----
                $pengeluaran_SemesterIni = StokMutasi::where('item_id', $item->id)
                    ->where('tipe', 'keluar')
                    ->whereBetween('created_at', [$tanggalAwalSemester, $tanggalAkhirSemester])
                    ->sum('jumlah');

                // ---- HITUNG SISA PERSEDIAAN (Stok Akhir Semester) ----
                $stokAkhir = StokMutasi::where('item_id', $item->id)
                    ->where('created_at', '<=', $tanggalAkhirSemester)
                    ->sum('jumlah');

                // --- LOGIKA GABUNGAN (Sesuai Permintaan Anda) ---
                $stokAwal_Tampilan = $stokAwal_SemesterLalu + $barangMasuk_SemesterIni;

                yield [
                    'No' => $no++,
                    'Nama Barang' => $item->nama_barang,

                    'Stok Awal (Volume)' => $stokAwal_Tampilan,
                    'Stok Awal (Harga Satuan)' => $harga,
                    'Stok Awal (Jumlah)' => $stokAwal_Tampilan * $harga,

                    'Pengeluaran (Volume)' => abs($pengeluaran_SemesterIni),
                    'Pengeluaran (Harga Satuan)' => $harga,
                    'Pengeluaran (Jumlah)' => abs($pengeluaran_SemesterIni) * $harga,

                    'Sisa Persediaan (Volume)' => $stokAkhir,
                    'Sisa Persediaan (Harga Satuan)' => $harga,
                    'Sisa Persediaan (Jumlah)' => $stokAkhir * $harga,
                ];
            }
        };

        // 4. Buat nama file
        $fileName = "laporan-stok-semester-{$semester}-{$tahun}.xlsx";

        // 5. Download file
        return (new FastExcel($generator()))->download($fileName);
    }
}
