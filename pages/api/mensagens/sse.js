import { NextApiRequest, NextApiResponse } from 'next';

const subscribers = new Set();

export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  subscribers.add(res);

  req.on('close', () => {
    subscribers.delete(res);
  });
}

export function enviarMensagem(mensagem) {
  const data = JSON.stringify(mensagem);

  subscribers.forEach((res) => {
    res.write(`data: ${data}\n\n`);
  });
}