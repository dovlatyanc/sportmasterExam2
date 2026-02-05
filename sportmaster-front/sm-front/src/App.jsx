import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import Orders from './components/Orders';
import Category from './components/Categories';
import ProductList from './components/ProductList';
import Logout from './components/Logout';
import GuestOrder from './components/GuestOrder';
import AdminPanel from './components/admin/AdminPanel';
import ProductListAdmin from './components/admin/ProductListAdmin';
import CategoryListAdmin from './components/admin/CategoryListAdmin';
import UserListAdmin from './components/admin/UserListAdmin';
import AdminRoute from './components/admin/AdminRoute';
import { useAuth } from '../src/hooks/useAuth';
import ProfilePage from './components/ProfilePage';
import OrderSuccess from './components/OrderSuccess';
import './App.css';

function App() {

   const { isAdmin,user } = useAuth(); 
  
   
  return (
    <Router>
      <div className="app">
        <nav className="nav">
          <div className="nav-container">
            <Link to="/" className="logo">SPORTMASTER</Link>
            <div className="nav-links">
              <Link to="/">Главная</Link>
              <Link to="/products">Товары</Link>
              <Link to="/categories">Категории</Link>
              <Link to="/cart">Корзина</Link>
              <Link to="/orders">Заказы</Link>
            </div>
            <div className="nav-auth">
              {/*показываем зарегистрированным пользвателям*/}
             {user && <Link to="/profile">Профиль</Link>}
            
              <Link to="/login">Вход</Link>
              <Link to="/register">Регистрация</Link>
               <Link to="/logout">Выход</Link>
              {/* Показываем админку ТОЛЬКО админам */}
              {isAdmin && (
                <Link to="/admin" style={{ marginLeft: '10px', color: '#d63384', fontWeight: 'bold' }}>
                  Админка
                </Link>
              )}
            </div>
          </div>
        </nav>

        <main className="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/categories" element={<Category />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/guest-order" element={<GuestOrder />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/order-success" element={<OrderSuccess />} />
           <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            >
              <Route path="products" element={<ProductListAdmin />} />
              <Route path="categories" element={<CategoryListAdmin />} />
              <Route path="users" element={<UserListAdmin />} />
            </Route>
          </Routes>
        </main>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-logo">SPORTMASTER</div>
            <div className="footer-links">
              <Link to="/guest-order">Быстрый заказ</Link>
              <Link to="/login">Вход</Link>
              <Link to="/register">Регистрация</Link>
              <Link to="/logout">Выход</Link>
            </div>
          </div>
          <div className="footer-copyright">
            © 2026 SportMaster. Все права защищены.
          </div>
        </footer>
      </div>
    </Router>
  );
}

// Компонент главной страницы
function HomePage() {




  return (
    <div className="home-page">
      {/* Герой секция */}
      <section className="hero">
        <div className="hero-content">
          <h1>ВСЁ ДЛЯ СПОРТА И АКТИВНОГО ОТДЫХА</h1>
          <p>Одежда, обувь и инвентарь для профессионалов и любителей</p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary">СМОТРЕТЬ ТОВАРЫ</Link>
            <Link to="/guest-order" className="btn btn-secondary">БЫСТРЫЙ ЗАКАЗ</Link>
          </div>
        </div>
      </section>

      {/* Основной контент */}
      <div className="container"> 

        {/* Преимущества */}
        <section className="features">
          <div className="feature">
            <div className="feature-icon">🚚</div>
            <h3>Бесплатная доставка</h3>
            <p>От 2999₽ по всей России</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🏪</div>
            <h3>1000+ магазинов</h3>
            <p>Самовывоз в вашем городе</p>
          </div>
          <div className="feature">
            <div className="feature-icon">✅</div>
            <h3>Гарантия качества</h3>
            <p>Официальная гарантия</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;