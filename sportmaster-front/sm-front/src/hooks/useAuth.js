// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { getProfile } from '../api/api.js';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

 
  const isAdmin = user?.role === 'ADMIN';
  const isUser = user != null; 

  return { user, isAdmin, isUser, loading };
};