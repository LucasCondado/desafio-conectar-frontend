import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserProfile } from '../components/UserProfile';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

export function Me() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate('/login');
      });
  }, [navigate]);

  if (loading) return <div>Carregando...</div>;
  if (!user) return null;

  return <UserProfile />;
}