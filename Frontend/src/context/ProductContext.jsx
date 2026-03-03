import { createContext, useContext, useState, useEffect } from 'react';
import { productApi } from '../services/ProductApi';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await productApi.getAllProducts();
      setProducts(response.data.data);
      setFilteredProducts(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewArrivals = async () => {
    try {
      const response = await productApi.getNewArrivals();
      setNewArrivals(response.data.data);
    } catch (err) {
      console.error('Failed to fetch new arrivals', err);
    }
  };

  const fetchBestSellers = async () => {
    try {
      const response = await productApi.getBestSellers();
      setBestSellers(response.data.data);
    } catch (err) {
      console.error('Failed to fetch best sellers', err);
    }
  };

  const fetchProductsByCategory = async (category) => {
    setLoading(true);
    try {
      const response = await productApi.getProductsByCategory(category);
      setFilteredProducts(response.data.data);
      setSelectedCategory(category);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query) => {
    setLoading(true);
    try {
      const response = await productApi.searchProducts(query);
      setFilteredProducts(response.data.data);
      setSearchQuery(query);
      setError(null);
    } catch (err) {
      setError('Search failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id) => {
    setLoading(true);
    try {
      const response = await productApi.getProductById(id);
      setError(null);
      return response.data.data;
    } catch (err) {
      setError('Product not found');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const filterByPrice = (min, max) => {
    const filtered = products.filter(p => p.price >= min && p.price <= max);
    setFilteredProducts(filtered);
  };

  const sortProducts = (type) => {
    let sorted = [...filteredProducts];
    if (type === 'price-low') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (type === 'price-high') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (type === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (type === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    setFilteredProducts(sorted);
  };

  useEffect(() => {
    fetchAllProducts();
    fetchNewArrivals();
    fetchBestSellers();
  }, []);

  const value = {
    products,
    filteredProducts,
    newArrivals,
    bestSellers,
    loading,
    error,
    selectedCategory,
    searchQuery,
    fetchAllProducts,
    fetchProductsByCategory,
    searchProducts,
    getProductById,
    filterByPrice,
    fetchNewArrivals,    // 
    fetchBestSellers,    // 
    sortProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};