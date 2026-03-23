import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminDashboard = () => {
  const { products, fetchProducts } = useAdmin();

  useEffect(() => {
    fetchProducts();
  }, []);

  const stats = [
    { label: 'Total Products', value: products.length, bg: 'bg-blue-50', accent: 'text-blue-700' },
    {
      label: 'Low Stock',
      value: products.filter((product) => product.stock > 0 && product.stock < 10).length,
      bg: 'bg-amber-50',
      accent: 'text-amber-700',
    },
    {
      label: 'Out of Stock',
      value: products.filter((product) => product.stock === 0).length,
      bg: 'bg-rose-50',
      accent: 'text-rose-700',
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Overview</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Store activity ka quick snapshot yahan milega. Inventory aur product actions ko fast access ke saath manage karo.
          </p>
        </div>
        <Link
          to="/admin/products/add"
          className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Add New Product
        </Link>
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-3xl p-6 shadow-sm`}>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className={`mt-3 text-4xl font-semibold ${stat.accent}`}>{stat.value}</p>
            <p className="mt-2 text-sm text-slate-500">Live inventory summary</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Link
          to="/admin/products"
          className="rounded-[28px] bg-slate-950 p-7 text-white transition hover:bg-slate-800"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-white/45">Catalog</p>
          <h2 className="mt-4 text-2xl font-semibold">Manage Products</h2>
          <p className="mt-3 max-w-lg text-sm text-white/70">
            Existing product list ko edit, review aur stock update karne ke liye yahan jao.
          </p>
        </Link>

        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-7">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Actions</p>
          <div className="mt-4 space-y-3">
            <Link
              to="/admin/products/add"
              className="block rounded-2xl bg-white px-4 py-4 text-sm font-medium text-slate-900 shadow-sm transition hover:shadow-md"
            >
              Add a new product
            </Link>
            <Link
              to="/admin/products"
              className="block rounded-2xl bg-white px-4 py-4 text-sm font-medium text-slate-900 shadow-sm transition hover:shadow-md"
            >
              Review product inventory
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
