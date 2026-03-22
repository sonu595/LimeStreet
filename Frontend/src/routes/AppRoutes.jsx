import { Routes, Route } from 'react-router-dom';
import { PublicRoute } from './ProtectedRoute';

import { AdminRoute } from './AdminRoute';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProduct';
import AdminAddProduct from '../pages/admin/AdminAddProduct';
import AdminEditProduct from '../pages/admin/AdminEditProduct';

import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import VerifyOTP from '../components/auth/VerifyOTP';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetailPage from '../pages/ProductDetailPage';
import Wishlist from '../pages/Wishlist';
import Cart from '../pages/Cart';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - accessible to all */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/cart" element={<Cart />} />

      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
      <Route path="/admin/products/add" element={<AdminRoute><AdminAddProduct /></AdminRoute>} />
      <Route path="/admin/products/edit/:id" element={<AdminRoute><AdminEditProduct /></AdminRoute>} />


      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />

      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />

      <Route path="/verify-otp" element={
        <PublicRoute>
          <VerifyOTP />
        </PublicRoute>
      } />

      <Route path="/forgot-password" element={
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      } />

      <Route path="/reset-password" element={
        <PublicRoute>
          <ResetPassword />
        </PublicRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;