// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Nav from './Component/Nav/Nav';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Cart from './pages/Cart/Cart';
import WishList from './pages/WishList/WishList';
import ProfilePage from './pages/Profile/ProfilePage';
import Arrivel from './pages/Arrivel/Arrivel';
import Sale from './pages/Sale/Sale';

// Protected Route Component
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

// Public Route Component (redirects to home if already logged in)
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

function App() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleLoginSuccess = () => {
    // This will be called after successful login
    console.log('Login successful!');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes - No Navbar */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                {isLogin ? (
                  <Login onToggle={toggleAuthMode} onLoginSuccess={handleLoginSuccess} />
                ) : (
                  <Register onToggle={toggleAuthMode} />
                )}
              </PublicRoute>
            }
          />
          
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register onToggle={() => setIsLogin(true)} />
              </PublicRoute>
            }
          />

          {/* Protected Routes - With Navbar */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <Nav />
                  <Home />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/arrivel"
            element={
              <ProtectedRoute>
                <>
                  <Nav />
                  <Arrivel />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/sale"
            element={
              <ProtectedRoute>
                <>
                  <Nav />
                  <Sale />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <>
                  <Nav />
                  <Cart />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <>
                  <Nav />
                  <WishList />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <>
                  <Nav />
                  <ProfilePage />
                </>
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to login if not authenticated, else home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;