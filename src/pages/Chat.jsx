import React, { useState } from 'react';
import logo from '../assets/logo.png';

export default function Chat({ email }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  async function ask() {
    setLoading(true);
    try {
      // 1) Récupère le contexte texte
      const r = await fetch(`/api?mode=text&email=${email}`);
      const data = await r.json();
      const context = data.text;

      // 2) Appel OpenAI
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4.1-nano',
          messages: [
            { role: 'system', content: 'Du bist ein intelligenter Mieterassistent, der auf der Grundlage der Dokumente, die du hast, antwortet.' },
            // **On envoie d’abord tous les docs OCR**
            { role: 'system', content: `Hier sind die Dokumente des Mieters:\n${context}` },
            // puis tout l’historique
            ...history,
            // et enfin la nouvelle question
          ]
        })
      });

      const result = await res.json();
      let assistantReply;
      if (result.error) {
        assistantReply = `❌ OpenAI Error: ${result.error.message}`;
      } else {
        assistantReply = result.choices?.[0]?.message?.content || '❌ Réponse vide';
      }

      // 3) Met à jour l'historique
      setHistory(prev => [
        ...prev,
        { role: 'user', content: question },
        { role: 'assistant', content: assistantReply }
      ]);
    } catch (err) {
      setHistory(prev => [
        ...prev,
        { role: 'user', content: question },
        { role: 'assistant', content: '❌ Erreur réseau' }
      ]);
    } finally {
      // 4) Vide le prompt et stoppe le loader
      setQuestion('');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 flex flex-col items-center">
      <header className="mb-10 text-center">
        <img src={logo} alt="Logo" className="h-16 mx-auto mb-4" />
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-wide text-white/90">
          Redefine Property Management Portal
        </h1>
        <p className="text-sm text-white/60 mt-1 max-w-xl mx-auto leading-relaxed text-center">
          Bienvenue. Posez votre question, un chatbot intelligent vous répondra avec précision.<br />
          Si vos questions ne trouvent pas réponse, sélectionnez XXX et la demande sera directement transmise à votre property manager compétent.
        </p>
      </header>

      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-2xl">
        <form
          onSubmit={e => {
            e.preventDefault();
            ask();
          }}
          className="flex flex-col"
        >
          <textarea
            placeholder="Pose ta question ici"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                ask();
              }
            }}
            rows={4}
            className="w-full p-4 rounded-md bg-gray-700 text-white placeholder-gray-400 resize-none"
          />

          <button
            type="submit"
            disabled={loading || !question.trim()}
            className={`mt-4 w-full py-3 rounded-md font-medium transition-colors ${
              loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {loading ? 'Chargement...' : 'Envoyer'}
          </button>
        </form>

        <div className="my-6 space-y-4 max-h-80 overflow-y-auto pr-2">
          {history.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-3 rounded-lg shadow-md ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'
              }`}>
                <p className="text-sm">{msg.content}</p>
                <span className="block text-xs mt-1 opacity-50">
                  {msg.role === 'user' ? '👤 Vous' : '🤖 Assistant'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
