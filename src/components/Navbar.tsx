import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { User } from '../App'; // Importando o tipo User do App.tsx

interface NavbarProps {
  currentUser?: User | null;
  setCurrentUser?: React.Dispatch<React.SetStateAction<User | null | undefined>>;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (setCurrentUser) setCurrentUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-title">Sistema de Usuários</Link>
      </div>
      <div className="navbar-menu">
        <Link to="/users" className="usuarios-btn">Usuários</Link>
        <Link to="/users/new" className="novo-usuario-btn">Novo Usuário</Link>
        <Link to="/profile" className="navbar-item">
          Olá, {currentUser?.name || currentUser?.email || "usuário"}!
        </Link>
        <button onClick={handleLogout} className="logout-button">
          Sair
        </button>
      </div>
    </nav>
  );
};