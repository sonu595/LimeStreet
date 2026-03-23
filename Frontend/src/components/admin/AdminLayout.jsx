import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', to: '/admin' },
    { label: 'Products', to: '/admin/products' },
    { label: 'Add Product', to: '/admin/products/add' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6">
        <aside className="w-full rounded-[28px] bg-slate-950 p-6 text-white shadow-2xl lg:sticky lg:top-6 lg:w-72 lg:self-start">
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">Lime Street</p>
          <h1 className="mt-3 text-2xl font-semibold">Admin Panel</h1>
          <p className="mt-2 text-sm text-white/65">
            Manage catalog, stock and storefront updates from one place.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">Signed in as</p>
            <p className="mt-2 text-sm font-medium text-white">{user?.name || user?.email || 'Admin'}</p>
            <p className="mt-1 text-xs text-white/60">{user?.email}</p>
          </div>

          <nav className="mt-6 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`block rounded-2xl px-4 py-3 text-sm transition ${
                    isActive
                      ? 'bg-white text-slate-950 shadow-lg'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-8 w-full rounded-2xl border border-white/15 px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white hover:text-slate-950"
          >
            Logout
          </button>
        </aside>

        <main className="flex-1 rounded-[32px] bg-white p-5 shadow-xl sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
