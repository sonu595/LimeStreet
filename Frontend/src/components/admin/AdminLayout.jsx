import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white p-6">
        <h1 className="text-xl font-light mb-8">Admin Panel</h1>
        <nav className="space-y-2">
          <Link to="/admin" className="block px-4 py-2 hover:bg-white/10 rounded-lg">Dashboard</Link>
          <Link to="/admin/products" className="block px-4 py-2 hover:bg-white/10 rounded-lg">Products</Link>
          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg">
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;