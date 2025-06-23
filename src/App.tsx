import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { UserList } from './components/UserList';
import { UserForm } from './components/UserForm';
import { Navbar } from './components/Navbar';
import { UserProfile } from './components/UserProfile';
import { ChangePasswordForm } from './components/ChangePasswordForm';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export type User = {
  id: string;
  name?: string;
  email: string;
  role?: string;
};

const PrivateRoute: React.FC<{ element: React.ReactNode; currentUser: User | null | undefined }> = ({ element, currentUser }) => {
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{element}</>;
};

const AppWrapper: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined);
  const location = useLocation();
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const navigate = useNavigate();

  const isAuthRoute = ["/login", "/register"].includes(location.pathname);

  // Atualiza token quando localStorage mudar (ex: login/logout em outra aba)
  useEffect(() => {
    const handler = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // Busca usuário sempre que o token mudar E NÃO houver token na URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');
    if (token && !urlToken) {
      const fetchCurrentUser = async () => {
        try {
          const response = await axios.get(`${API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCurrentUser(response.data);
        } catch (err) {
          setCurrentUser(null);
          localStorage.removeItem('token');
          navigate('/login', { replace: true });
        }
      };
      fetchCurrentUser();
    }
    // Se não houver token e não for rota pública, redireciona para login
    if (!token && !isAuthRoute) {
      setCurrentUser(null);
      navigate('/login', { replace: true });
    }
  }, [token, location, navigate, isAuthRoute]);

  // Wrapper Typescript-safe que aceita valor ou função!
  const setCurrentUserAndToken: React.Dispatch<React.SetStateAction<User | null | undefined>> = (value) => {
    if (typeof value === "function") {
      setCurrentUser(prev => {
        const next = (value as (prev: User | null | undefined) => User | null | undefined)(prev);
        setToken(localStorage.getItem('token'));
        return next;
      });
    } else {
      setCurrentUser(value);
      setToken(localStorage.getItem('token'));
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // Limpa o token da URL e redireciona para /profile sem query
      navigate('/profile', { replace: true });
    }
  }, [location, navigate]);

  if (currentUser === undefined && !isAuthRoute) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="app">
      {currentUser && !isAuthRoute && (
        <Navbar currentUser={currentUser} setCurrentUser={setCurrentUserAndToken} />
      )}
      <div className="content">
        <Routes>
          <Route path="/login" element={<LoginForm setCurrentUser={setCurrentUser} />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/" element={
            <PrivateRoute 
              currentUser={currentUser} 
              element={currentUser?.role === 'admin'
                ? <UserList />
                : <UserProfile />
              } 
            />
          } />
          <Route path="/users" element={
            <PrivateRoute currentUser={currentUser} element={<UserList />} />
          } />
          <Route path="/users/new" element={
            <PrivateRoute currentUser={currentUser} element={<UserForm />} />
          } />
          <Route path="/users/edit/:id" element={
            <PrivateRoute currentUser={currentUser} element={<UserForm isEditMode={true} />} />
          } />
          <Route path="/profile" element={
            <PrivateRoute currentUser={currentUser} element={<UserProfile />} />
          } />
          <Route path="/me" element={
            <PrivateRoute currentUser={currentUser} element={<UserProfile />} />
          } />
          <Route path="/profile/change-password" element={
            <PrivateRoute currentUser={currentUser} element={<ChangePasswordForm />} />
          } />
          <Route path="/google/redirect" element={
            <PrivateRoute currentUser={currentUser} element={<Navigate to="/profile" />} />
          } />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default App;