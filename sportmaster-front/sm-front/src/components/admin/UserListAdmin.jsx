// src/components/admin/UserListAdmin.jsx
import { useState, useEffect } from 'react';
import {
  getAdminUsers,
  disableUser,
  enableUser,
  deleteAdminUser
} from '../../api/api.js';

export default function UserListAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAdminUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Не удалось загрузить пользователей');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    try {
      if (user.enabled) {
        await disableUser(user.id);
      } else {
        await enableUser(user.id);
      }
      await loadUsers(); // обновляем список
    } catch (err) {
      setError(err.message || 'Ошибка изменения статуса');
    }
  };

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Удалить пользователя ${email}? Это действие нельзя отменить.`)) return;
    try {
      await deleteAdminUser(id);
      await loadUsers();
    } catch (err) {
      setError('Ошибка удаления пользователя');
      console.error(err);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Загрузка пользователей...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Управление пользователями</h2>

      {error && (
        <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Email</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Роль</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Статус</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>
                  Нет пользователей
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{user.email}</td>
                  <td style={{ padding: '12px' }}>
                    {user.role?.name || '—'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      color: user.enabled ? '#28a745' : '#dc3545',
                      fontWeight: 'bold'
                    }}>
                      {user.enabled ? 'Активен' : 'Заблокирован'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => handleToggleStatus(user)}
                      style={{
                        marginRight: '8px',
                        padding: '6px 12px',
                        background: user.enabled ? '#ffc107' : '#28a745',
                        color: 'black',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {user.enabled ? 'Заблокировать' : 'Разблокировать'}
                    </button>
                    <button
                      onClick={() => handleDelete(user.id, user.email)}
                      style={{
                        padding: '6px 12px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}