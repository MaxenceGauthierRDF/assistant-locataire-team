import React, { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = (tenantId) => `chat_history_${tenantId}`;
const MAX_HISTORY = 20;

export default function Chat({ tenantId, onLogout }) {
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY(tenantId));
    if (saved) setHistory(JSON.parse(saved));
  }, [tenantId]);

  // Save history
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY(tenantId), JSON.stringify(history));
  }, [history, tenantId]);

  // Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, question }),
      });
      const { answer, error } = await res.json();
      const bot = error ? `❌ ${error}` : answer;
      setHistory(prev => [...prev, { user: question, bot, ts: Date.now() }].slice(-MAX_HISTORY));
    } catch {
      setHistory(prev => [...prev, { user: question, bot: '❌ Erreur réseau', ts: Date.now() }].slice(-MAX_HISTORY));
    }
    setQuestion('');
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <h1 className="text-lg font-medium">Portail Équipe</h1>
          <button onClick={onLogout} className="text-sm hover:underline">Déconnexion</button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="max-w-xl mx-auto h-full flex flex-col p-4">
          <div className="flex-1 overflow-y-auto space-y-4">
            {history.map((item, i) => (
              <div key={i} className="flex flex-col">
                <div className="self-end bg-blue-600 p-2 rounded-lg max-w-[80%]">
                  {item.user}
                </div>
                <div className="self-start bg-gray-700 p-2 rounded-lg max-w-[80%] mt-1">
                  {item.bot}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          <form onSubmit={e => { e.preventDefault(); handleAsk(); }} className="mt-4">
            <textarea
              rows={2}
              className="w-full p-2 rounded bg-gray-800 text-white resize-none"
              placeholder="Pose ta question..."
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAsk();
                }
              }}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="mt-2 w-full py-2 bg-blue-600 rounded disabled:opacity-50"
            >
              {loading ? '...' : 'Envoyer'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
