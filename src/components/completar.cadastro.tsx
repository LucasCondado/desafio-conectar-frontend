import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CompletarCadastro: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const email = params.get('email') || '';

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      // Cria o usuário e já recebe o token correto do backend
      const res = await axios.post('http://localhost:3001/users/completar-cadastro', {
        name,
        email,
        password,
        role: 'user',
        provider: 'google',
      });

      // Salva o token e redireciona
      localStorage.setItem('token', res.data.access_token);
      navigate('/profile');
    } catch (err: any) {
      setErro('Erro ao completar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 8 }}>
      <h2>Completar Cadastro</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} readOnly style={{ width: '100%' }} />
        </div>
        <div>
          <label>Nome completo:</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ width: '100%' }}
          />
        </div>
        {erro && <div style={{ color: 'red', marginTop: 8 }}>{erro}</div>}
        <button type="submit" disabled={loading} style={{ marginTop: 16, width: '100%' }}>
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
};

export default CompletarCadastro;