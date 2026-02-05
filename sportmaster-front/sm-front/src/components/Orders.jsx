// src/components/Orders.jsx
import { useState, useEffect } from 'react';
import { getMyOrders } from '../api/api';

// Форматирование даты
const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error('Ошибка загрузки заказов:', err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (loading) return <div>Загрузка заказов...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Мои заказы</h2>
      {orders.length === 0 ? (
        <p>У вас пока нет заказов</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <div key={order.id} style={{
              border: '1px solid #ddd',
              padding: '20px',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <h3>Заказ №{order.id}</h3>
                <span style={{ 
                  padding: '4px 8px',
                  background: order.status === 'NEW' ? '#ffc107' : '#28a745',
                  color: 'black',
                  borderRadius: '4px'
                }}>
                  {order.status}
                </span>
              </div>

              {/* Дата */}
              <p><strong>Дата:</strong> {formatDate(order.createdAt)}</p>

              {/* Информация о покупателе */}
              {order.user ? (
                <p><strong>Покупатель:</strong> {order.user.email}</p>
              ) : (
                <div>
                  <p><strong>ФИО:</strong> {order.guestFullName || '—'}</p>
                  <p><strong>Email:</strong> {order.guestEmail || '—'}</p>
                  <p><strong>Телефон:</strong> {order.guestPhone || '—'}</p>
                  <p><strong>Город:</strong> {order.guestCity || '—'}</p>
                  <p><strong>Страна:</strong> {order.guestCountry || '—'}</p>
                </div>
              )}

              {/* Товары */}
              <div style={{ marginTop: '15px' }}>
                <h4>Товары:</h4>
                {order.items.map(item => (
                  <div key={item.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '8px 0',
                    borderBottom: '1px solid #eee'
                  }}>
                    <span>{item.product.name} ({item.quantity} шт)</span>
                    <span>{(item.priceAtOrder * item.quantity).toLocaleString('ru-RU')} ₽</span>
                  </div>
                ))}
              </div>

              {/* Итого */}
              <div style={{ 
                marginTop: '15px', 
                paddingTop: '10px',
                borderTop: '2px solid #000',
                textAlign: 'right',
                fontWeight: 'bold'
              }}>
                Итого: {order.totalPrice?.toLocaleString('ru-RU') || '0'} ₽
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}