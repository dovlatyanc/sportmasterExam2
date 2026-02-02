const API_URL = "http://localhost:8080";

const fetchWithAuth = (url, options = {}) => 
  fetch(url, { ...options, credentials: 'include' });

export const getProducts = (params = "") =>
  fetch(`${API_URL}/products${params}`).then(res => res.json());

export const addToCart = (productId, quantity = 1) =>
  fetchWithAuth(`${API_URL}/cart/add?productId=${productId}&quantity=${quantity}`, {
    method: "POST"
  });

export const getCart = () =>
  fetchWithAuth(`${API_URL}/cart`).then(res => res.json());

export const createOrder = () =>
  fetchWithAuth(`${API_URL}/orders`, { method: "POST" })
    .then(res => res.json());

export const login = (email, password) =>
  fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify({ email, password }),  
    credentials: 'include'
  });

export const register = (email, password, fullName) =>
  fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, fullName }),
    credentials: 'include'
  });

export const createGuestOrder = (guestData) =>
  fetch(`${API_URL}/orders/guest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(guestData)
  }).then(res => {
    if (!res.ok) throw new Error('Ошибка заказа');
    return res.json();
  });

export const getFilteredProducts = (filters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.append(key, value);
  });
  return getProducts(`?${params.toString()}`);
};

export const removeFromCart = (productId) =>
  fetchWithAuth(`${API_URL}/cart/remove?productId=${productId}`, {
    method: "DELETE"
  });

export const getProfile = () =>
  fetchWithAuth(`${API_URL}/profile`).then(res => res.json());

export const updateProfile = (profileData) =>
  fetchWithAuth(`${API_URL}/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData)
  });

export const getMyOrders = () =>
  fetchWithAuth(`${API_URL}/orders`).then(res => res.json());