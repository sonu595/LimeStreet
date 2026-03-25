import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import useAuth from './context/useAuth';
import Nav from './Component/Navbar/Nav';
import MobileBottomNav from './Component/Navbar/MobileBottomNav';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import CartPage from './pages/Cart/CartPage';
import WishListPage from './pages/WishList/WishListPage';
import SimpleProfilePage from './pages/Profile/SimpleProfilePage';
import OrdersPage from './pages/Orders/OrdersPage';
import ProductDetailsPage from './pages/Product/ProductDetailsPage';
import BuyNowPage from './pages/Buy/BuyNowPage';
import Arrivel from './pages/New/Arrivel';
import Sale from './pages/Sale/Sale';
import AdminConsole from './pages/Admin/AdminConsole';
import LimeStreetLoader from './Component/Layout/LimeStreetLoader'; // Import loader

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lime-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lime-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lime-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lime-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-semibold">Loading admin...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const StoreLayout = ({ children }) => (
  <>
    <Nav />
    {children}
    <MobileBottomNav />
  </>
)

function App() {
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = sessionStorage.getItem('limeStreetVisited');
    
    if (hasVisited) {
      // Already visited, skip loader
      setShowLoader(false);
      setIsFirstVisit(false);
    } else {
      // First time visit - show loader
      sessionStorage.setItem('limeStreetVisited', 'true');
      setIsFirstVisit(true);
    }
  }, []);

  const handleLoaderComplete = () => {
    setShowLoader(false);
  };

  // Agar loader show ho raha hai to sirf loader dikhao
  if (showLoader && isFirstVisit) {
    return <LimeStreetLoader onLoadingComplete={handleLoaderComplete} />;
  }

  return (
    <AnimatePresence mode="wait">
      {!showLoader && (
        <div className="App">
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login onToggle={() => navigate('/register')} />
                </PublicRoute>
              }
            />
            
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register onToggle={() => navigate('/login')} />
                </PublicRoute>
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <>
                    <StoreLayout>
                      <Home />
                    </StoreLayout>
                  </>
                </ProtectedRoute>
              }
            />

            <Route
              path="/arrivel"
              element={
                <ProtectedRoute>
                  <>
                    <StoreLayout>
                      <Arrivel />
                    </StoreLayout>
                  </>
                </ProtectedRoute>
              }
            />

            <Route
              path="/sale"
              element={
                <ProtectedRoute>
                  <>
                    <StoreLayout>
                      <Sale />
                    </StoreLayout>
                  </>
                </ProtectedRoute>
              }
            />

            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <>
                    <StoreLayout>
                      <CartPage />
                    </StoreLayout>
                  </>
                </ProtectedRoute>
              }
            />

            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <>
                    <StoreLayout>
                      <WishListPage />
                    </StoreLayout>
                  </>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <>
                    <StoreLayout>
                      <SimpleProfilePage />
                    </StoreLayout>
                  </>
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <>
                    <StoreLayout>
                      <OrdersPage />
                    </StoreLayout>
                  </>
                </ProtectedRoute>
              }
            />

            <Route
              path="/product/:id"
              element={
                <ProtectedRoute>
                  <>
                    <StoreLayout>
                      <ProductDetailsPage />
                    </StoreLayout>
                  </>
                </ProtectedRoute>
              }
            />

            <Route
              path="/buy/:id"
              element={
                <ProtectedRoute>
                  <>
                    <StoreLayout>
                      <BuyNowPage />
                    </StoreLayout>
                  </>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <>
                    <Nav />
                    <AdminConsole />
                  </>
                </AdminRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      )}
    </AnimatePresence>
  );
}

export default App;
