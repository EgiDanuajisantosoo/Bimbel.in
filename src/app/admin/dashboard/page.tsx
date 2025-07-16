'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const s = await getSession();
      console.log('Session:', s); // 👈 cek apakah session null atau berisi data
    };
    fetchSession();
  }, []);


  useEffect(() => {
    const fetchSession = async () => {
      try {
        const s = await getSession();
        if (!s) {
          toast.warning('Silakan login terlebih dahulu');
          router.push('/admin/login'); // ganti path sesuai lokasi login kamu
        } else {
          setSession(s);
        }
      } catch (err) {
        toast.error('Gagal mengambil session');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Selamat datang di Dashboard</h1>
        <p className="text-gray-700 mb-6">
          Hai, <span className="font-semibold">{session.user?.name || session.user?.email}</span>
        </p>

        <Link
          href="/api/auth/signout"
          className="flex items-center justify-center text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </Link>
      </div>
    </div>
  );
}
