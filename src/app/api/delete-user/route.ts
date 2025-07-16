import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Wajib pakai service role!
);

export async function DELETE(req: Request) {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json({ error: 'user_id diperlukan' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(user_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'User berhasil dihapus dari Supabase Auth' }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Terjadi kesalahan saat penghapusan' }, { status: 500 });
  }
}
