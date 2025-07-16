// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
  const { email, password, username, role } = req.body

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { username, role },
  })

  if (error) return res.status(400).json({ error: error.message })

  res.status(200).json({ user: data.user })
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)