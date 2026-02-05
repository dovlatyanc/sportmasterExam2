// src/components/Category.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../api/api';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка категорий с бэкенда
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
  
      const response = await fetch('http://localhost:8080/categories');
      if (!response.ok) throw new Error('Ошибка загрузки категорий');
      
      const data = await response.json();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить категории');
      console.error(err);
      
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Загрузка категорий...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Категории товаров</h1>
      
      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}
      
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        {categories.map(category => (
          <Link 
            key={category.id}
            to={`/products/?categoryId=${category.id}`}
            style={{
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <div style={{
              border: '1px solid #ddd',
              padding: '20px',
              width: '200px',
              textAlign: 'center',
              borderRadius: '5px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#007bff';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#ddd';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <h3 style={{ margin: '0 0 10px 0' }}>{category.name}</h3>
             
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Category;