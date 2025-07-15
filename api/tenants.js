import { supabase } from '../src/lib/supabase';

export default async function handler(req, res) {
  try {
    const { assetId } = req.query;
    if (!assetId) return res.status(400).json({ error: 'assetId manquant' });

    const { data, error } = await supabase
      .from('tenants')
      .select('id,name')
      .eq('asset_id', assetId);

    if (error) throw error;
    return res.status(200).json(data);

  } catch (err) {
    console.error('[api/tenants] erreur :', err);
    return res.status(500).json({ error: err.message });
  }
}
