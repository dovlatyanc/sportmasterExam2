// src/components/GuestOrder.jsx
import { useState, useEffect } from 'react';
import * as api from '../api/api';

const GuestOrder = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Проверяем, есть ли товар для быстрого заказа
    const quickOrder = JSON.parse(localStorage.getItem('quickOrder') || '{}');
    if (quickOrder.items) {
      setOrderItems(quickOrder.items);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        ...formData,
        items: orderItems
      };

      const result = await api.createGuestOrder(orderData);
      setSuccess(true);
      localStorage.removeItem('quickOrder'); // Очищаем временные данные
    } catch (err) {
      setError('Ошибка при оформлении заказа');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: 'green' }}>Заказ успешно оформлен!</h2>
        <p>Мы свяжемся с вами для подтверждения заказа.</p>
        <button
          onClick={() => window.location.href = '/'}
          style={{ padding: '10px 20px', marginTop: '20px' }}
        >
          Вернуться к товарам
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Быстрый заказ без регистрации</h2>
      
      {orderItems.length > 0 && (
        <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa' }}>
          <h4>Ваш заказ:</h4>
          {orderItems.map((item, index) => (
            <div key={index}>
              Товар #{item.productId} - {item.quantity} шт. - {item.price} ₽
            </div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>ФИО:</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Телефон:</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Адрес:</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        {error && (
          <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 30px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Оформление...' : 'Оформить заказ'}
        </button>
      </form>
    </div>
  );
};

export default GuestOrder;