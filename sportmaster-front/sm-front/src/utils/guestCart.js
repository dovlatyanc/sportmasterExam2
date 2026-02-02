// src/utils/guestCart.js

const CART_KEY = 'guest_cart';

export const getGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
};

export const addToGuestCart = (productId, quantity = 1) => {
  const cart = getGuestCart();
  const existing = cart.find(item => item.productId === productId);
  
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const removeFromGuestCart = (productId) => {
  const cart = getGuestCart().filter(item => item.productId !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const clearGuestCart = () => {
  localStorage.removeItem(CART_KEY);
};