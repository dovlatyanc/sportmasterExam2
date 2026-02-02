// src/components/ProductList.jsx
import { useEffect, useState } from 'react';
import { getProducts } from '../api/api.js';
import ProductCard from './ProductCard';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Не удалось загрузить товары', err);
      }
    };
    load();
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};

export default ProductList;