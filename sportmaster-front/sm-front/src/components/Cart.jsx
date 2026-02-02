import { useState, useEffect } from 'react';
import { getCart, removeFromCart, createOrder, createGuestOrder } from '../api/api';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isGuest, setIsGuest] = useState(false);
  const [guestForm, setGuestForm] = useState({ fullName: '', email: '', phone: '', city: '', country: '' });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const items = await getCart();
    setCartItems(items);
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    loadCart();
  };

  const handleOrder = async () => {
    if (isGuest) {
      const guestData = {
        ...guestForm,
        items: cartItems.map(item => ({ productId: item.product.id, quantity: item.quantity }))
      };
      await createGuestOrder(guestData);
      alert('Гостевой заказ оформлен');
    } else {
      await createOrder();
      alert('Заказ оформлен');
    }
    setCartItems([]);
  };

  return (
    <div>
      <h1>Корзина</h1>
      <label>
        <input type="checkbox" checked={isGuest} onChange={(e) => setIsGuest(e.target.checked)} />
        Оформить как гость
      </label>
      {isGuest && (
        <div>
          <input placeholder="ФИО" value={guestForm.fullName} onChange={(e) => setGuestForm({...guestForm, fullName: e.target.value})} />
          <input placeholder="Email" value={guestForm.email} onChange={(e) => setGuestForm({...guestForm, email: e.target.value})} />
          <input placeholder="Телефон" value={guestForm.phone} onChange={(e) => setGuestForm({...guestForm, phone: e.target.value})} />
          <input placeholder="Город" value={guestForm.city} onChange={(e) => setGuestForm({...guestForm, city: e.target.value})} />
          <input placeholder="Страна" value={guestForm.country} onChange={(e) => setGuestForm({...guestForm, country: e.target.value})} />
        </div>
      )}
      <ul>
        {cartItems.map(item => (
          <li key={item.id}>
            {item.product.name} - {item.quantity} шт.
            <button onClick={() => handleRemove(item.product.id)}>Удалить</button>
          </li>
        ))}
      </ul>
      <button onClick={handleOrder} disabled={cartItems.length === 0}>Оформить заказ</button>
    </div>
  );
};

export default Cart;