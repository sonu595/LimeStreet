import { useEffect, useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductTable from '../../components/admin/ProductTable';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
  const { products, fetchProducts } = useAdmin();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-light">Products</h1>
        <Link to="/admin/products/add" className="px-4 py-2 bg-black text-white rounded-lg">
          + Add Product
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded-lg mb-6"
      />

      <ProductTable products={filtered} />
    </AdminLayout>
  );
};

export default AdminProducts;