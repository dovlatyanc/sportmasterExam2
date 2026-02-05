
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGuestOrder, getProductsSimple } from '../api/api';

export default function GuestOrder() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProductsSimple();
        setProducts(data);
        const initialQuantities = {};
        data.forEach(p => initialQuantities[p.id] = 0);
        setQuantities(initialQuantities);
      } catch (err) {
        console.error('Ошибка загрузки товаров:', err);
        setError('Не удалось загрузить товары');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleQuantityChange = (productId, value) => {
    const numValue = parseInt(value) || 0;
    setQuantities(prev => ({ ...prev, [productId]: numValue }));
  };

  const validateForm = () => {
    if (!fullName.trim()) {
      alert('Пожалуйста, укажите ФИО');
      return false;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      alert('Пожалуйста, укажите корректный email');
      return false;
    }
    if (!phone.trim()) {
      alert('Пожалуйста, укажите телефон');
      return false;
    }
    if (!city.trim()) {
      alert('Пожалуйста, укажите город');
      return false;
    }
    if (!country.trim()) {
      alert('Пожалуйста, укажите страну');
      return false;
    }

    const selectedItems = products.filter(p => quantities[p.id] > 0);
    if (selectedItems.length === 0) {
      alert('Пожалуйста, выберите хотя бы один товар');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const cartItems = products
        .filter(product => quantities[product.id] > 0)
        .map(product => ({
          productId: product.id,
          quantity: quantities[product.id]
        }));

      const orderData = {
        fullName,
        email,
        phone,
        city,
        country,
        cartItems
      };

      await createGuestOrder(orderData);
      
      // Успех → редирект на страницу успеха
      navigate('/order-success');

    } catch (err) {
      console.error('Ошибка создания заказа:', err);
      
      // Покажем более точную ошибку
      if (err.message && err.message.includes('Недостаточно товара')) {
        setError('Некоторые товары закончились. Обновите страницу.');
      } else {
        setError('Не удалось создать заказ. Проверьте данные и попробуйте снова.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Загрузка товаров...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Быстрый заказ без регистрации</h2>

      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '12px', 
          borderRadius: '6px', 
          marginBottom: '20px' 
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Личные данные */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
          <input
            type="text"
            placeholder="ФИО *"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
            style={{ padding: '10px', fontSize: '16px' }}
          />
          <input
            type="email"
            placeholder="Email *"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ padding: '10px', fontSize: '16px' }}
          />
          <input
            type="tel"
            placeholder="Телефон *"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            style={{ padding: '10px', fontSize: '16px' }}
          />
          <input
            type="text"
            placeholder="Город *"
            value={city}
            onChange={e => setCity(e.target.value)}
            required
            style={{ padding: '10px', fontSize: '16px' }}
          />
          <input
            type="text"
            placeholder="Страна *"
            value={country}
            onChange={e => setCountry(e.target.value)}
            required
            style={{ padding: '10px', fontSize: '16px' }}
          />
        </div>

        <h3>Выберите товары</h3>
        {products.length === 0 ? (
          <p>Нет доступных товаров</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
            {products.map(product => {
              const maxQty = product.stock;
              const options = [<option key="0" value="0">Не выбрано</option>];
              
              for (let i = 1; i <= Math.min(maxQty, 10); i++) {
                options.push(
                  <option key={i} value={i}>
                    {i} шт
                  </option>
                );
              }

              return (
                <div
                  key={product.id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '15px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <strong>{product.name}</strong> — {product.brand}<br/>
                    <small>Цена: {product.price} ₽ • В наличии: {maxQty}</small>
                  </div>
                  <select
                    value={quantities[product.id] || 0}
                    onChange={e => handleQuantityChange(product.id, e.target.value)}
                    style={{ padding: '8px', fontSize: '16px', minWidth: '120px' }}
                  >
                    {options}
                  </select>
                </div>
              );
            })}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '12px 24px',
            fontSize: '18px',
            background: submitting ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: submitting ? 'not-allowed' : 'pointer'
          }}
        >
          {submitting ? 'Оформление...' : 'Оформить заказ'}
        </button>
      </form>
    </div>
  );
}