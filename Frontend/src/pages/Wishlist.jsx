import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import ProductCard from '../components/products/ProductCard';
import { useShop } from '../context/ShopContext';

const Wishlist = () => {
  const { wishlist } = useShop();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-semibold">Your Wishlist</h1>
          <p className="text-gray-600 mt-2">Save your favorite designs and buy them later.</p>
        </motion.div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <p className="text-gray-600 mb-4">Your wishlist is empty.</p>
            <Link to="/products" className="inline-block px-6 py-3 rounded-full bg-black text-white">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
