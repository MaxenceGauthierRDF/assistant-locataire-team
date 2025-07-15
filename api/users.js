import { supabase } from '../src/lib/supabase';

export default async function handler(req, res) {
  const { data, error } = await supabase.from('users').select('id,name');
  if (error) return res.status(500).json({ error });
  res.status(200).json(data);
}
