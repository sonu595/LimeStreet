import { createContext, useContext, useState } from 'react';
import { productApi } from '../services/productApi';
import toast from 'react-hot-toast';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productApi.getAllProducts();
      setProducts(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (data) => {
    try {
      await productApi.createProduct(data);
      toast.success('Product created!');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to create product');
    }
  };

  const updateProduct = async (id, data) => {
    try {
      await productApi.updateProduct(id, data);
      toast.success('Product updated!');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productApi.deleteProduct(id);
      toast.success('Product deleted!');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <AdminContext.Provider value={{
      products, loading, fetchProducts,
      createProduct, updateProduct, deleteProduct
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);