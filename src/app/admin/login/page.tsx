'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'; // Hanya butuh signIn
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Serahkan seluruh proses autentikasi ke NextAuth
      const result = await signIn('credentials', {
        redirect: false, // Jangan redirect otomatis, kita tangani manual
        email: email,
        password: password,
      });

      if (result?.error) {
        // Jika ada error dari NextAuth (misal: password salah), tampilkan pesan
        toast.error(result.error);
      } else if (result?.ok) {
        // Jika berhasil (result.ok bernilai true)
        toast.success('Login berhasil!');
        router.push('/admin/dashboard');
        router.refresh(); // Refresh halaman untuk memperbarui sesi
      }
    } catch (error) {
      toast.error('Terjadi kesalahan yang tidak diketahui.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black">Login</h1>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 mt-1 border text-gray-700 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 mt-1 border text-gray-700 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center px-4 py-3 font-semibold text-white rounded-md ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors duration-300`}
          >
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}