import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import Orders from './components/Orders'
import Category from './components/Categories';
import ProductList from './components/ProductList'
import Logout from './components/Logout';

import GuestOrder from './components/GuestOrder';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Главная</Link> | 
        <Link to="/categories">Категории товаров</Link>
        <Link to="/products">Товары</Link>
        <Link to="/guest-order">Заказ без регистрации</Link>
        <Link to="/login">Вход</Link> | 
        <Link to="/Logout">Выход</Link>
        <Link to="/register">Регистрация</Link>
        <Link to="/cart">Корзина</Link> | 
        <Link to="/orders">Мои заказы</Link>
      </nav>
      <Routes>
        <Route path="/" element={<div>Добро пожаловать в магазин</div>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/category" element={<Category />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/guest-order" element={<GuestOrder />} /> 
        <Route path="/logout" element={<Logout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;