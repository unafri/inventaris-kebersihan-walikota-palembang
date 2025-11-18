<table>
    <thead>
        <tr>
            <td colspan="11" style="font-weight: bold; text-align: center; font-size: 16px;">
                {{ $periode }} 
            </td>
        </tr>

        <tr>
            <td colspan="11"></td>
        </tr>

        <tr>
            <th rowspan="2" style="font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid black;">
                No
            </th>
            <th rowspan="2" style="font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid black;">
                Nama Barang
            </th>

            <th colspan="3" style="font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid black;">
                Stok Awal
            </th>

            <th colspan="3" style="font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid black;">
                Pengeluaran
            </th>

            <th colspan="3" style="font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid black;">
                Sisa Persediaan
            </th>
        </tr>

        <tr>
            {{-- Sub-header Stok Awal --}}
            <th style="font-weight: bold; text-align: center; border: 1px solid black;">Volume</th>
            <th style="font-weight: bold; text-align: center; border: 1px solid black;">Harga Satuan</th>
            <th style="font-weight: bold; text-align: center; border: 1px solid black;">Jumlah</th>

            {{-- Sub-header Pengeluaran --}}
            <th style="font-weight: bold; text-align: center; border: 1px solid black;">Volume</th>
            <th style="font-weight: bold; text-align: center; border: 1px solid black;">Harga Satuan</th>
            <th style="font-weight: bold; text-align: center; border: 1px solid black;">Jumlah</th>

            {{-- Sub-header Sisa Persediaan --}}
            <th style="font-weight: bold; text-align: center; border: 1px solid black;">Volume</th>
            <th style="font-weight: bold; text-align: center; border: 1px solid black;">Harga Satuan</th>
            <th style="font-weight: bold; text-align: center; border: 1px solid black;">Jumlah</th>
        </tr>
    </thead>

    <tbody>
        @foreach($data as $item)
            <tr>
                <td style="border: 1px solid black;">{{ $loop->iteration }}</td>
                <td style="border: 1px solid black;">{{ $item['nama_barang'] }}</td>

                {{-- Stok Awal (Gabungan) --}}
                <td style="border: 1px solid black;">{{ $item['stokAwal_Tampilan'] }}</td>
                <td style="border: 1px solid black;">{{ $item['harga'] }}</td>
                <td style="border: 1px solid black;">{{ $item['stokAwal_Tampilan'] * $item['harga'] }}</td>

                {{-- Pengeluaran --}}
                <td style="border: 1px solid black;">{{ $item['pengeluaran_Volume'] }}</td> {{-- Sudah di-abs() dari controller --}}
                <td style="border: 1px solid black;">{{ $item['harga'] }}</td>
                <td style="border: 1px solid black;">{{ $item['pengeluaran_Volume'] * $item['harga'] }}</td>

                {{-- Sisa Persediaan --}}
                <td style="border: 1px solid black;">{{ $item['stokAkhir'] }}</td>
                <td style="border: 1px solid black;">{{ $item['harga'] }}</td>
                <td style="border: 1px solid black;">{{ $item['stokAkhir'] * $item['harga'] }}</td>
            </tr>
        @endforeach

        <tr>
            <td colspan="2" style="font-weight: bold; text-align: center; border: 1px solid black;">
                Jumlah
            </td>

            {{-- Total Stok Awal --}}
            <td style="font-weight: bold; border: 1px solid black;">{{ $totals['stokAwal_Tampilan'] }}</td>
            <td style="border: 1px solid black;"></td> {{-- Kosong di bawah Harga --}}
            <td style="font-weight: bold; border: 1px solid black;">{{ $totals['stokAwal_Jumlah'] }}</td>

            {{-- Total Pengeluaran --}}
            <td style="font-weight: bold; border: 1px solid black;">{{ $totals['pengeluaran_Volume'] }}</td>
            <td style="border: 1px solid black;"></td> {{-- Kosong di bawah Harga --}}
            <td style="font-weight: bold; border: 1px solid black;">{{ $totals['pengeluaran_Jumlah'] }}</td>

            {{-- Total Sisa Persediaan --}}
            <td style="font-weight: bold; border: 1px solid black;">{{ $totals['stokAkhir_Volume'] }}</td>
            <td style="border: 1px solid black;"></td> {{-- Kosong di bawah Harga --}}
            <td style="font-weight: bold; border: 1px solid black;">{{ $totals['stokAkhir_Jumlah'] }}</td>
        </tr>
    </tbody>
</table>