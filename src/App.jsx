import React, { useState } from 'react';
import Login from './pages/Login.jsx';
import Chat from './pages/Chat.jsx';

export default function App() {
  const [email, setEmail] = useState('');

  return (
    <>
      {email ? (
        <Chat email={email} />
      ) : (
        <Login onLogin={setEmail} />
      )}
    </>
  );
}
