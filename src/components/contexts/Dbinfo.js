import React, { useEffect, useState } from 'react';
import api from '../api'; // ajuste o caminho conforme sua estrutura

function DbInfo() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    api.get('/api/db-info')
      .then(res => {
        setInfo(res.data);
        setLoading(false);
      })
      .catch(err => {
        setErro('Erro ao buscar informações do banco');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Carregando informações do banco...</div>;
  if (erro) return <div>{erro}</div>;

  return (
    <div>
      <h2>Banco conectado: {info.database}</h2>
      <h3>Tabelas:</h3>
      <ul>
        {info.tables.map((tabela, idx) => (
          <li key={idx}>{tabela}</li>
        ))}
      </ul>
    </div>
  );
}

export default DbInfo;