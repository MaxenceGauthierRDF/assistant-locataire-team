import React, { useState, useEffect } from 'react';

const STORAGE_KEY = (tenantId) => `chat_history_${tenantId}`;

export default function Chat({ tenantId, onLogout }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // 1️⃣ Charger l'historique depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY(tenantId));
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {}
    }
  }, [tenantId]);

  // 2️⃣ Persister l'historique à chaque mise à jour
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

      // 3️⃣ Mettre à jour l'historique
      setHistory(prev => {
        const updated = [
          ...prev,
          { user: question, bot: assistantReply, timestamp: Date.now() }
        ];
        return updated.slice(-20); // conserve 20 derniers
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 flex flex-col items-center">
      {/* Historique rapide */}
      {history.length > 0 && (
        <section className="w-full max-w-2xl mb-6 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-medium mb-2">Historique rapide</h2>
          <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {history.map((entry, i) => (
              <li key={i} className="text-sm">
                <span className="font-semibold">👤 {entry.user}</span><br/>
                <span className="font-medium">🤖 {entry.bot}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Zone de chat */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-2xl flex flex-col">
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
      </div>
    </div>
  );
}
