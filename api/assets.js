import { supabase } from '../src/lib/supabase';

export default async function handler(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId manquant' });

    const { data, error } = await supabase
      .from('assets')
      .select('id,code')
      .eq('user_id', userId);

    if (error) throw error;
    return res.status(200).json(data);

  } catch (err) {
    console.error('[api/assets] erreur :', err);
    return res.status(500).json({ error: err.message });
  }
}
