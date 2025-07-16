'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TambahJadwalPage() {
    const [nama, setNama] = useState('');
    const [pengajar, setPengajar] = useState('');
    const [tanggal, setTanggal] = useState('');
    const [waktuMulai, setWaktuMulai] = useState('');
    const [waktuSelesai, setWaktuSelesai] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from('jadwal').insert([{
                nama,
                pengajar,
                tanggal,
                waktu_mulai: waktuMulai,
                waktu_selesai: waktuSelesai
            }]);

            if (error) throw error;

            toast.success('Jadwal berhasil ditambahkan');
            // Kosongkan form
            setNama('');
            setPengajar('Niken');
            setTanggal('');
            setWaktuMulai('');
            setWaktuSelesai('');
            // Optional: redirect ke jadwal utama
            // router.push('/admin/jadwal');
        } catch (err: any) {
            toast.error(`Gagal menambahkan jadwal: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
            <ToastContainer />
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-4">Tambah Jadwal</h1>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nama"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                    />
                    <input
                        type="text"
                        placeholder="Pengajar"
                        value={pengajar}
                        onChange={(e) => setPengajar(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                    <input
                        type="date"
                        value={tanggal}
                        onChange={(e) => setTanggal(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                    <input
                        type="time"
                        value={waktuMulai}
                        onChange={(e) => setWaktuMulai(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                    <input
                        type="time"
                        value={waktuSelesai}
                        onChange={(e) => setWaktuSelesai(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full px-4 py-2 text-white font-semibold rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {loading ? 'Menambahkan...' : 'Tambah Jadwal'}
                    </button>
                </form>
            </div>
        </div>
    );
}
