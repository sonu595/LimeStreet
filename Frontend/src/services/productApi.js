import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api'
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const productApi = {
  getAllProducts: () => API.get('/products'),
  getProductById: (id) => API.get(`/products/${id}`),
  getProductsByCategory: (category) => API.get(`/products/category/${category}`),
  searchProducts: (query) => API.get(`/products/search?q=${query}`),
  getNewArrivals: () => API.get('/products/new-arrivals'),
  getBestSellers: () => API.get('/products/best-sellers'),
  
  createProduct: (productData) => API.post('/products', productData),
  updateProduct: (id, productData) => API.put(`/products/${id}`, productData),
  deleteProduct: (id) => API.delete(`/products/${id}`)
};

export default productApi;