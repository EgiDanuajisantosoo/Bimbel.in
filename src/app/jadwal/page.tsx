'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { format } from 'date-fns';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import { supabase } from '../../lib/supabaseClient';
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
import Image from 'next/image';


interface JadwalItem {
    id: number;
    nama: string;
    waktu_mulai: string;
    waktu_selesai: string;
    pengajar: string;
    tanggal: string;
}

export default function JadwalPage() {
    const [jadwal, setJadwal] = useState<JadwalItem[]>([]);
    const [formatTanggal, setFormatTanggal] = useState<string>('');
    const [tanggalSekarang, setTanggalSekarang] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const componentRef = useRef<HTMLDivElement>(null);

    // Fungsi untuk memuat data jadwal berdasarkan tanggal
    const fetchJadwal = useCallback(async (tanggal: string) => {
        setLoading(true);
        setError(null);

        try {
            console.log('Fetching data for date:', tanggal); // Debugging

            const { data, error } = await supabase
                .from('jadwal')
                .select('id, nama, pengajar, tanggal,waktu_mulai, waktu_selesai')
                .eq('tanggal', tanggal)
                .order('waktu_mulai', { ascending: true });

            console.log('Supabase response:', { data, error }); // Debugging

            if (error) {
                throw new Error(error.message || 'Gagal memuat data');
            }

            if (!data || data.length === 0) {
                setJadwal([]);
                setError('Tidak ada jadwal untuk tanggal ini');
            } else {
                setJadwal(data);
                const dateObj = new Date(tanggal);
                setFormatTanggal(dateObj.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }));
            }
        } catch (error) {
            console.error('Full error:', error); // Debugging
            setError(error instanceof Error ? error.message : 'Terjadi kesalahan tidak diketahui');
            setJadwal([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Efek untuk memuat data saat tanggal berubah
    useEffect(() => {
        fetchJadwal(tanggalSekarang);
    }, [tanggalSekarang, fetchJadwal]);

    const handlePrintPDF = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Jadwal Bimbel - ${formatTanggal}`,
        onPrintError: (err) => alert('Gagal mencetak: ' + err),
    });

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(jadwal);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Jadwal');
        worksheet['!cols'] = [
            { wch: 5 },
            { wch: 20 },
            { wch: 15 },
            { wch: 20 }
        ];
        XLSX.writeFile(workbook, `JadwalBimbel-${formatTanggal}.xlsx`);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTanggalSekarang(e.target.value);
    };

    return (
        <main className="bg-gray-50 min-h-screen p-4 sm:p-8">
            <div className="jadwal max-w-4xl mx-auto mt-30 relative">

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 no-print">
                    <div className="w-full sm:w-auto text-black">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                            Pilih Tanggal:
                        </label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            value={tanggalSekarang}
                            onChange={handleDateChange}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        // max={format(new Date(), 'yyyy-MM-dd')}
                        />
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto justify-end">
                        <button
                            onClick={handlePrintPDF}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                            disabled={loading}
                        >
                            Cetak PDF 📄
                        </button>
                        <button
                            onClick={handleExportExcel}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            disabled={loading || jadwal.length === 0}
                        >
                            Ekspor Excel 📊
                        </button>
                    </div>
                </div>

                <div ref={componentRef} className="print-area bg-white p-6 rounded-lg shadow ">
                    <div className="text-center mb-6 ">
                        <div className="head relative text-center mb-4">
                            <h1 className="text-2xl font-bold text-black py-2">
                                Jadwal Bimbingan Belajar
                            </h1>
                            <Image
                                src="/assets/logo/logoBimbel.png"
                                alt="Logo"
                                width={150}
                                height={30}
                                className="hidden md:block print:block absolute top-1/2 right-0 -translate-y-1/2"
                            />
                        </div>



                        <p className="text-lg text-black">{formatTanggal || 'Memuat tanggal...'}</p>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Memuat data...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-500">{error}</p>
                        </div>
                    ) : jadwal.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Belum ada jadwal untuk tanggal ini</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-black">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-3 border text-left">No</th>
                                        <th className="p-3 border text-left">Nama</th>
                                        <th className="p-3 border text-left">Waktu</th>
                                        <th className="p-3 border text-left">Pengajar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jadwal.map((item, index) => (
                                        console.log('Rendering item:', item.waktu_mulai),
                                        <tr key={item.id} className="border hover:bg-gray-50">
                                            <td className="p-3 border">{index + 1}</td>
                                            <td className="p-3 border font-medium">{item.nama}</td>
                                            <td className="p-3 border">
                                                {dayjs(item.waktu_mulai, 'HH:mm:ss').format('HH:mm')} - {dayjs(item.waktu_selesai, 'HH:mm:ss').format('HH:mm')}
                                            </td>

                                            <td className="p-3 border">{item.pengajar}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}