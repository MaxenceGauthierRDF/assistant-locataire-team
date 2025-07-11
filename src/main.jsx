import './styles.css'; // ← SUPER IMPORTANT
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // ← c'est notre fichier logique principal

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
