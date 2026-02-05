const API_URL = "http://localhost:8080";

const fetchWithAuth = (url, options = {}) => {
  console.log('fetchWithAuth:', url, options);
  return fetch(url, { ...options, credentials: 'include' });
};

export const getProducts = (params = "") =>
  fetch(`${API_URL}/products${params}`).then(res => res.json());

export const addToCart = (productId, quantity = 1) => {
  console.log('addToCart API call:', productId, quantity);
  return fetchWithAuth(`${API_URL}/cart/add?productId=${productId}&quantity=${quantity}`, {
    method: "POST"
  }).then(response => {
    console.log('addToCart response:', response.status, response.statusText);
    return response;
  });
};

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

export const createGuestOrder = (orderData) =>
  fetch(`${API_URL}/orders/guest`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  }).then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json();
  });


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


export const updateCartItem = (productId, quantity) =>
  fetchWithAuth(`${API_URL}/cart/update?productId=${productId}&quantity=${quantity}`, {
    method: "PUT"
  });


// Только для админки
export const getAdminCategories = () =>
  fetchWithAuth(`${API_URL}/admin/categories`).then(res => res.json());

export const createAdminCategory = (name) =>
  fetchWithAuth(`${API_URL}/admin/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  }).then(res => res.json());

export const updateAdminCategory = (id, name) =>
  fetchWithAuth(`${API_URL}/admin/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  }).then(res => res.json());

export const deleteAdminCategory = (id) =>
  fetchWithAuth(`${API_URL}/admin/categories/${id}`, {
    method: 'DELETE'
  });

  
export const getAdminProducts = () =>
  fetchWithAuth(`${API_URL}/admin/products`).then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json();
  });

// Создать товар
export const createAdminProduct = (productData) =>
  fetchWithAuth(`${API_URL}/admin/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  }).then(res => res.json());

// Обновить товар
export const updateAdminProduct = (id, productData) =>
  fetchWithAuth(`${API_URL}/admin/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  }).then(res => res.json());

// Удалить товар
export const deleteAdminProduct = (id) =>
  fetchWithAuth(`${API_URL}/admin/products/${id}`, {
    method: 'DELETE'
      });


// Получить всех пользователей
export const getAdminUsers = () =>
  fetchWithAuth(`${API_URL}/admin/users`).then(res => {
    if (!res.ok) throw new Error('Ошибка загрузки пользователей');
    return res.json();
  });

// Заблокировать пользователя
export const disableUser = (id) =>
  fetchWithAuth(`${API_URL}/admin/users/${id}/disable`, {
    method: 'PUT'
  }).then(res => {
    if (!res.ok) throw new Error('Ошибка блокировки');
    return res.json();
  });

// Разблокировать пользователя
export const enableUser = (id) =>
  fetchWithAuth(`${API_URL}/admin/users/${id}/enable`, {
    method: 'PUT'
  }).then(res => {
    if (!res.ok) throw new Error('Ошибка разблокировки');
    return res.json();
  });

// Удалить пользователя
export const deleteAdminUser = (id) =>
  fetchWithAuth(`${API_URL}/admin/users/${id}`, {
    method: 'DELETE'
  });

export const getCategories = () =>
  fetch(`${API_URL}/categories`).then(res => res.json());

// Фильтрация товаров
export const getFilteredProducts = (filters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });
  return getProducts(`?${params.toString()}`);
};

export const getProductsSimple = () =>
  fetch(`${API_URL}/products/simple`).then(res => res.json());




