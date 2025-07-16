'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserRow from '@/components/UserRow';

export default function UserListPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
      toast.error('Gagal mengambil data user');
    } else {
      setUsers(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 text-black bg-gray-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">Daftar Pengguna</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white shadow-md rounded p-4">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Nama</th>
                <th className="p-2">Email</th>
                <th className="p-2">No. Telepon</th>
                <th className="p-2">Role</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserRow key={user.id} user={user} refresh={fetchUsers} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
