// src/components/ProductCard.jsx
import { useState } from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (isAdding) return;
    
    setIsAdding(true);
    
    if (onAddToCart) {
      await onAddToCart(product.id);
    }
    
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div style={{ 
      border: '1px solid #ddd', 
      padding: '15px',
      width: '200px',
      textAlign: 'center',
      borderRadius: '8px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
        {product.name}
      </h3>
      
      {product.brand && (
        <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>
          {product.brand}
        </p>
      )}
      
      {product.color && (
        <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#999' }}>
          Цвет: {product.color}
        </p>
      )}
      
      <p style={{ 
        fontSize: '20px', 
        fontWeight: 'bold',
        margin: '10px 0',
        color: '#e44d26'
      }}>
        {product.price?.toLocaleString('ru-RU')} ₽
      </p>
      
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        style={{
          width: '100%',
          padding: '10px',
          background: isAdding ? '#4caf50' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        {isAdding ? '✓ Добавлено' : 'В корзину'}
      </button>
    </div>
  );
};

export default ProductCard;