import { useEffect, useState } from "react";
import { getProducts, addToCart } from "../api";

function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div>
      <h2>Товары</h2>
      {products.map(p => (
        <div key={p.id}>
          <b>{p.name}</b> — {p.price} ₽
          <button onClick={() => addToCart(p.id)}>
            В корзину
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProductsPage;
