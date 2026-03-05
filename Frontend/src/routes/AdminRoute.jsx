import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const isAdmin = user?.email === 'admin@example.com';

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return isAuthenticated && isAdmin ? children : <Navigate to="/" />;
};