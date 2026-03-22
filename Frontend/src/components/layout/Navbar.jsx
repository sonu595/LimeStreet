import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';

const CountBadge = ({ count }) => (
  <span className="ml-1 min-w-5 h-5 px-1 rounded-full bg-emerald-500 text-white text-[10px] inline-flex items-center justify-center">
    {count}
  </span>
);

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount, wishlistCount } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHomePage = location.pathname === '/';
  const useLightText = isHomePage && !isScrolled && !isMobileMenuOpen;
  const navClasses = useLightText
    ? 'bg-transparent text-white'
    : 'bg-white/95 text-slate-900 shadow-lg backdrop-blur-md border-b border-slate-200/80';
  const linkClasses = useLightText
    ? 'text-white/90 hover:text-white'
    : 'text-slate-600 hover:text-slate-950';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    setIsMobileMenuOpen(false);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${navClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xl sm:text-2xl font-semibold tracking-[0.22em] transition-all duration-300 hover:scale-[1.02]"
          >
            LIME STREET
          </Link>

          <div className="hidden md:flex items-center space-x-7">
            <Link to="/products" className={`relative group transition-colors duration-300 ${linkClasses}`}>
              Products
            </Link>
            <Link to="/wishlist" className={`relative transition-colors duration-300 inline-flex items-center ${linkClasses}`}>
              Wishlist {wishlistCount > 0 && <CountBadge count={wishlistCount} />}
            </Link>
            <Link to="/cart" className={`relative transition-colors duration-300 inline-flex items-center ${linkClasses}`}>
              Cart {cartCount > 0 && <CountBadge count={cartCount} />}
            </Link>

            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className={`relative group transition-colors duration-300 ${linkClasses}`}>
                    Admin Panel
                  </Link>
                )}

                <span className={`text-sm flex items-center gap-2 ${useLightText ? 'text-white/80' : 'text-slate-600'}`}>
                  Hi, {user.name || user.email?.split('@')[0]}
                  {isAdmin && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${useLightText ? 'bg-white text-black' : 'bg-slate-900 text-white'}`}>
                      Admin
                    </span>
                  )}
                </span>

                <button
                  onClick={handleLogout}
                  className={`px-4 py-2 rounded-full border transition-all duration-300 hover:scale-105 ${
                    useLightText
                      ? 'border-white/30 text-white hover:bg-white hover:text-black'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900'
                  }`}
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className={`px-4 py-2 transition-all duration-300 hover:scale-105 ${linkClasses}`}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-full border transition-all duration-300 hover:scale-105 ${
                    useLightText
                      ? 'border-white/30 text-white hover:bg-white hover:text-black'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900'
                  }`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative w-10 h-10 focus:outline-none"
            aria-label="Toggle menu"
          >
            <span className={`absolute block h-0.5 w-6 transform transition-all duration-300 ${useLightText ? 'bg-white' : 'bg-slate-900'} ${isMobileMenuOpen ? 'rotate-45 top-5' : 'top-3'}`}></span>
            <span className={`absolute block h-0.5 w-6 transform transition-all duration-300 ${useLightText ? 'bg-white' : 'bg-slate-900'} ${isMobileMenuOpen ? 'opacity-0' : 'top-5'}`}></span>
            <span className={`absolute block h-0.5 w-6 transform transition-all duration-300 ${useLightText ? 'bg-white' : 'bg-slate-900'} ${isMobileMenuOpen ? '-rotate-45 top-5' : 'top-7'}`}></span>
          </button>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-500 ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-4 space-y-4 rounded-3xl bg-white text-slate-900 mb-4 p-5 shadow-xl border border-slate-200">
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="block transition-colors duration-300 text-slate-700 hover:text-slate-950">
              Products
            </Link>
            <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="block transition-colors duration-300 text-slate-700 hover:text-slate-950">
              Wishlist ({wishlistCount})
            </Link>
            <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="block transition-colors duration-300 text-slate-700 hover:text-slate-950">
              Cart ({cartCount})
            </Link>

            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block transition-colors duration-300 text-slate-700 hover:text-slate-950">
                    Admin Panel
                  </Link>
                )}

                <span className="block text-sm text-slate-500">
                  Hi, {user.name || user.email?.split('@')[0]}
                  {isAdmin && ' (Admin)'}
                </span>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 rounded-full border border-slate-300 text-slate-700 transition-all duration-300 hover:bg-slate-900 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block transition-colors duration-300 text-slate-700 hover:text-slate-950">
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-full border border-slate-300 text-slate-700 transition-all duration-300 hover:bg-slate-900 hover:text-white"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
