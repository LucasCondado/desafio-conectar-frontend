import React, { useState } from 'react';
import axios from 'axios';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });
      console.log('Resposta do backend:', response.data);
      localStorage.setItem('token', response.data.access_token);
      alert('Login realizado com sucesso!');
      // Exemplo de redirecionamento (caso esteja usando react-router)
      // navigate('/');
    } catch (err: any) {
      console.error('Erro no login:', err.response ? err.response.data : err);
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
      <button type="submit">Entrar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};