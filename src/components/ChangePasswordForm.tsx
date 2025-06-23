import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const ChangePasswordForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/auth/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Senha atual incorreta.');
      } else {
        setError('Erro ao alterar senha. Tente novamente.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 360, margin: '40px auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2>Alterar Senha</h2>
      <input
        type="password"
        placeholder="Senha atual"
        value={currentPassword}
        onChange={e => setCurrentPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Nova senha"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirmar nova senha"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        required
      />
      <button type="submit">Alterar Senha</button>
      {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
      {success && <p style={{ color: 'green', margin: 0 }}>Senha alterada com sucesso!</p>}
    </form>
  );
};