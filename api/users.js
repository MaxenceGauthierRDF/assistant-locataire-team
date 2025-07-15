// api/users.js
import { supabase } from '../src/lib/supabase';

export default async function handler(req, res) {
  try {
    // 1️⃣ Contrôle rapide des env vars
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('❌ Env vars NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquantes');
    }

    // 2️⃣ Requête Supabase
    const { data, error } = await supabase
      .from('users')
      .select('id,name');

    if (error) throw error;

    return res.status(200).json(data);

  } catch (err) {
    // 3️⃣ On loggue l’erreur pour la voir dans Vercel
    console.error('[api/users] erreur :', err);
    return res.status(500).json({ error: err.message });
  }
}
