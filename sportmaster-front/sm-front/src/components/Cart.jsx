// src/components/Cart.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api/api';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await api.getCart();
      setCart(data);
      setError('');
    } catch (err) {
      console.error('Ошибка загрузки корзины:', err);
      if (err.message.includes('401')) {
        setError('Для просмотра корзины нужно войти в систему');
      } else {
        setError('Ошибка загрузки корзины');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await api.removeFromCart(productId);
      await loadCart();
    } catch (err) {
      console.error('Ошибка удаления:', err);
      setError('Не удалось удалить товар');
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        await handleRemove(productId);
        return;
      }
      await api.updateCartItem(productId, newQuantity);
      await loadCart();
    } catch (err) {
      console.error('Ошибка обновления:', err);
      setError('Не удалось обновить количество');
    }
  };

  const handleCheckout = async () => {
    try {
      // Попробуем создать заказ как авторизованный пользователь
      const order = await api.createOrder();
      alert('Заказ оформлен! Номер: ' + order.id);
      navigate('/orders'); // перейти к истории заказов
    } catch (err) {
      if (err.message.includes('401')) {
        // Не авторизован → гостевой заказ
        if (window.confirm('Для оформления заказа нужно войти или продолжить как гость?')) {
          navigate('/guest-order');
        }
      } else {
        alert('Ошибка оформления заказа: ' + err.message);
      }
    }
  };

  const total = cart.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка корзины...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Корзина</h2>
        <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '5px' }}>
          <p style={{ margin: 0 }}>{error}</p>
          <div style={{ marginTop: '10px' }}>
            <button
              onClick={() => navigate('/login')}
              style={{ marginRight: '10px', padding: '8px 16px' }}
            >
              Войти
            </button>
            <button
              onClick={() => navigate('/')}
              style={{ padding: '8px 16px' }}
            >
              К товарам
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Корзина</h1>
      
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Корзина пуста</p>
          <button
            onClick={() => navigate('/')}
            style={{ padding: '10px 20px', marginTop: '10px' }}
          >
            Перейти к товарам
          </button>
        </div>
      ) : (
        <>
          {/* Список товаров */}
          {cart.map(item => (
            <div key={item.id} style={{ 
              border: '1px solid #ddd',
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>{item.product.name}</h3>
                  <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                    {item.product.brand} • {item.product.color} • Размер: {item.product.size}
                  </p>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                    {item.product.price.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                      style={{ width: '30px', height: '30px' }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                      style={{ width: '30px', height: '30px' }}
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleRemove(item.product.id)}
                    style={{
                      padding: '5px 10px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px'
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
              
              <div style={{ 
                marginTop: '10px', 
                paddingTop: '10px',
                borderTop: '1px solid #eee',
                textAlign: 'right'
              }}>
                <strong>Сумма: {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽</strong>
              </div>
            </div>
          ))}
          
          {/* Итого */}
          <div style={{ 
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'right',
            marginTop: '20px'
          }}>
            <h2 style={{ margin: '0 0 15px 0' }}>
              Итого: {total.toLocaleString('ru-RU')} ₽
            </h2>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => navigate('/')}
                style={{
                  padding: '10px 20px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px'
                }}
              >
                Продолжить покупки
              </button>
              
              <button
                onClick={handleCheckout}
                style={{
                  padding: '10px 20px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              >
                Оформить заказ
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;