import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import useAuth from './context/useAuth';
import Nav from './Component/Navbar/Nav';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Cart from './pages/Cart/Cart';
import WishList from './pages/WishList/WishList';
import ProfilePage from './pages/Profile/ProfilePage';
import Arrivel from './pages/New/Arrivel';
import Sale from './pages/Sale/Sale';

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

function App() {
  const navigate = useNavigate();

  return (
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
