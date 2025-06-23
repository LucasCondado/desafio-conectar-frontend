import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User } from '../App';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const LoginForm: React.FC<{ setCurrentUser: React.Dispatch<React.SetStateAction<User | null | undefined>> }> = ({ setCurrentUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      // 1. Faz login e obtém o token
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const token = response.data.access_token;
      localStorage.setItem('token', token);

      // 2. Busca o perfil do usuário logado
      const profileRes = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 3. Atualiza o estado com os dados do usuário
      setCurrentUser(profileRes.data);

      // 4. Redireciona conforme o tipo de usuário
      if (profileRes.data.role === 'admin') {
        navigate('/users');
      } else {
        navigate('/profile');
      }

      setSuccess(true);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('E-mail ou senha inválidos');
      } else {
        setError('Erro ao conectar com o servidor. Tente novamente.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={success}>Entrar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Login realizado com sucesso! Redirecionando...</p>}
      <p>
        Não tem uma conta? <Link to="/register">Cadastre-se</Link>
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
        <a href={`${process.env.REACT_APP_API_URL}/auth/google`} style={{ textDecoration: 'none' }}>
          <button
            type="button"
            style={{
              background: '#fff',
              border: '1px solid #ccc',
              color: '#333',
              padding: 8,
              borderRadius: 4,
              cursor: 'pointer',
              width: '100%', // mantém o tamanho igual ao anterior
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
              alt="Google"
              style={{ width: 18, marginRight: 8, verticalAlign: 'middle' }}
            />
            Entrar com Google
          </button>
        </a>
      </div>
    </form>
  );
};