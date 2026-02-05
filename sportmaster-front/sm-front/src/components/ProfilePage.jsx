// src/components/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { getProfile, updateProfile, getMyOrders } from '../api/api.js';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    email: '',
    fullName: '',
    city: '',
    country: '',
    phone: ''
  });
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    city: '',
    country: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileData, ordersData] = await Promise.all([
        getProfile(),
        getMyOrders()
      ]);
      setProfile(profileData);
      setOrders(ordersData);
      setFormData({
        fullName: profileData.fullName || '',
        city: profileData.city || '',
        country: profileData.country || '',
        phone: profileData.phone || ''
      });
      setError('');
    } catch (err) {
      setError('Ошибка загрузки данных');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setEditing(false);
      await loadData();
    } catch (err) {
      setError('Ошибка сохранения профиля');
      console.error(err);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Загрузка профиля...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Личный кабинет</h2>

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      {/* Профиль */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Информация о покупателе</h3>
        {editing ? (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '10px', marginBottom: '15px' }}>
              <input
                name="fullName"
                placeholder="ФИО"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                style={{ padding: '8px' }}
              />
              <input
                name="city"
                placeholder="Город"
                value={formData.city}
                onChange={handleInputChange}
                style={{ padding: '8px' }}
              />
              <input
                name="country"
                placeholder="Страна"
                value={formData.country}
                onChange={handleInputChange}
                style={{ padding: '8px' }}
              />
              <input
                name="phone"
                placeholder="Телефон"
                value={formData.phone}
                onChange={handleInputChange}
                style={{ padding: '8px' }}
              />
            </div>
            <button type="submit" style={{ marginRight: '10px' }}>Сохранить</button>
            <button type="button" onClick={() => setEditing(false)}>Отмена</button>
          </form>
        ) : (
          <div>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>ФИО:</strong> {profile.fullName || '—'}</p>
            <p><strong>Город:</strong> {profile.city || '—'}</p>
            <p><strong>Страна:</strong> {profile.country || '—'}</p>
            <p><strong>Телефон:</strong> {profile.phone || '—'}</p>
            <button onClick={() => setEditing(true)} style={{ marginTop: '10px' }}>
              Редактировать
            </button>
          </div>
        )}
      </div>

      {/* История заказов */}
      <div>
        <h3>История заказов ({orders.length})</h3>
        {orders.length === 0 ? (
          <p>У вас пока нет заказов</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {orders.map(order => (
              <div key={order.id} style={{
                border: '1px solid #ddd',
                padding: '15px',
                borderRadius: '6px'
              }}>
                <p><strong>Заказ №{order.id}</strong> — {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Статус: {order.status}</p>
                <p>Сумма: {order.totalAmount} ₽</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}