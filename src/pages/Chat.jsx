import React, { useState } from 'react';

export default function Chat({ tenantId, onLogout }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  async function ask() {
    if (!question.trim()) return;
    setLoading(true);
    try {
      // 1. Appel à ton nouvel endpoint /api/query
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId,
          question,
        }),
      });
      const result = await response.json();
      const assistantReply = result.answer || '❌ Pas de réponse';

      // 2. Mise à jour de l'historique (max 20 messages)
      setHistory(prev => {
        const updated = [
          ...prev,
          { role: 'user', content: question },
          { role: 'assistant', content: assistantReply },
        ];
        return updated.slice(-20);
      });
    } catch (err) {
      setHistory(prev => [
        ...prev,
        { role: 'user', content: question },
        { role: 'assistant', content: '❌ Erreur réseau' },
      ]);
    } finally {
      setQuestion('');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 flex flex-col items-center">
      <header className="mb-10 text-center w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-wide text-white/90">
            Portail Équipe
          </h1>
          <button onClick={onLogout} className="text-sm text-gray-300 hover:underline">
            Déconnexion
          </button>
        </div>
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
