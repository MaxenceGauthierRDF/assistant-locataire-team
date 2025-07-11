import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `/api?mode=auth&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      );
      const data = await res.json();
      if (data.success) {
        onLogin(email);
      } else {
        setError('❌ Email ou mot de passe incorrect');
      }
    } catch {
      setError('❌ Erreur réseau');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        handleLogin();
      }}
      className="min-h-screen bg-gray-900 flex items-center justify-center text-white px-4"
    >
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Assistant Locataire</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-md bg-gray-700 text-white placeholder-gray-400"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full p-3 mb-4 rounded-md bg-gray-700 text-white placeholder-gray-400"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleLogin();
            }
          }}
        />

        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-md font-medium transition-colors ${
            loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-500'
          }`}
        >
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </div>
    </form>
  );
}
