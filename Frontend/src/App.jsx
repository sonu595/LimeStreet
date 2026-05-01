import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useAuth from './context/useAuth';
import Nav from './Component/Navbar/Nav';
import MobileBottomNav from './Component/Navbar/MobileBottomNav';
import Footer from './Component/Layout/Footer';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import CartPage from './pages/Cart/CartPage';
import WishListPage from './pages/WishList/WishListPage';
import SimpleProfilePage from './pages/Profile/SimpleProfilePage';
import OrdersPage from './pages/Orders/OrdersPage';
import OrderTrackingPage from './pages/Orders/OrderTrackingPage';
import ProductDetailsPage from './pages/Product/ProductDetailsPage';
import BuyNowPage from './pages/Buy/BuyNowPage';
import CheckoutAddressPage from './pages/Checkout/CheckoutAddressPage';
import CheckoutPaymentPage from './pages/Checkout/CheckoutPaymentPage';
import OrderSuccessPage from './pages/OrderSuccess/OrderSuccessPage';
import Arrivel from './pages/New/Arrivel';
import Sale from './pages/Sale/Sale';
import AdminConsole from './pages/Admin/AdminConsoleNext';
import LimeStreetLoader from './Component/Layout/LimeStreetLoader'; // Import loader

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

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
  const location = useLocation();

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
    return <Navigate to={location.state?.from || '/'} replace />;
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
    return <Navigate to="/login" state={{ from: `${location.pathname}${location.search}` }} replace />;
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
    <Footer />
    <MobileBottomNav />
  </>
)

const AuthScreen = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.28, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
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
                  <AuthScreen>
                    <Login onToggle={() => navigate('/register')} />
                  </AuthScreen>
                </PublicRoute>
              }
            />
            
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <AuthScreen>
                    <Register onToggle={() => navigate('/login')} />
                  </AuthScreen>
                </PublicRoute>
              }
            />

            <Route
              path="/"
              element={
                <>
                  <StoreLayout>
                    <Home />
                  </StoreLayout>
                </>
              }
            />

            <Route
              path="/arrivel"
              element={
                <>
                  <StoreLayout>
                    <Arrivel />
                  </StoreLayout>
                </>
              }
            />

            <Route
              path="/sale"
              element={
                <>
                  <StoreLayout>
                    <Sale />
                  </StoreLayout>
                </>
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
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <>
                    <StoreLayout>
                      <OrderTrackingPage />
                    </StoreLayout>
                  </>
                </ProtectedRoute>
              }
            />

            <Route
              path="/order-success"
              element={
                <ProtectedRoute>
                  <OrderSuccessPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <>
                    <StoreLayout>
                      <CheckoutAddressPage mode="cart" />
                    </StoreLayout>
                  </>
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout/payment"
              element={
                <ProtectedRoute>
                  <>
                    <StoreLayout>
                      <CheckoutPaymentPage mode="cart" />
                    </StoreLayout>
                  </>
                </ProtectedRoute>
              }
            />

            <Route
              path="/product/:id"
              element={
                <>
                  <StoreLayout>
                    <ProductDetailsPage />
                  </StoreLayout>
                </>
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
              path="/buy/:id/payment"
              element={
                <ProtectedRoute>
                  <>
                    <StoreLayout>
                      <CheckoutPaymentPage mode="buy-now" />
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
