import { useState } from 'react';
import { login } from '../api/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  try {
    const response = await login(email, password); 
    if (response.ok) {
      alert('Успешный вход!');
      if (onLogin) onLogin();
    } else {
      setError('Неверный email или пароль');
    }
  } catch (err) {
    setError('Ошибка соединения');
  }
};

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};

export default Login;