// src/components/admin/ProductListAdmin.jsx
import { useState, useEffect } from 'react';
import {
  getAdminProducts,
  getAdminCategories,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct
} from '../../api/api.js';

export default function ProductListAdmin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Форма
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    size: '',
    color: '',
    price: '',
    stock: '',
    categoryId: ''
  });

  // Загрузка данных
  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getAdminProducts(),
        getAdminCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setError('');
    } catch (err) {
      setError('Ошибка загрузки данных');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 

   const handleSubmit = async (e) => {
  e.preventDefault();
  
  const categoryId = parseInt(formData.categoryId);
  if (isNaN(categoryId)) {
    setError('Пожалуйста, выберите категорию');
    return;
  }

  try {
    const productData = {
      name: formData.name,
      brand: formData.brand,
      size: formData.size,
      color: formData.color,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      categoryId: categoryId 
    };

    if (isEditing) {
      await updateAdminProduct(currentProduct.id, productData);
    } else {
      await createAdminProduct(productData);
    }

    // Сброс формы
    setFormData({
      name: '',
      brand: '',
      size: '',
      color: '',
      price: '',
      stock: '',
      categoryId: ''
    });
    setIsEditing(false);
    setCurrentProduct(null);
    await loadData();
  } catch (err) {
    setError('Ошибка сохранения товара: ' + (err.message || 'неизвестная'));
    console.error(err);
  }
};
  const startEdit = (product) => {
    setFormData({
      name: product.name || '',
      brand: product.brand || '',
      size: product.size || '',
      color: product.color || '',
      price: product.price?.toString() || '',
      stock: product.stock?.toString() || '',
      categoryId: product.category?.id?.toString() || ''
    });
    setIsEditing(true);
    setCurrentProduct(product);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить товар? Это действие нельзя отменить.')) return;
    try {
      await deleteAdminProduct(id);
      await loadData();
    } catch (err) {
      setError('Ошибка удаления товара');
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentProduct(null);
    setFormData({
      name: '',
      brand: '',
      size: '',
      color: '',
      price: '',
      stock: '',
      categoryId: ''
    });
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Загрузка товаров...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Управление товарами</h2>

      {error && (
        <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>
      )}

      {/* Форма */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>{isEditing ? 'Редактировать товар' : 'Добавить новый товар'}</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label>Название *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '6px' }}
            />
          </div>
          
          <div>
            <label>Бренд</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '6px' }}
            />
          </div>
          
          <div>
            <label>Размер</label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '6px' }}
            />
          </div>
          
          <div>
            <label>Цвет</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '6px' }}
            />
          </div>
          
          <div>
            <label>Цена *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              required
              style={{ width: '100%', padding: '6px' }}
            />
          </div>
          
          <div>
            <label>Остаток *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
              required
              style={{ width: '100%', padding: '6px' }}
            />
          </div>
          
          <div>
            <label>Категория *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '6px' }}
            >
              <option value="">Выберите категорию</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {isEditing ? 'Сохранить' : 'Добавить'}
          </button>
          
          {isEditing && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{
                padding: '8px 16px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              Отмена
            </button>
          )}
        </div>
      </form>

      {/* Список товаров */}
      <div>
        <h3>Существующие товары ({products.length})</h3>
        {products.length === 0 ? (
          <p>Нет товаров</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {products.map(product => (
              <div key={product.id} style={{
                padding: '15px',
                border: '1px solid #eee',
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>{product.name}</strong> — {product.brand} • {product.category?.name || 'Без категории'}<br/>
                  Цена: {product.price} ₽ • Остаток: {product.stock}
                </div>
                <div>
                  <button
                    onClick={() => startEdit(product)}
                    style={{
                      marginRight: '8px',
                      padding: '4px 8px',
                      background: '#ffc107',
                      border: 'none',
                      borderRadius: '3px'
                    }}
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    style={{
                      padding: '4px 8px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px'
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}