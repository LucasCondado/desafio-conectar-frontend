import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface User {
  id: string;
  name?: string;
  email: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/me');
        setUser(res.data);
      } catch (err) {
        setError('Erro ao carregar perfil. Faça login novamente.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <p>Carregando perfil...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!user) return null;

  return (
    <div className="user-profile">
      <h2>Meu Perfil</h2>
      <div className="profile-card">
        <div className="profile-field">
          <label>Nome:</label>
          <p>{user.name || '-'}</p>
        </div>
        <div className="profile-field">
          <label>Email:</label>
          <p>{user.email || '-'}</p>
        </div>
        <div className="profile-field">
          <label>Função:</label>
          <p>
            {user.role
              ? user.role === 'admin'
                ? 'Administrador'
                : 'Usuário'
              : '-'}
          </p>
        </div>
        {user.createdAt && (
          <div className="profile-field">
            <label>Criado em:</label>
            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        )}
        {user.updatedAt && (
          <div className="profile-field">
            <label>Atualizado em:</label>
            <p>{new Date(user.updatedAt).toLocaleDateString()}</p>
          </div>
        )}
      </div>
      <div style={{ marginTop: 16 }}>
        <Link to="/profile/change-password">Alterar senha</Link>
      </div>
    </div>
  );
};