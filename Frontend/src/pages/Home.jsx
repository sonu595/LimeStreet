import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
};

const categoryCards = [
  {
    label: 'Street Tees',
    query: 'tshirts',
    description: 'Minimal cuts and bold prints for everyday wear.',
    accent: 'from-fuchsia-500/20 to-violet-500/10',
  },
  {
    label: 'Urban Hoodies',
    query: 'hoodies',
    description: 'Soft layers designed for comfort and movement.',
    accent: 'from-cyan-500/20 to-sky-500/10',
  },
  {
    label: 'Night Jackets',
    query: 'jackets',
    description: 'Refined silhouettes built for cooler nights.',
    accent: 'from-emerald-500/20 to-teal-500/10',
  },
  {
    label: 'Smart Accessories',
    query: 'accessories',
    description: 'Final details that complete your fit.',
    accent: 'from-amber-500/20 to-orange-500/10',
  },
];

const Home = () => {
  const { newArrivals, bestSellers, fetchNewArrivals, fetchBestSellers } = useProducts();
  const { user, isAdmin } = useAuth();
  const { cartCount, wishlistCount } = useShop();

  useEffect(() => {
    fetchNewArrivals();
    fetchBestSellers();
  }, [fetchNewArrivals, fetchBestSellers]);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <Navbar />

      <section className="relative min-h-screen overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(168,85,247,0.22),transparent_35%),radial-gradient(circle_at_80%_15%,rgba(56,189,248,0.2),transparent_35%),radial-gradient(circle_at_50%_85%,rgba(34,197,94,0.14),transparent_30%)]" />

        <motion.div
          animate={{ y: [0, -16, 0], rotate: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut' }}
          className="absolute -top-14 -left-12 h-52 w-52 rounded-full blur-3xl bg-fuchsia-500/25"
        />
        <motion.div
          animate={{ y: [0, 12, 0], x: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
          className="absolute top-20 right-10 h-44 w-44 rounded-full blur-3xl bg-cyan-500/30"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16"
        >
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div variants={itemVariants} className="text-left">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs tracking-[0.26em] uppercase text-slate-300">
                LimeStreet Reimagined
              </span>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
                Next-Gen Fashion UI
                <span className="block bg-gradient-to-r from-fuchsia-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  Animated & Modern
                </span>
              </h1>
              <p className="mt-6 text-slate-300 max-w-xl text-sm sm:text-base leading-relaxed">
                Discover curated drops, clean product exploration, and smooth motion-first interactions crafted for a premium shopping experience.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/products"
                  className="rounded-full bg-white text-slate-950 px-6 py-3 text-sm font-medium transition hover:scale-[1.03] hover:shadow-lg hover:shadow-white/20"
                >
                  Explore Collection
                </Link>
                <Link
                  to="/products?sort=new"
                  className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm text-white transition hover:bg-white/10"
                >
                  Latest Drops
                </Link>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/30">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Live Profile</p>
                <h3 className="mt-3 text-2xl font-semibold">
                  {user ? `Welcome, ${user.name || user.email}` : 'Guest Experience'}
                </h3>
                <p className="mt-2 text-slate-300 text-sm">
                  {isAdmin ? 'Admin controls are active with management access.' : 'Your wishlist and cart are synced for quick checkout.'}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <motion.div whileHover={{ y: -4 }} className="rounded-2xl bg-white/10 p-4 border border-white/10">
                    <p className="text-xs text-slate-300">Wishlist</p>
                    <p className="mt-2 text-2xl font-semibold">{wishlistCount}</p>
                  </motion.div>
                  <motion.div whileHover={{ y: -4 }} className="rounded-2xl bg-white/10 p-4 border border-white/10">
                    <p className="text-xs text-slate-300">Cart</p>
                    <p className="mt-2 text-2xl font-semibold">{cartCount}</p>
                  </motion.div>
                </div>

                <div className="mt-4 rounded-2xl bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 border border-white/10 p-4 text-sm text-slate-200">
                  Status: {user ? (isAdmin ? 'Admin Member' : 'Active Member') : 'Visitor'}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Trending Now</p>
              <h2 className="text-3xl font-semibold mt-2">New Arrivals</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Community Picks</p>
              <h2 className="text-3xl font-semibold mt-2">Best Sellers</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-center">Shop by Category</h2>
          <p className="text-center text-slate-400 mt-3 mb-10">Fresh design cards with hover-lift animation.</p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {categoryCards.map((category) => (
              <motion.div key={category.query} variants={itemVariants} whileHover={{ y: -6 }}>
                <Link
                  to={`/products?category=${category.query}`}
                  className={`h-full rounded-2xl border border-white/10 bg-gradient-to-br ${category.accent} p-5 block transition duration-300 hover:border-white/20`}
                >
                  <h3 className="text-lg font-medium">{category.label}</h3>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">{category.description}</p>
                  <span className="mt-6 inline-flex text-xs tracking-wide text-white/80">Browse Category →</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
