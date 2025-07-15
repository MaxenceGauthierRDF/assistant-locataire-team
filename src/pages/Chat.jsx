import React, { useState, useEffect } from 'react';

const STORAGE_KEY = (tenantId) => `chat_history_${tenantId}`;

export default function Chat({ tenantId, onLogout }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY(tenantId));
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {};
    }
  }, [tenantId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY(tenantId), JSON.stringify(history));
  }, [history, tenantId]);

  async function ask() {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, question })
      });
      const { answer, error } = await res.json();
      const assistantReply = error ? `❌ ${error}` : answer;

      setHistory(prev => {
        const updated = [
          ...prev,
          { user: question, bot: assistantReply, timestamp: Date.now() }
        ];
        return updated.slice(-20);
      });

    } catch {
      setHistory(prev => [
        ...prev,
        { user: question, bot: '❌ Erreur réseau', timestamp: Date.now() }
      ]);
    } finally {
      setQuestion('');
      setLoading(false);
    }
  }

  const previous = history.slice(0, -1);
  const latest = history[history.length - 1];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 flex flex-col items-center">
      <header className="mb-6 text-center w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-wide text-white/90">
            Portail Équipe
          </h1>
          <button onClick={onLogout} className="text-sm text-gray-300 hover:underline">
            Déconnexion
          </button>
        </div>
      </header>

      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-2xl flex flex-col">
        {/* Ancienne histoire (tout sauf le dernier) */}
        {previous.length > 0 && (
          <div className="mb-4 space-y-4 max-h-40 overflow-y-auto pr-2">
            {previous.map((entry, i) => (
              <div key={i}>
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white p-2 rounded-2xl max-w-[75%]">
                    {entry.user}
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-white p-2 rounded-2xl max-w-[75%]">
                    {entry.bot}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Formulaire */}
        <form
          onSubmit={e => { e.preventDefault(); ask(); }}
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

        {/* Dernière réponse juste en dessous */}
        {latest && (
          <div className="mt-4 space-y-4">
            <div className="flex justify-end">
              <div className="bg-blue-600 text-white p-2 rounded-2xl max-w-[75%]">
                {latest.user}
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-gray-700 text-white p-2 rounded-2xl max-w-[75%]">
                {latest.bot}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
