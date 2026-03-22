import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

const Home = () => {
  const { newArrivals, bestSellers, fetchNewArrivals, fetchBestSellers } = useProducts();
  const { user, isAdmin } = useAuth();
  const { cartCount, wishlistCount } = useShop();

  useEffect(() => {
    fetchNewArrivals();
    fetchBestSellers();
  }, [fetchNewArrivals, fetchBestSellers]);

  return (
    <div className="bg-white">
      <Navbar />

      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b"
            alt="hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl mb-4">Wear Your Story</h1>
          <p className="mb-8 text-sm sm:text-base">Custom printed t-shirts for you</p>
          <Link to="/products">
            <button className="px-8 py-3 bg-white text-black rounded-full hover:scale-105 transition-transform">
              Shop Now
            </button>
          </Link>
        </motion.div>
      </section>

      <section className="py-10 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 text-white p-6 md:p-8 shadow-xl"
          >
            <p className="text-sm text-white/70">Member Card</p>
            <h3 className="text-2xl font-semibold mt-1">{user ? `Welcome back, ${user.name || user.email}` : 'Welcome, Guest'}</h3>
            <p className="text-white/80 mt-2">
              {isAdmin ? 'Admin access enabled.' : 'Track your favorites and cart items instantly.'}
            </p>
            <div className="mt-5 flex gap-3 flex-wrap">
              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20">Wishlist: {wishlistCount}</span>
              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20">Cart Items: {cartCount}</span>
              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20">
                Status: {user ? (isAdmin ? 'Admin' : 'Member') : 'Guest'}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl text-center mb-10">New Arrivals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl text-center mb-10">Best Sellers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl text-center mb-10">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/products?category=tshirts">
              <div className="bg-gray-200 h-32 flex items-center justify-center rounded-lg hover:bg-gray-300 transition">
                T-Shirts
              </div>
            </Link>
            <Link to="/products?category=hoodies">
              <div className="bg-gray-200 h-32 flex items-center justify-center rounded-lg hover:bg-gray-300 transition">
                Hoodies
              </div>
            </Link>
            <Link to="/products?category=jackets">
              <div className="bg-gray-200 h-32 flex items-center justify-center rounded-lg hover:bg-gray-300 transition">
                Jackets
              </div>
            </Link>
            <Link to="/products?category=accessories">
              <div className="bg-gray-200 h-32 flex items-center justify-center rounded-lg hover:bg-gray-300 transition">
                Accessories
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
