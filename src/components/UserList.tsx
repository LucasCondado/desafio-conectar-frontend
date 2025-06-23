import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Interface para definir o tipo de um usuário
interface User {
  id: string;
  name?: string;
  email: string;
  role?: string;
}

function EmailCell({ email }: { email: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <span
      style={{
        display: 'inline-block',
        maxWidth: expanded ? 'none' : 140,
        whiteSpace: expanded ? 'normal' : 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        verticalAlign: 'middle',
        cursor: 'pointer',
        color: '#388e3c',
        fontWeight: 500,
      }}
      title={email}
      onClick={() => setExpanded(e => !e)}
    >
      {email}
      {!expanded && email.length > 18 && (
        <span style={{
          color: '#888',
          fontWeight: 400,
          marginLeft: 6,
          fontSize: '0.9em'
        }}>
          [expandir]
        </span>
      )}
    </span>
  );
}

// Função para definir o status (pode personalizar a lógica)
const getStatus = (user: User) => {
  // Exemplo: todos ativos, mas você pode mudar
  return "active";
};
const statusColor: Record<string, string> = {
  active: "green",
  inactive: "red",
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || token === 'dummy_token') {
        setError('Token inválido. Faça login novamente.');
        setLoading(false);
        return;
      }
      // Corrija a URL para usar API_URL e ajuste o tratamento do response
      const response = await axios.get(
        `${API_URL}/users?${filter ? `role=${filter}&` : ''}sortBy=${sortBy}&order=${sortOrder}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Ajuste para aceitar tanto response.data quanto response.data.data
      const data = Array.isArray(response.data) ? response.data : response.data.data;
      setUsers(Array.isArray(data) ? data : []);
      setError('');
    } catch (err: any) {
      setError('Erro ao carregar usuários. Verifique suas permissões.');
    } finally {
      setLoading(false);
    }
  }, [filter, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchUsers();
      } catch (err) {
        console.error('Erro ao excluir usuário:', err);
        setError('Erro ao excluir usuário. Verifique suas permissões.');
      }
    }
  };

  if (loading) return <p>Carregando usuários...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Lista de Usuários</h2>
        <Link to="/users/new" className="add-user-button">Adicionar Usuário</Link>
      </div>
      
      {/* Filtros e Ordenação */}
      <div className="user-list-controls">
        <div className="filter-group">
          <label htmlFor="roleFilter">Filtrar por função:</label>
          <select
            id="roleFilter"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="admin">Administradores</option>
            <option value="user">Usuários</option>
          </select>
        </div>
        <div className="sort-group" style={{ display: 'flex', alignItems: 'flex-end', gap: 32 }}>
          <div>
            <label htmlFor="sortBy">Ordenar por:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="name">Nome</option>
              <option value="email">Email</option>
            </select>
          </div>
          <div>
            <label htmlFor="sortOrder">Ordem:</label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
            >
              <option value="asc">Ascendente</option>
              <option value="desc">Descendente</option>
            </select>
          </div>
        </div>
      </div>
      
      {users.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <div className="user-list-container">
          <div className="user-list-content">
            <table className="users-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Nome</th>
                  <th>Email</th>
                  <th>Função</th>
                  <th>Status</th> {/* <-- Nova coluna */}
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name || '-'}</td>
                    <td>
                      <EmailCell email={user.email} />
                    </td>
                    <td>{user.role === 'admin' ? 'Administrador' : 'Usuário'}</td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background: statusColor[getStatus(user)],
                          marginRight: 8,
                          verticalAlign: "middle",
                        }}
                      ></span>
                      {getStatus(user) === "active" ? "Ativo" : "Inativo"}
                    </td>
                    <td>
                      <Link to={`/users/edit/${user.id}`} className="edit-button">Editar</Link>
                      <button onClick={() => handleDeleteUser(user.id)} className="delete-button">
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};