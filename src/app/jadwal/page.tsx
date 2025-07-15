'use client';

import { useState, useEffect, useRef } from 'react';
// 1. Impor hook dan library yang diperlukan
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';

const dataJadwal = [
    { no: 1, nama: 'Joko', waktu: '08:00 - 09:00', pengajar: 'Pak Budi' },
    { no: 2, nama: 'Susi', waktu: '09:00 - 10:00', pengajar: 'Pak Budi' },
    { no: 3, nama: 'Budi', waktu: '10:00 - 11:00', pengajar: 'Pak Budi' },
    { no: 4, nama: 'Wati', waktu: '13:00 - 14:00', pengajar: 'Pak Budi' },
];

export default function JadwalPage() {
    const [formatTanggal, setFormatTanggal] = useState('');

    // 2. Buat ref untuk menunjuk ke elemen yang mau di-print (PDF)
    const componentRef = useRef<HTMLDivElement>(null);

    // 3. Konfigurasi hook react-to-print
    const handlePrintPDF = useReactToPrint({
        contentRef: componentRef, // ✅ Gunakan contentRef, bukan content
        documentTitle: `Jadwal Bimbel - ${formatTanggal}`,
        // onAfterPrint: () => alert('PDF berhasil dicetak!'),
        onPrintError: (err) => alert('Gagal mencetak: ' + err),
    });

    // 4. Fungsi untuk mengekspor data ke Excel
    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(dataJadwal);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Jadwal');
        // Mengatur lebar kolom (opsional)
        worksheet['!cols'] = [
            { wch: 5 },  // Lebar kolom "no"
            { wch: 20 }, // Lebar kolom "nama"
            { wch: 15 }  // Lebar kolom "waktu"
        ];
        XLSX.writeFile(workbook, 'JadwalBimbel.xlsx');
    };

    useEffect(() => {
        const tanggalHariIni = new Date();
        const tanggalTerformat = tanggalHariIni.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        setFormatTanggal(tanggalTerformat);
    }, []);

    return (
        <main className="bg-gray-50 min-h-screen p-4 sm:p-8">
            {/* CSS Print */}
            <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

            <div className="max-w-4xl mx-auto mt-30">
                {/* Tombol - sembunyikan saat cetak */}
                <div className="flex justify-center md:justify-end gap-3 mb-4 no-print">
                    <button onClick={handlePrintPDF} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                        Cetak PDF 📄
                    </button>
                    <button onClick={handleExportExcel} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Ekspor Excel 📊
                    </button>
                </div>

                {/* Area yang akan dicetak */}
                <div ref={componentRef} className="print-area bg-white p-6 text-black">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold">Jadwal Bimbingan Belajar</h1>
                        <p className="text-lg">{formatTanggal || 'Memuat tanggal...'}</p>
                    </div>

                    <table className="w-full border-collapse">
                        <thead className="bg-gray-100 text-black">
                            <tr>
                                <th className="p-3 border text-left">No</th>
                                <th className="p-3 border text-left">Nama</th>
                                <th className="p-3 border text-left">Waktu</th>
                                <th className="p-3 border text-left">Nama Pengajar</th>
                            </tr>
                        </thead>
                        <tbody className="text-black">
                            {dataJadwal.map((item) => (
                                <tr key={item.no} className="border">
                                    <td className="p-3 border">{item.no}</td>
                                    <td className="p-3 border font-medium">{item.nama}</td>
                                    <td className="p-3 border">{item.waktu}</td>
                                    <td className="p-3 border">{item.pengajar}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}