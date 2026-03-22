import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import ProductCard from '../components/products/ProductCard';
import { useShop } from '../context/ShopContext';

const Wishlist = () => {
  const { wishlist, isSyncing } = useShop();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_34%)]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24 md:pt-28 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-[28px] border border-orange-100 bg-white/90 p-6 md:p-8 shadow-sm"
        >
          <h1 className="text-3xl font-semibold text-slate-950">Your Wishlist</h1>
          <p className="text-slate-600 mt-2">
            {isSyncing ? 'Updating your saved picks...' : 'Save your favorite designs and pick them up whenever you are ready.'}
          </p>
        </motion.div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-[28px] p-10 text-center shadow-sm border border-slate-200">
            <p className="text-slate-600 mb-4">Your wishlist is empty.</p>
            <Link to="/products" className="inline-block px-6 py-3 rounded-full bg-black text-white">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
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
