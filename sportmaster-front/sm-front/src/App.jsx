import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import Orders from './components/Orders';
import Category from './components/Categories';
import ProductList from './components/ProductList';
import Logout from './components/Logout';
import GuestOrder from './components/GuestOrder';
import './App.css';

function App() {
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
              <Link to="/login">Вход</Link>
              <Link to="/register">Регистрация</Link>
               <Link to="/logout">Выход</Link>
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
  const categories = [
    { name: "Бег", count: 245 },
    { name: "Фитнес", count: 189 },
    { name: "Футбол", count: 312 },
    { name: "Зимний спорт", count: 156 },
  ];

  const products = [
    { name: "Кроссовки Nike Air Max", price: "9 999₽" },
    { name: "Спортивная форма Adidas", price: "5 799₽" },
    { name: "Футбольный мяч Select", price: "3 499₽" },
  ];

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
        {/* Категории */}
        <section className="categories">
          <h2>Популярные категории</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link key={index} to="/products" className="category-card">
                <div className="category-icon">
                  {category.name === "Бег" && "🏃‍♂️"}
                  {category.name === "Фитнес" && "💪"}
                  {category.name === "Футбол" && "⚽"}
                  {category.name === "Зимний спорт" && "🎿"}
                </div>
                <h3>{category.name}</h3>
               
              </Link>
            ))}
          </div>
        </section>

        {/* Популярные товары */}
        <section className="products">
          <div className="section-header">
            <h2>Популярные товары</h2>
            <Link to="/products" className="view-all">Все товары →</Link>
          </div>
          <div className="products-list">
            {products.map((product, index) => (
              <div key={index} className="product-card">
                <div className="product-image"></div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="product-footer">
                    <span className="price">{product.price}</span>
                    <button className="add-to-cart">В корзину</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

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