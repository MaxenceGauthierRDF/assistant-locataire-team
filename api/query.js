// api/query.js
import { supabase } from '../src/lib/supabase';
import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { tenantId, question } = req.body;
  if (!tenantId || !question) {
    return res.status(400).json({ error: 'tenantId et question requis·e·s' });
  }

  try {
    // 1) Récupère les URLs et noms des fichiers pour ce tenant
    const { data: files, error: filesErr } = await supabase
      .from('texts')
      .select('filename,url')
      .eq('tenant_id', tenantId);

    if (filesErr) throw filesErr;

    // 2) Récupère le contenu de chacun
    let docs = '';
    for (const f of files) {
      const resp = await fetch(f.url);
      const text = await resp.text();
      docs += `\n\n=== ${f.filename} ===\n${text}`;
    }

    // 3) Appel à OpenAI
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Sie sind ein höflicher und professioneller KI-Assistent. Beantworten Sie die gestellte Frage ausschließlich in der Sprache der Frage und stützen Sie sich dabei nur auf die bereitgestellten Dokumente für die verwendeten Daten. Seien Sie höflich, klar und präzise in Ihren Antworten, ohne zu übertreiben. Zitieren Sie bei Bedarf relevante Passagen aus den Dokumenten, um Ihre Antwort zu untermauern. Falls die Dokumente Fehler enthalten (Rechtschreibung, Grammatik usw.), korrigieren Sie diese in den Zitaten. Wenn die Frage nicht auf Basis der Dokumente beantwortet werden kann, teilen Sie höflich mit, dass die Information in den bereitgestellten Dokumenten nicht verfügbar ist.' },
        { role: 'user', content: docs + `\n\nQuestion : ${question}` }
      ]
    });

    // 4) Renvoie la réponse
    return res.status(200).json({
      answer: completion.choices[0].message.content
    });

  } catch (err) {
    console.error('[api/query] erreur :', err);
    return res.status(500).json({ error: err.message });
  }
}
