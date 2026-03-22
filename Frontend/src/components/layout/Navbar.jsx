import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';

const CountBadge = ({ count }) => (
  <span className="ml-1 min-w-5 h-5 px-1 rounded-full bg-black text-white text-[10px] inline-flex items-center justify-center">
    {count}
  </span>
);

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount, wishlistCount } = useShop();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link
            to="/"
            className={`text-2xl font-light tracking-wider transition-all duration-300 hover:scale-105 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}
          >
            LIME STREET
          </Link>

          <div className="hidden md:flex items-center space-x-7">
            <Link
              to="/products"
              className={`relative group transition-colors duration-300 ${
                isScrolled ? 'text-gray-700 hover:text-black' : 'text-white/90 hover:text-white'
              }`}
            >
              Products
            </Link>

            <Link
              to="/wishlist"
              className={`relative transition-colors duration-300 inline-flex items-center ${
                isScrolled ? 'text-gray-700 hover:text-black' : 'text-white/90 hover:text-white'
              }`}
            >
              Wishlist {wishlistCount > 0 && <CountBadge count={wishlistCount} />}
            </Link>

            <Link
              to="/cart"
              className={`relative transition-colors duration-300 inline-flex items-center ${
                isScrolled ? 'text-gray-700 hover:text-black' : 'text-white/90 hover:text-white'
              }`}
            >
              Cart {cartCount > 0 && <CountBadge count={cartCount} />}
            </Link>

            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`relative group transition-colors duration-300 ${
                      isScrolled ? 'text-gray-700 hover:text-black' : 'text-white/90 hover:text-white'
                    }`}
                  >
                    Admin Panel
                  </Link>
                )}

                <span className={`text-sm flex items-center gap-2 ${isScrolled ? 'text-gray-600' : 'text-white/80'}`}>
                  Hi, {user.name || user.email?.split('@')[0]}
                  {isAdmin && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      isScrolled ? 'bg-black text-white' : 'bg-white text-black'
                    }`}>
                      Admin
                    </span>
                  )}
                </span>

                <button
                  onClick={handleLogout}
                  className={`px-4 py-2 rounded-full border transition-all duration-300 hover:scale-105 ${
                    isScrolled
                      ? 'border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-black'
                      : 'border-white/30 text-white hover:bg-white hover:text-black'
                  }`}
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`px-4 py-2 transition-all duration-300 hover:scale-105 ${
                    isScrolled ? 'text-gray-700 hover:text-black' : 'text-white/90 hover:text-white'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-full border transition-all duration-300 hover:scale-105 ${
                    isScrolled
                      ? 'border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-black'
                      : 'border-white/30 text-white hover:bg-white hover:text-black'
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
          >
            <span className={`absolute block h-0.5 w-6 transform transition-all duration-300 ${
              isScrolled ? 'bg-gray-900' : 'bg-white'
            } ${isMobileMenuOpen ? 'rotate-45 top-5' : 'top-3'}`}></span>
            <span className={`absolute block h-0.5 w-6 transform transition-all duration-300 ${
              isScrolled ? 'bg-gray-900' : 'bg-white'
            } ${isMobileMenuOpen ? 'opacity-0' : 'top-5'}`}></span>
            <span className={`absolute block h-0.5 w-6 transform transition-all duration-300 ${
              isScrolled ? 'bg-gray-900' : 'bg-white'
            } ${isMobileMenuOpen ? '-rotate-45 top-5' : 'top-7'}`}></span>
          </button>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-4">
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block transition-colors duration-300 ${
                isScrolled ? 'text-gray-700 hover:text-black' : 'text-white/90 hover:text-white'
              }`}
            >
              Products
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block transition-colors duration-300 ${
                isScrolled ? 'text-gray-700 hover:text-black' : 'text-white/90 hover:text-white'
              }`}
            >
              Wishlist ({wishlistCount})
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block transition-colors duration-300 ${
                isScrolled ? 'text-gray-700 hover:text-black' : 'text-white/90 hover:text-white'
              }`}
            >
              Cart ({cartCount})
            </Link>

            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block transition-colors duration-300 ${
                      isScrolled ? 'text-gray-700 hover:text-black' : 'text-white/90 hover:text-white'
                    }`}
                  >
                    Admin Panel
                  </Link>
                )}

                <span className={`block text-sm ${isScrolled ? 'text-gray-600' : 'text-white/80'}`}>
                  Hi, {user.name || user.email?.split('@')[0]}
                  {isAdmin && ' (Admin)'}
                </span>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-full border transition-all duration-300 ${
                    isScrolled
                      ? 'border-gray-300 text-gray-700 hover:bg-black hover:text-white'
                      : 'border-white/30 text-white hover:bg-white hover:text-black'
                  }`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block transition-colors duration-300 ${
                    isScrolled ? 'text-gray-700 hover:text-black' : 'text-white/90 hover:text-white'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-full border transition-all duration-300 ${
                    isScrolled
                      ? 'border-gray-300 text-gray-700 hover:bg-black hover:text-white'
                      : 'border-white/30 text-white hover:bg-white hover:text-black'
                  }`}
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
