import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  
  console.log('AdminRoute Check:', { user, isAuthenticated, isAdmin, loading }); // Debug
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }
  
  // Pehle check karo authenticated hai ya nahi
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }
  
  // Phir check karo admin hai ya nahi
  if (!isAdmin) {
    console.log('Not admin, redirecting to home');
    return <Navigate to="/" />;
  }

  // Dono conditions pass, admin page show karo
  return children;
};