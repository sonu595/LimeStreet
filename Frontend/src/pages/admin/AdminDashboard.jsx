import { useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import AdminLayout from '../../components/admin/AdminLayout';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { products, fetchProducts } = useAdmin();

  useEffect(() => {
    fetchProducts();
  }, []);

  const stats = [
    { label: 'Total Products', value: products.length, bg: 'bg-blue-50' },
    { label: 'Low Stock', value: products.filter(p => p.stock < 10).length, bg: 'bg-yellow-50' },
    { label: 'Out of Stock', value: products.filter(p => p.stock === 0).length, bg: 'bg-red-50' },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-light mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {stats.map((s, i) => (
          <div key={i} className={`${s.bg} p-6 rounded-2xl`}>
            <p className="text-sm mb-2">{s.label}</p>
            <p className="text-3xl font-light">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Link to="/admin/products" className="bg-black text-white p-6 rounded-2xl hover:bg-gray-800">
          <p className="text-3xl mb-2">👕</p>
          <p className="text-lg">Manage Products</p>
        </Link>
        <Link to="/admin/products/add" className="bg-gray-100 p-6 rounded-2xl hover:bg-gray-200">
          <p className="text-3xl mb-2">➕</p>
          <p className="text-lg">Add New Product</p>
        </Link>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;