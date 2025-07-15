import React, { useState, useEffect } from 'react';

const STORAGE_KEY = (tenantId) => `chat_history_${tenantId}`;
const MAX_HISTORY = 20;

export default function Chat({ tenantId, onLogout }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY(tenantId));
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        console.error('Failed to parse history');
      }
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
        body: JSON.stringify({ tenantId, question }),
      });
      const { answer, error } = await res.json();
      const assistantReply = error ? `❌ ${error}` : answer;

      setHistory(prev => {
        const updated = [...prev, { user: question, bot: assistantReply, timestamp: Date.now() }];
        return updated.slice(-MAX_HISTORY);
      });
    } catch (err) {
      console.error('Ask error:', err);
      setHistory(prev => [...prev, { user: question, bot: '❌ Erreur réseau', timestamp: Date.now() }]);
    } finally {
      setQuestion('');
      setLoading(false);
    }
  }

  const previous = history.slice(0, -1);
  const latest = history[history.length - 1];

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex-none p-4 bg-gray-800 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Portail Équipe</h1>
        <button onClick={onLogout} className="text-sm text-gray-400 hover:underline">Déconnexion</button>
      </header>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col p-4 overflow-hidden">
        {/* History scrollable above */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
          {previous.map((entry, index) => (
            <div key={index}>
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white p-3 rounded-2xl max-w-[70%] shadow-md">
                  {entry.user}
                </div>
              </div>
              <div className="flex justify-start mt-1">
                <div className="bg-gray-700 text-white p-3 rounded-2xl max-w-[70%] shadow-md">
                  {entry.bot}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Latest exchange below history */}
        {latest && (
          <div className="mb-4">
            <div className="flex justify-end">
              <div className="bg-blue-600 text-white p-3 rounded-2xl max-w-[70%] shadow-md">
                {latest.user}
              </div>
            </div>
            <div className="flex justify-start mt-1">
              <div className="bg-gray-700 text-white p-3 rounded-2xl max-w-[70%] shadow-md">
                {latest.bot}
              </div>
            </div>
          </div>
        )}

        {/* Input area */}
        <form onSubmit={e => { e.preventDefault(); ask(); }} className="flex-none">
          <textarea
            rows={3}
            className="w-full p-3 rounded-md bg-gray-800 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring"
            placeholder="Pose ta question ici"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); } }}
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className={`mt-2 w-full py-2 bg-blue-600 rounded-md font-medium transition ${loading ? 'opacity-50' : 'hover:bg-blue-500'}`}
          >
            {loading ? 'Chargement...' : 'Envoyer'}
          </button>
        </form>
      </main>
    </div>
  );
}
