import React from 'react';
import { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin() {
    try {
      const res = await fetch(`/api?mode=auth&email=${email}&password=${password}`);
      const data = await res.json();
      if (data.success) {
        onLogin(email);
      } else {
        setError("❌ Email ou mot de passe incorrect");
      }
    } catch (err) {
      setError("❌ Erreur réseau");
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="bg-gray-850 p-10 rounded-2xl shadow-xl w-full max-w-sm border border-gray-700">
        <h2 className="text-3xl font-semibold mb-6 text-center text-white">Assistant Locataire</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-500 transition-all p-3 rounded-lg font-medium text-white"
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}
