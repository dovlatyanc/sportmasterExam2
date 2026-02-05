
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminPanel = () => {
  return (
    <div className="admin-panel">
      <h1>Админка</h1>
      
      <div className="admin-layout">
        <nav className="admin-nav">
          <ul>
            <li><Link to="/admin/products">Товары</Link></li>
            <li><Link to="/admin/categories">Категории</Link></li>
            <li><Link to="/admin/users">Пользователи</Link></li>
          </ul>
        </nav>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;