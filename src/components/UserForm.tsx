import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api'; // Use a instância configurada!
import './UserForm.css';

interface UserFormProps {
  isEditMode?: boolean;
  initialData?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
}

export const UserForm: React.FC<UserFormProps> = ({ isEditMode = false, initialData = {} }) => {
  const { id: urlId } = useParams();
  const userId = initialData.id || urlId;

  const [name, setName] = useState(initialData.name || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(initialData.role || 'user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode && userId) {
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await api.get(`/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          setName(response.data.name || '');
          setEmail(response.data.email || '');
          setRole(response.data.role || 'user');
        } catch (err) {
          console.error('Erro ao carregar dados do usuário:', err);
          setError('Erro ao carregar dados do usuário');
        }
      };

      fetchUserData();
    }
  }, [isEditMode, userId]);

  const validateForm = () => {
    if (!name.trim()) {
      setError('Nome é obrigatório');
      return false;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Email válido é obrigatório');
      return false;
    }

    if (!isEditMode && (!password || password.length < 6)) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (!isEditMode && password !== confirmPassword) {
      setError('As senhas não correspondem');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    const userData = {
      name,
      email,
      role,
      ...(password ? { password } : {})
    };

    try {
      if (isEditMode && userId) {
        await api.put(`/users/${userId}`, userData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setSuccess(true);
        setTimeout(() => navigate('/'), 1500);
      } else {
        if (!password) {
          setError('Senha é obrigatória para novos usuários');
          setLoading(false);
          return;
        }

        await api.post('/users', userData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setSuccess(true);
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err: any) {
      console.error('Erro ao salvar usuário:', err);
      setError(err.response?.data?.message || 'Erro ao salvar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form-container">
      <h2>{isEditMode ? 'Editar Usuário' : 'Novo Usuário'}</h2>

      {success && (
        <div className="success-message">
          Usuário {isEditMode ? 'atualizado' : 'criado'} com sucesso! Redirecionando...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {!isEditMode && (
          <>
            <div className="form-group">
              <label htmlFor="password">Senha:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Senha:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="role">Função:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">Usuário</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="cancel-button"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || success}
            className="save-button"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};