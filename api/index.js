import fetch from 'node-fetch';

export default async function handler(req, res) {
  const BASE = 'https://script.google.com/macros/s/AKfycbwGZBZ0iJJqJ9DYJEoCtJIItWVJs2PTtou78LIk-syVfpVbbtQnqA7z7ohmsEcbgBtb/exec';
  const { mode, email, password } = req.query;
  const url = new URL(BASE);
  url.searchParams.set('mode', mode);
  url.searchParams.set('email', email);
  if (password) url.searchParams.set('password', password);

  const upstream = await fetch(url);
  const body = await upstream.text();

  res.setHeader('Content-Type', 'application/json');
  res.status(upstream.status).send(body);
}
