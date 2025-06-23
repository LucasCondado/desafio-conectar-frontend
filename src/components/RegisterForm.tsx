import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
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
      await axios.post(`${API_URL}/users`, {
        name,
        email,
        password,
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('Este e-mail já está em uso.');
      } else {
        setError('Erro ao registrar. Tente novamente.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 360, margin: '40px auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
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
      {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
      {success && <p style={{ color: 'green', margin: 0 }}>Cadastro realizado com sucesso!</p>}
      <p>
        Já tem uma conta? <Link to="/login">Faça login</Link>
      </p>
    </form>
  );
};