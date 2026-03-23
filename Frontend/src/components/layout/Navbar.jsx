import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';

const CountBadge = ({ count }) => (
  <span className="ml-1 min-w-5 h-5 px-1 rounded-full bg-fuchsia-500 text-white text-[10px] inline-flex items-center justify-center">
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
  const showShopLinks = !isAdmin;
  const navClasses = isHomePage && !isScrolled
    ? 'bg-slate-950/45 border-white/10 text-white'
    : 'bg-slate-950/88 border-white/10 text-white shadow-xl shadow-black/30';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 22);
    };

    setIsMobileMenuOpen(false);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const mobileItemClass = 'block text-sm text-slate-100 hover:text-white transition-colors';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b backdrop-blur-xl ${navClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xl sm:text-2xl font-semibold tracking-[0.24em] text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-sky-200 to-emerald-200"
          >
            LIME STREET
          </Link>

          <div className="hidden md:flex items-center space-x-6 text-sm">
            <Link to="/products" className="text-slate-200 hover:text-white transition-colors">
              Products
            </Link>
            {showShopLinks && (
              <>
                <Link to="/wishlist" className="text-slate-200 hover:text-white inline-flex items-center transition-colors">
                  Wishlist {wishlistCount > 0 && <CountBadge count={wishlistCount} />}
                </Link>
                <Link to="/cart" className="text-slate-200 hover:text-white inline-flex items-center transition-colors">
                  Cart {cartCount > 0 && <CountBadge count={cartCount} />}
                </Link>
              </>
            )}

            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="text-slate-200 hover:text-white transition-colors">
                    Admin Panel
                  </Link>
                )}

                <span className="text-slate-300 text-xs">
                  Hi, {user.name || user.email?.split('@')[0]}
                  {isAdmin && (
                    <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-white/15 border border-white/20 text-slate-100">
                      Admin
                    </span>
                  )}
                </span>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/10 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="px-3 py-2 text-slate-200 hover:text-white transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-full border border-white/25 bg-white/5 text-white hover:bg-white/10 transition"
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
            <span className={`absolute block h-0.5 w-6 transform transition-all duration-300 bg-white ${isMobileMenuOpen ? 'rotate-45 top-5' : 'top-3'}`}></span>
            <span className={`absolute block h-0.5 w-6 transform transition-all duration-300 bg-white ${isMobileMenuOpen ? 'opacity-0' : 'top-5'}`}></span>
            <span className={`absolute block h-0.5 w-6 transform transition-all duration-300 bg-white ${isMobileMenuOpen ? '-rotate-45 top-5' : 'top-7'}`}></span>
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="md:hidden pb-4"
            >
              <div className="rounded-3xl border border-white/15 bg-slate-900/95 p-5 space-y-4">
                <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className={mobileItemClass}>
                  Products
                </Link>

                {showShopLinks && (
                  <>
                    <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className={mobileItemClass}>
                      Wishlist ({wishlistCount})
                    </Link>
                    <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className={mobileItemClass}>
                      Cart ({cartCount})
                    </Link>
                  </>
                )}

                {user ? (
                  <>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className={mobileItemClass}>
                        Admin Panel
                      </Link>
                    )}

                    <span className="block text-xs text-slate-400">
                      Hi, {user.name || user.email?.split('@')[0]}
                      {isAdmin && ' (Admin)'}
                    </span>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/10 transition"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className={mobileItemClass}>
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/10 transition"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
