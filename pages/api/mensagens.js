import fs from 'fs';
import path from 'path';
import { enviarMensagem } from './mensagens/sse.js';


const arquivoMsgPath = path.join(process.cwd(), 'arquivoMsg.json');

export default function msgHandler(req, res) {
  if (req.method === 'POST') {
    const { nome, msg } = req.body;

    const novaMsg = { nome, msg };

    let arquivoMsg = [];

    try {
      const arquivoMsgData = fs.readFileSync(arquivoMsgPath, 'utf8');
      arquivoMsg = JSON.parse(arquivoMsgData);
    } catch (error) {
      console.error(error);
    }

    arquivoMsg.push(novaMsg);

    try {
      fs.writeFileSync(arquivoMsgPath, JSON.stringify(arquivoMsg));
      enviarMensagem(novaMsg); // Notificar os clientes sobre a nova mensagem

      res.status(200).json(novaMsg);
    } catch (error) {
      console.error(error);
    }

  } else if (req.method === 'GET') {
    try {
      const arquivoMsgData = fs.readFileSync(arquivoMsgPath, 'utf8');
      const arquivoMsg = JSON.parse(arquivoMsgData);
      res.status(200).json(arquivoMsg);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao carregar as mensagens' });
    }
  } else {
    res.status(405).json({ message: 'Método HTTP não permitido' });
  }
}