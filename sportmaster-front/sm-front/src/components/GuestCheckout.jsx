// GuestCheckout.jsx
import { useState } from 'react';
import { createGuestOrder } from '../api/api';
import { getGuestCart, clearGuestCart } from '../utils/guestCart';

const GuestCheckout = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cartItems = getGuestCart();

    if (cartItems.length === 0) {
      setMessage('Корзина пуста');
      return;
    }

    try {
      const orderData = {
        ...formData,
        cartItems // ← передаём товары
      };

      const response = await createGuestOrder(orderData);
      
      if (response.ok) {
        clearGuestCart(); // очищаем корзину после заказа
        setMessage('Заказ оформлен! Спасибо!');
      } else {
        setMessage('Ошибка при оформлении заказа');
      }
    } catch (err) {
      setMessage('Ошибка соединения');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Оформление заказа (без регистрации)</h2>
      
      <input name="fullName" placeholder="ФИО" value={formData.fullName} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input name="phone" placeholder="Телефон" value={formData.phone} onChange={handleChange} required />
      <textarea name="address" placeholder="Адрес доставки" value={formData.address} onChange={handleChange} required />

      {message && <p>{message}</p>}
      <button type="submit">Оформить заказ</button>
    </form>
  );
};

export default GuestCheckout;