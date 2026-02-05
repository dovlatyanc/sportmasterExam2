import { useState, useEffect } from 'react';
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory
} from '../../api/api.js';

export default function CategoryListAdmin() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  // Загрузка категорий
  const loadCategories = async () => {
    try {
      const data = await getAdminCategories();
      setCategories(data);
      setError('');
    } catch (err) {
      console.error('Ошибка загрузки категорий:', err);
      setError('Не удалось загрузить категории');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Создание категории
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      await createAdminCategory(newCategoryName.trim());
      setNewCategoryName('');
      await loadCategories(); // обновляем список
    } catch (err) {
      setError('Не удалось создать категорию. Возможно, она уже существует.');
    }
  };

  // Начало редактирования
  const startEditing = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };

  // Сохранение изменений
  const handleUpdate = async (id) => {
    if (!editingName.trim()) return;
    try {
      await updateAdminCategory(id, editingName.trim());
      setEditingId(null);
      setEditingName('');
      await loadCategories();
    } catch (err) {
      setError('Не удалось обновить категорию');
    }
  };

  // Отмена редактирования
  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  // Удаление категории
  const handleDelete = async (id) => {
    if (!window.confirm('Удалить категорию?')) return;
    try {
      await deleteAdminCategory(id);
      await loadCategories();
    } catch (err) {
      setError('Не удалось удалить категорию');
    }
  };

  if (loading) {
    return <div>Загрузка категорий...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Управление категориями</h2>

      {error && (
        <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>
      )}

      {/* Форма добавления */}
      <form onSubmit={handleCreate} style={{ marginBottom: '30px' }}>
        <h3>Добавить новую категорию</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Название категории"
            style={{ padding: '8px', width: '200px' }}
          />
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
            Добавить
          </button>
        </div>
      </form>

      {/* Список категорий */}
      <div>
        <h3>Существующие категории ({categories.length})</h3>
        {categories.length === 0 ? (
          <p>Нет категорий</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {categories.map((cat) => (
              <li
                key={cat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  borderBottom: '1px solid #eee'
                }}
              >
                {editingId === cat.id ? (
                  <>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      style={{ padding: '6px', flex: 1 }}
                    />
                    <button
                      onClick={() => handleUpdate(cat.id)}
                      style={{
                        padding: '6px 12px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                      }}
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={cancelEditing}
                      style={{
                        padding: '6px 12px',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                      }}
                    >
                      Отмена
                    </button>
                  </>
                ) : (
                  <>
                    <span style={{ flex: 1 }}>{cat.name}</span>
                    <button
                      onClick={() => startEditing(cat.id, cat.name)}
                      style={{
                        padding: '6px 12px',
                        background: '#ffc107',
                        color: 'black',
                        border: 'none',
                        borderRadius: '4px',
                        marginRight: '8px'
                      }}
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      style={{
                        padding: '6px 12px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                      }}
                    >
                      Удалить
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}