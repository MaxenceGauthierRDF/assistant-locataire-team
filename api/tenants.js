import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  const { assetId } = req.query;
  if (!assetId) return res.status(400).json({ error: 'assetId manquant' });

  const { data, error } = await supabase
    .from('tenants')
    .select('id,name')
    .eq('asset_id', assetId);
  if (error) return res.status(500).json({ error });
  res.status(200).json(data);
}
