//file: src/app/admin/addUser/page.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import { createClient } from '@supabase/supabase-js';
import { toast, ToastContainer } from 'react-toastify';
import bcrypt from 'bcryptjs'
import 'react-toastify/dist/ReactToastify.css';

export default function TambahUser() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [no_telp, setNoTelp] = useState('');
    const [role, setRole] = useState('pengajar');
    const [loading, setLoading] = useState(false);
    // const hashedPassword = await bcrypt.hash(password, 10)


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const hashedPassword = await bcrypt.hash(password, 10) // ✨ Hash di dalam blok async

            // kirim data ke API (tidak perlu password di sini kalau pakai Supabase Auth)
            const response = await fetch('/api/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password, // plaintext password → akan di-hash otomatis oleh Supabase
                    username,
                    role
                })
            })

            const result = await response.json()
            if (!response.ok) throw new Error(result.error || 'Gagal membuat user')

            // simpan ke tabel `users`
            const { error: dbError } = await supabase.from('users').insert([
                {
                    username,
                    email,
                    no_telp,
                    role,
                    auth_id: result.user.id,
                    password: hashedPassword // ini hanya jika kamu memang ingin menyimpan password hash
                }
            ])

            if (dbError) throw dbError

            toast.success('User berhasil ditambahkan')
            setUsername('')
            setEmail('')
            setPassword('')
            setNoTelp('')
            setRole('')
        } catch (error: any) {
            console.error('Error menambahkan user:', error.message)
            toast.error(`Gagal menambahkan user: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className="flex items-center justify-center min-h-screen text-black bg-gray-100">
            <ToastContainer />
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Tambah User</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">No. Telepon</label>
                        <input
                            type="text"
                            value={no_telp}
                            onChange={(e) => setNoTelp(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                        >
                            <option value="pengajar">Pengajar</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full px-4 py-2 text-white font-semibold rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            } focus:outline-none focus:ring focus:ring-blue-200 transition-colors duration-300`}
                    >
                        {loading ? 'Loading...' : 'Tambah User'}
                    </button>
                </form>
            </div>
        </div>
    );
}
