import { Link } from 'react-router-dom';

export default function OrderSuccess() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ fontSize: '60px', color: '#28a745', marginBottom: '20px' }}>✅</div>
      <h1>Заказ оформлен!</h1>
      <p style={{ fontSize: '18px', color: '#555', marginBottom: '30px' }}>
        Спасибо за ваш заказ! Мы свяжемся с вами в ближайшее время.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          padding: '10px 24px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
          fontSize: '16px'
        }}
      >
        Вернуться на главную
      </Link>
    </div>
  );
}