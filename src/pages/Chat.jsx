// Nouvelle version corrigée de Chat.jsx
import React, { useState } from 'react';
import logo from '../assets/logo.png';

export default function Chat({ email, onLogout }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  async function ask() {
    if (!question.trim()) return;
    setLoading(true);
    try {
      // 1. Récupère le contexte texte
      const r = await fetch(`/api?mode=text&email=${encodeURIComponent(email)}`);
      const data = await r.json();
      const context = data.text;

      // 2. Prépare les messages pour l'appel OpenAI
      const messages = [
        { role: 'system', content: 'Du bist ein intelligenter Mieterassistent, der auf der Grundlage der Dokumente, die du hast, antwortet.' },
        { role: 'user', content: `Hier sind die Dokumente des Mieters :\n${context}` },
        ...history,
        { role: 'user', content: question }
      ];

      // 3. Appel OpenAI
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4.1-nano',
          messages
        })
      });

      const result = await res.json();
      const assistantReply = result.error
        ? `❌ OpenAI Error: ${result.error.message}`
        : result.choices?.[0]?.message?.content || '❌ Réponse vide';

      // 4. Met à jour l'historique et limite à 20 messages
      setHistory(prev => {
        const updated = [
          ...prev,
          { role: 'user', content: question },
          { role: 'assistant', content: assistantReply }
        ];
        return updated.slice(-20);
      });

    } catch (err) {
      setHistory(prev => [
        ...prev,
        { role: 'user', content: question },
        { role: 'assistant', content: '❌ Erreur réseau' }
      ]);
    } finally {
      setQuestion('');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 flex flex-col items-center">
      {/* Header avec logo et titre */}
      <header className="mb-10 text-center">
        <img src={logo} alt="Logo" className="h-16 mx-auto mb-4" />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-wide text-white/90">
            Redefine Property Management Portal
          </h1>
          <button onClick={onLogout} className="text-sm text-gray-300 hover:underline">
            Déconnexion
          </button>
        </div>
        <p className="text-sm text-white/60 max-w-xl mx-auto leading-relaxed">
          Bienvenue {email}. Posez votre question ci-dessous ; un chatbot intelligent vous répondra.
        </p>
      </header>

      {/* Zone de chat */}
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

        {/* Affichage de l'historique des messages */}
        <div className="my-6 space-y-4 max-h-80 overflow-y-auto pr-2">
          {history.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
