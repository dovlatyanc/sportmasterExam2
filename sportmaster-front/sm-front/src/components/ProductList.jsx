// src/components/ProductList.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import * as api from '../api/api';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    brand: '',
    categoryId: '',
    size: '',
    color: '',
    priceMin: '',
    priceMax: ''
  });

  // Загрузка данных при изменении URL
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Получаем фильтры из URL
        const urlFilters = Object.fromEntries(searchParams);
        
        // Загружаем товары и категории параллельно
        const [productsData, categoriesData] = await Promise.all([
          api.getFilteredProducts(urlFilters),
          api.getCategories()
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
        
        // Синхронизируем состояние формы с URL
        setFilters({
          name: searchParams.get('name') || '',
          brand: searchParams.get('brand') || '',
          categoryId: searchParams.get('categoryId') || '',
          size: searchParams.get('size') || '',
          color: searchParams.get('color') || '',
          priceMin: searchParams.get('priceMin') || '',
          priceMax: searchParams.get('priceMax') || ''
        });
      } catch (err) {
        console.error('Ошибка загрузки товаров:', err);
        setProducts([]); // или тестовые данные
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [searchParams]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    const newParams = {};
    
    // Добавляем только непустые фильтры в URL
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '') {
        newParams[key] = value;
      }
    });
    
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setFilters({
      name: '',
      brand: '',
      categoryId: '',
      size: '',
      color: '',
      priceMin: '',
      priceMax: ''
    });
    setSearchParams({});
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

      {/* Форма поиска */}
      <form onSubmit={applyFilters} style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h3>Поиск и фильтрация</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
          <input
            name="name"
            placeholder="Название"
            value={filters.name}
            onChange={handleFilterChange}
            style={{ padding: '8px' }}
          />
          <input
            name="brand"
            placeholder="Бренд"
            value={filters.brand}
            onChange={handleFilterChange}
            style={{ padding: '8px' }}
          />
          <select
            name="categoryId"
            value={filters.categoryId}
            onChange={handleFilterChange}
            style={{ padding: '8px' }}
          >
            <option value="">Все категории</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input
            name="size"
            placeholder="Размер"
            value={filters.size}
            onChange={handleFilterChange}
            style={{ padding: '8px' }}
          />
          <input
            name="color"
            placeholder="Цвет"
            value={filters.color}
            onChange={handleFilterChange}
            style={{ padding: '8px' }}
          />
          <input
            name="priceMin"
            type="number"
            placeholder="Цена от"
            value={filters.priceMin}
            onChange={handleFilterChange}
            style={{ padding: '8px' }}
          />
          <input
            name="priceMax"
            type="number"
            placeholder="Цена до"
            value={filters.priceMax}
            onChange={handleFilterChange}
            style={{ padding: '8px' }}
          />
        </div>
        <div>
          <button type="submit" style={{ marginRight: '10px', padding: '8px 16px' }}>Применить</button>
          <button 
            type="button" 
            onClick={resetFilters} 
            style={{ padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Сбросить
          </button>
        </div>
      </form>

      {/* Список товаров */}
      {products.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '18px' }}>Товары не найдены</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;