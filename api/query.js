import { supabase } from '../../lib/supabase';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { tenantId, question } = req.body;
  if (!tenantId || !question) return res.status(400).json({ error: 'tenantId ou question manquant·e' });

  // 1) Récupère les URLs des fichiers
  const { data: files, error: filesErr } = await supabase
    .from('texts')
    .select('url,filename')
    .eq('tenant_id', tenantId);

  if (filesErr) return res.status(500).json({ error: filesErr });

  // 2) Télécharge et concatène le contenu
  let docs = '';
  for (let { url, filename } of files) {
    const response = await fetch(url);
    const text = await response.text();
    docs += `\n\n=== ${filename} ===\n` + text;
  }

  // 3) Appel à ChatGPT Nano
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',  // ou ton nano-model
    messages: [
      { role: 'system', content: 'Tu es un assistant locataire pour mon équipe.' },
      { role: 'user', content: docs + '\n\nQuestion: ' + question }
    ]
  });

  res.status(200).json({ answer: completion.choices[0].message.content });
}
