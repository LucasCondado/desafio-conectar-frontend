import React, { useState } from 'react';
import axios from 'axios';

export const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:3000/auth/register', {
        name,
        email,
        password,
      });
      setSuccess(true);
      alert('Cadastro realizado com sucesso!');
      // Aqui você pode redirecionar para a tela de login, por exemplo:
      // navigate('/login');
    } catch (err: any) {
      console.error('Erro no cadastro:', err.response ? err.response.data : err);
      if (err.response?.status === 409) {
        setError('Este e-mail já está em uso.');
      } else {
        setError('Erro ao registrar. Tente novamente.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastro</h2>
      <input
        type="text"
        placeholder="Nome completo"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
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
      <button type="submit">Cadastrar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Cadastro realizado com sucesso!</p>}
    </form>
  );
};