'use client';

import { supabase } from '../lib/supabaseClient';
import { toast } from 'react-toastify';

export default function UserRow({ user, refresh }: any) {
  const handleDelete = async () => {
    if (!confirm(`Hapus user ${user.username}?`)) return;

    try {
      // Hapus dari auth.users
      await fetch('/api/delete-user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.auth_id })
      });

      // Hapus dari table publik
      await supabase.from('users').delete().eq('id', user.id);

      toast.success('User berhasil dihapus');
      refresh();
    } catch (err: any) {
      toast.error('Gagal menghapus user');
      console.error(err.message);
    }
  };

  return (
    <tr className="border-b">
      <td className="p-2">{user.username}</td>
      <td className="p-2">{user.email}</td>
      <td className="p-2">{user.no_telp}</td>
      <td className="p-2 capitalize">{user.role}</td>
      <td className="p-2">
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
          onClick={handleDelete}
        >
          Hapus
        </button>
      </td>
    </tr>
  );
}
