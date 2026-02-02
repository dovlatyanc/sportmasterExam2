import { useEffect, useState } from "react";
import { getCart, createOrder } from "../api";

function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    getCart().then(setCart);
  }, []);

  return (
    <div>
      <h2>Корзина</h2>

      {cart.map(item => (
        <div key={item.id}>
          {item.product.name} x {item.quantity}
        </div>
      ))}

      <button onClick={createOrder}>
        Оформить заказ
      </button>
    </div>
  );
}

export default CartPage;
