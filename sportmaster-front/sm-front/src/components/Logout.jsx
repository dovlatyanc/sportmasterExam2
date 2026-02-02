// src/components/Logout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Вызываем logout на бэкенде
        await fetch('http://localhost:8080/auth/logout', {
          method: 'POST', 
          credentials: 'include' 
        });
      } catch (err) {
        console.warn('Ошибка при выходе:', err);
      } finally {
        navigate('/', { replace: true });
      }
    };

    performLogout();
  }, [navigate]);

  return <div>Выход из аккаунта...</div>;
};

export default Logout;