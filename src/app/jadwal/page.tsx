'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { format, parse } from 'date-fns';
import { id } from 'date-fns/locale';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Pastikan CSS diimpor
import Image from 'next/image';
import { supabase } from '../../lib/supabaseClient';
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

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
    // const [tanggalSekarang, setTanggalSekarang] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const componentRef = useRef<HTMLDivElement>(null);

    // State untuk modal
    const [showModal, setShowModal] = useState(false);
    const [nama, setNama] = useState('');
    const [pengajar, setPengajar] = useState('Niken');
    const [waktuMulai, setWaktuMulai] = useState('');
    const [waktuSelesai, setWaktuSelesai] = useState('');
    const [tanggal, setTanggal] = useState('');

    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);


    const fetchJadwal = useCallback(async (tanggal: string) => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('jadwal')
                .select('id, nama, pengajar, tanggal, waktu_mulai, waktu_selesai')
                .eq('tanggal', tanggal)
                .order('waktu_mulai', { ascending: true });

            if (fetchError) {
                throw new Error(fetchError.message || 'Gagal memuat data');
            }

            if (!data || data.length === 0) {
                setJadwal([]);
            } else {
                setJadwal(data);
            }
        } catch (err: any) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui');
            setJadwal([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchJadwal(tanggalSekarang);
    }, [tanggalSekarang, fetchJadwal]);

    const handleTambahJadwal = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            nama,
            pengajar,
            tanggal,
            waktu_mulai: waktuMulai,
            waktu_selesai: waktuSelesai
        };

        try {
            let error;

            if (editMode && editId !== null) {
                const res = await supabase
                    .from('jadwal')
                    .update(payload)
                    .eq('id', editId);
                error = res.error;
            } else {
                const res = await supabase
                    .from('jadwal')
                    .insert([payload]);
                error = res.error;
            }

            if (error) throw error;

            toast.success(editMode ? 'Jadwal berhasil diperbarui' : 'Jadwal berhasil ditambahkan');

            // Reset form
            setNama('');
            setPengajar('');
            setTanggal('');
            setWaktuMulai('');
            setWaktuSelesai('');
            setEditMode(false);
            setEditId(null);
            setShowModal(false);
            fetchJadwal(tanggal); // Refresh data
        } catch (err: any) {
            toast.error(`Gagal: ${err.message}`);
        }
    };


    // Turunkan nilai formattedDate dari state tanggalSekarang
    // const formattedDate = format(parse(tanggalSekarang, 'yyyy-MM-dd', new Date()), 'eeee, d MMMM yyyy', { locale: id });

    const handlePrintPDF = useReactToPrint({
        contentRef: componentRef,// Properti yang benar adalah 'content'
        documentTitle: `Jadwal Bimbel - ${formatTanggal || (format as any)(new Date(tanggalSekarang), 'eeee, d MMMM yyyy', { locale: id })}`,
        onPrintError: (err) => toast.error('Gagal mencetak: ' + err),
    });

    const handleExportExcel = () => {
        const dataToExport = jadwal.map(item => ({
            'Nama': item.nama,
            'Waktu Mulai': item.waktu_mulai,
            'Waktu Selesai': item.waktu_selesai,
            'Pengajar': item.pengajar,
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Jadwal');
        worksheet['!cols'] = [
            { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 20 }
        ];
        XLSX.writeFile(workbook, `JadwalBimbel-${tanggalSekarang}.xlsx`);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTanggalSekarang(e.target.value);
    };

    const handleDelete = async (id: number) => {
        const konfirmasi = confirm('Yakin ingin menghapus jadwal ini?');
        if (!konfirmasi) return;

        try {
            const { error } = await supabase.from('jadwal').delete().eq('id', id);
            if (error) throw error;
            toast.success('Jadwal berhasil dihapus');
            fetchJadwal(tanggalSekarang);
        } catch (err: any) {
            toast.error(`Gagal hapus: ${err.message}`);
        }
    };

    const handleEdit = (item: JadwalItem) => {
        setEditMode(true);
        setEditId(item.id);
        setNama(item.nama);
        setPengajar(item.pengajar);
        setTanggal(item.tanggal);
        setWaktuMulai(item.waktu_mulai);
        setWaktuSelesai(item.waktu_selesai);
        setShowModal(true);
    };





    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
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
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto sm:justify-end">
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
                                disabled={loading}
                            >
                                Tambah Jadwal
                            </button>
                            <button
                                onClick={handlePrintPDF}
                                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                disabled={loading || jadwal.length === 0}
                            >
                                Cetak PDF 📄
                            </button>
                            <button
                                onClick={handleExportExcel}
                                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
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



                            <p className="text-lg text-black">
                                {formatTanggal || (format as any)(new Date(tanggalSekarang), 'eeee, d MMMM yyyy', { locale: id })}
                            </p>
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
                                            <th className="p-2 border text-left">No</th>
                                            <th className="p-2 border text-left">Nama</th>
                                            <th className="p-2 border text-left">Waktu</th>
                                            <th className="p-2 border text-left print:hidden">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jadwal.map((item, index) => (
                                            <tr key={item.id} className="border hover:bg-gray-50">
                                                <td className="p-3 border">{index + 1}</td>
                                                <td className="p-3 border font-medium">{item.nama}</td>
                                                <td className="p-3 border">
                                                    {dayjs(item.waktu_mulai, 'HH:mm:ss').format('HH:mm')} - {dayjs(item.waktu_selesai, 'HH:mm:ss').format('HH:mm')}
                                                </td>
                                                <td className="p-3 flex gap-2 print:hidden">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        ❌ Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>
                        )}
                    </div>
                </div>
            </main>

            {showModal && (
                <div className="fixed inset-0 bg-[#00000069]  flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-black">
                            {editMode ? 'Edit Jadwal' : 'Tambah Jadwal'}
                        </h2>

                        <form onSubmit={handleTambahJadwal} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Nama"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded text-black"
                            />
                            <input
                                type="text"
                                placeholder="Pengajar"
                                value={pengajar}
                                onChange={(e) => setPengajar(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded text-black"
                            />
                            <div className="flex gap-4">
                                <div className="w-1/2 text-black">
                                    <label className="text-sm text-gray-600">Tanggal</label>
                                    <input
                                        type="date"
                                        value={tanggal}
                                        onChange={(e) => setTanggal(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="text-sm text-gray-600">Waktu Mulai</label>
                                    <input
                                        type="time"
                                        value={waktuMulai}
                                        onChange={(e) => setWaktuMulai(e.target.value)}
                                        required
                                        className="w-full p-2 border border-gray-300 rounded text-black"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="text-sm text-gray-600">Waktu Selesai</label>
                                    <input
                                        type="time"
                                        value={waktuSelesai}
                                        onChange={(e) => setWaktuSelesai(e.target.value)}
                                        required
                                        className="w-full p-2 border border-gray-300 rounded text-black"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {editMode ? 'Perbarui' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}