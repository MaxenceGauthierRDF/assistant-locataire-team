import fetch from 'node-fetch';

export default async function handler(req, res) {
  const SCRIPT_BASE = 'https://script.google.com/macros/s/AKfycbwGZBZ0iJJqJ9DYJEoCtJIItWVJs2PTtou78LIk-syVfpVbbtQnqA7z7ohmsEcbgBtb/exec';

  // On reprend les mêmes paramètres que dans React
  const { mode, email, password } = req.query;

  // Construit l’URL vers ton Apps Script
  const url = new URL(SCRIPT_BASE);
  url.searchParams.set('mode', mode);
  url.searchParams.set('email', email);
  if (password) url.searchParams.set('password', password);

  // Appelle Google Script en serveur à serveur
  const upstream = await fetch(url.toString());
  const body = await upstream.text(); // c’est du JSON pur

  // On renvoie
  res.setHeader('Content-Type', 'application/json');
  res.status(upstream.status).send(body);
}
