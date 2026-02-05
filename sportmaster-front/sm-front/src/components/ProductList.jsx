// src/components/ProductList.jsx
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import * as api from '../api/api';
import { useSearchParams } from 'react-router-dom';

const ProductList = () => {
  const [searchParams] = useSearchParams(); //
  const categoryId = searchParams.get('categoryId'); //  получаем из ?categoryId=123

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadProducts();
  }, [categoryId]);

  const loadProducts = async () => {
  try {
    setLoading(true);
    
    
    const filters = {};
    if (categoryId) {
      filters.categoryId = categoryId;
    }

    const data = await api.getFilteredProducts(filters);
    setProducts(data);
  } catch (err) {
    console.error('Ошибка загрузки товаров:', err);
    // Тестовые данные
    setProducts([
      { id: 1, name: 'Кроссовки Nike Air Max', price: 9999, stock: 10, brand: 'Nike', color: 'Черный' },
      { id: 2, name: 'Футболка Adidas', price: 2499, stock: 25, brand: 'Adidas', color: 'Белый' },
      { id: 3, name: 'Шорты Puma', price: 1899, stock: 15, brand: 'Puma', color: 'Синий' },
      { id: 4, name: 'Кепка New Era', price: 1599, stock: 5, brand: 'New Era', color: 'Красный' },
    ]);
  } finally {
    setLoading(false);
  }
};

  const handleAddToCart = async (productId) => {
    console.log('Добавляем товар ID:', productId);
    
    try {
      const response = await api.addToCart(productId, 1);
      console.log('Ответ сервера:', response);
      
      if (response.ok) {
        alert('Товар добавлен в корзину!');
        return true;
      } else {
        const text = await response.text();
        console.error('Ошибка сервера:', text);
        
        if (response.status === 401) {
          const shouldLogin = window.confirm(
            'Для добавления в корзину нужно войти. Хотите войти?\n\nOK - Войти\nОтмена - Быстрый заказ'
          );
          
          if (shouldLogin) {
            window.location.href = '/login';
          } else {
            window.location.href = '/guest-order';
          }
        } else {
          alert('Ошибка при добавлении в корзину');
        }
        return false;
      }
    } catch (err) {
      console.error('Ошибка сети:', err);
      alert('Ошибка сети. Проверьте подключение к серверу.');
      return false;
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка товаров...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Товары</h1>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;