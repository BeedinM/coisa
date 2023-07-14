import axios from 'axios';
import { useState, useEffect } from 'react';
import styles from '../styles/style.module.css';

export default function FormMsg() {
  const [arquivoMsg, setArquivoMsg] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/mensagens/sse');

    eventSource.onmessage = (event) => {
      const novaMsg = JSON.parse(event.data);
      setArquivoMsg((prevArquivoMsg) => [...prevArquivoMsg, novaMsg]);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const EnviarMsg = async (event) => {
    event.preventDefault();

    const { nome, msg } = event.target.elements;

    try {
      const response = await axios.post('/api/mensagens', {
        nome: nome.value,
        msg: msg.value,
      });

      setArquivoMsg((prevArquivoMsg) => [...prevArquivoMsg, response.data]);

      nome.value = '';
      msg.value = '';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={EnviarMsg}>
        <input type="text" name="nome" />
        <input type="text" name="msg" />
        
        <button type="submit">Enviar</button>
      </form>

      <div className={styles.divMsgTotal}>
        {arquivoMsg.map((item, index) => (
          <div key={index} className={styles.divMsg}>
            <p>Nome: {item.nome}</p>
            <p>Mensagem: {item.msg}</p>
          </div>
        ))}
      </div>
    </>
  );
}