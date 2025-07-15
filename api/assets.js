import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId manquant' });

  const { data, error } = await supabase
    .from('assets')
    .select('id,code')
    .eq('user_id', userId);
  if (error) return res.status(500).json({ error });
  res.status(200).json(data);
}
