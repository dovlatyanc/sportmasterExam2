// src/components/GuestOrder.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGuestOrder } from '../api/api.js';

export default function GuestOrder() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await createGuestOrder(formData);
      console.log('Заказ создан:', response);
      setSuccess(true);
      // Опционально: перенаправить на страницу успеха или в корзину
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error('Ошибка при создании заказа:', err);
      setError(err.message || 'Не удалось оформить заказ');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>✅ Заказ успешно оформлен!</h2>
        <p>Спасибо за покупку. Мы свяжемся с вами в ближайшее время.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Оформление заказа (без регистрации)</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label>ФИО *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '6px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '6px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Телефон *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '6px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Адрес доставки *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows="3"
            style={{ width: '100%', padding: '6px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Комментарий (необязательно)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="2"
            style={{ width: '100%', padding: '6px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: loading ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Отправка...' : 'Оформить заказ'}
        </button>
      </form>
    </div>
  );
}