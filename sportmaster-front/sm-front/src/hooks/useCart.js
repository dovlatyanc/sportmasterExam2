// src/hooks/useCart.js
import { useState, useEffect } from 'react';
import * as api from '../api/api';

export const useCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await api.getCart();
      setCart(data.items || data || []); // Проверьте структуру ответа
      setError(null);
    } catch (err) {
      console.error('Ошибка загрузки корзины:', err);
      setError('Ошибка загрузки корзины');
      // Для отладки - временно используем моковые данные
      setCart([
        { id: 1, productId: 1, name: 'Кроссовки Nike', price: 9999, quantity: 1 },
        { id: 2, productId: 2, name: 'Футболка Adidas', price: 2499, quantity: 2 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      console.log('Добавление в корзину productId:', productId);
      const response = await api.addToCart(productId, quantity);
      
      if (response.ok || response.status === 200) {
        await loadCart(); // Перезагружаем корзину
        console.log('Товар успешно добавлен в корзину');
        return true;
      } else {
        throw new Error('Ошибка сервера');
      }
    } catch (err) {
      console.error('Ошибка добавления в корзину:', err);
      setError('Не удалось добавить товар в корзину');
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await api.removeFromCart(productId);
      await loadCart();
      return true;
    } catch (err) {
      console.error('Ошибка удаления из корзины:', err);
      setError('Не удалось удалить товар из корзины');
      return false;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        return await removeFromCart(productId);
      }
      
      await api.updateCartItem(productId, quantity);
      await loadCart();
      return true;
    } catch (err) {
      console.error('Ошибка обновления количества:', err);
      setError('Не удалось обновить количество');
      return false;
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 0)), 0);

  return {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    totalItems,
    totalPrice,
    loadCart
  };
};