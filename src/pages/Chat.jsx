import React, { useState } from 'react';
import logo from '../assets/logo.png';



export default function Chat({ email }) {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);


  async function ask() {
    setLoading(true);
    setResponse('');
    try {
      const r = await fetch(`/api?mode=text&email=${email}`);
      const data = await r.json();
      const context = data.text;

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,  // ← ici la virgule
        },
        body: JSON.stringify({
          model: 'gpt-4.1-nano',
          messages: [
            { role: 'system', content: 'Du bist ein intelligenter Mieterassistent, der auf der Grundlage der Dokumente, die du hast, antwortet. Du antwortest in der Sprache, in der dir die Frage gestellt wird.' },
            { role: 'user', content: `Hier sind die Dokumente des Mieters:\n${context}\n\nQuestion: ${question}` }
          ]
        })
      });

      const result = await res.json();
          if (result.error) {
            setResponse("❌ OpenAI Error: " + result.error.message);
          } else {
            const assistantReply = result.choices?.[0]?.message?.content || "❌ Réponse vide";

            // ✅ Historique ici
            setHistory(prev => [
              ...prev,
              { role: 'user', content: question },
              { role: 'assistant', content: assistantReply }
            ]);
          }
        } catch (err) {
          setResponse("❌ Erreur réseau");
        } finally {
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
        <textarea
          placeholder="Pose ta question ici"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          rows={4}
          className="w-full p-4 rounded-md bg-gray-700 text-white placeholder-gray-400 resize-none"
        />
        <div className="my-6 space-y-4 max-h-80 overflow-y-auto pr-2">
          {history.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-3 rounded-lg shadow-md ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'}`}>
                <p className="text-sm">{msg.content}</p>
                <span className="block text-xs mt-1 opacity-50">{msg.role === 'user' ? '👤 Vous' : '🤖 Assistant'}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={ask}
          disabled={loading}
          className={`mt-4 w-full py-3 rounded-md font-medium transition-colors ${
            loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-500'
          }`}
        >
          {loading ? 'Chargement...' : 'Envoyer'}
        </button>

        {loading && (
          <div className="flex flex-col items-center mt-4">
            <div className="w-6 h-6 border-4 border-blue-400 border-dashed rounded-full animate-spin mb-2"></div>
            <p className="text-blue-400 text-sm">Assistant en train de réfléchir...</p>
          </div>
        )}

        {response && (
          <pre className="mt-6 whitespace-pre-wrap bg-gray-700 p-4 rounded-lg max-h-96 overflow-auto shadow-md transition-all duration-500 ease-in-out">
            {response}
          </pre>
        )}
      </div>
    </div>
  );
}