<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Concerns\Exportable;

class StokLaporanExport implements FromView, ShouldAutoSize, WithEvents
{
    use Exportable;

    protected $data;
    protected $totals;
    protected $periode;

    public function __construct(array $data, array $totals, string $periode)
    {
        $this->data = $data;
        $this->totals = $totals;
        $this->periode = $periode;
    }

    public function view(): View
    {
        return view('exports.laporan-stok', [
            'data' => $this->data,
            'totals' => $this->totals,
            'periode' => $this->periode
        ]);
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {

                $sheet = $event->sheet->getDelegate();

                $highestColumn = $sheet->getHighestColumn();
                $highestRow = $sheet->getHighestRow();
                $fullRange = "A1:{$highestColumn}{$highestRow}";

                $sheet->getStyle($fullRange)->applyFromArray([
                    'font' => [
                        'name' => 'Arial',
                        'size' => 12,
                    ],
                ]);

                $sheet->getStyle('A1:K1')->applyFromArray([
                    'font' => [
                        'name' => 'Arial', 
                        'size' => 14, 
                        'bold' => true,
                    ],
                    'alignment' => [
                        'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                    ],
                ]);
            }
        ];
    }
}
