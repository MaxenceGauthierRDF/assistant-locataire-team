// api/users.js
import { supabase } from '../src/lib/supabase';

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('users')
    .select('id,name');

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(data);
}
