import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Navbar from '../components/layout/Navbar';

const Home = () => {
  const { newArrivals, bestSellers, fetchNewArrivals, fetchBestSellers } = useProducts();
  const [heroLoaded, setHeroLoaded] = useState(false);
  
  // Refs for sections
  const heroRef = useRef(null);
  const arrivalsRef = useRef(null);
  const sellersRef = useRef(null);
  const categoriesRef = useRef(null);
  const newsletterRef = useRef(null);

  // Scroll animations
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // InView hooks for sections
  const arrivalsInView = useInView(arrivalsRef, { once: true, amount: 0.3 });
  const sellersInView = useInView(sellersRef, { once: true, amount: 0.3 });
  const categoriesInView = useInView(categoriesRef, { once: true, amount: 0.3 });
  const newsletterInView = useInView(newsletterRef, { once: true, amount: 0.3 });

  useEffect(() => {
    fetchNewArrivals();
    fetchBestSellers();
  }, []);

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const cardItemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const categoryVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  return (
    <div className="bg-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section - Full Screen with Parallax */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image with Loading State */}
        <div className="absolute inset-0">
          {!heroLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}
          <motion.img
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Custom T-Shirts"
            onLoad={() => setHeroLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-1000 ${
              heroLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-5xl md:text-7xl font-light mb-6 tracking-tight"
          >
            Wear Your Story
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-xl md:text-2xl font-light mb-12 opacity-90 max-w-2xl mx-auto"
          >
            Custom printed t-shirts that speak your language. Anime, quotes, art & more.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-white text-black rounded-full font-light tracking-wide hover:bg-gray-100 transition-colors shadow-lg"
              >
                Explore Collection
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* New Arrivals Section */}
      <motion.section
        ref={arrivalsRef}
        variants={sectionVariants}
        initial="hidden"
        animate={arrivalsInView ? "visible" : "hidden"}
        className="py-24 px-4 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={arrivalsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              Fresh Drops
            </h2>
            <p className="text-gray-500 font-light max-w-2xl mx-auto">
              New designs added weekly. Be the first to wear them.
            </p>
            <div className="w-16 h-0.5 bg-gray-300 mx-auto mt-6" />
          </motion.div>

          {/* Product Cards Grid */}
          <motion.div
            variants={cardContainerVariants}
            initial="hidden"
            animate={arrivalsInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {newArrivals.slice(0, 4).map((product, index) => (
              <motion.div key={product.id} variants={cardItemVariants}>
                <ProductCard product={product} index={index} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Best Sellers Section */}
      <motion.section
        ref={sellersRef}
        variants={sectionVariants}
        initial="hidden"
        animate={sellersInView ? "visible" : "hidden"}
        className="py-24 px-4 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={sellersInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              Fan Favorites
            </h2>
            <p className="text-gray-500 font-light max-w-2xl mx-auto">
              Most loved designs by our community
            </p>
            <div className="w-16 h-0.5 bg-gray-400 mx-auto mt-6" />
          </motion.div>

          {/* Product Cards Grid */}
          <motion.div
            variants={cardContainerVariants}
            initial="hidden"
            animate={sellersInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {bestSellers.slice(0, 4).map((product, index) => (
              <motion.div key={product.id} variants={cardItemVariants}>
                <ProductCard product={product} index={index} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Design Categories Section */}
      <motion.section
        ref={categoriesRef}
        variants={sectionVariants}
        initial="hidden"
        animate={categoriesInView ? "visible" : "hidden"}
        className="py-24 px-4 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={categoriesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              Find Your Vibe
            </h2>
            <p className="text-gray-500 font-light max-w-2xl mx-auto">
              Browse by design style
            </p>
            <div className="w-16 h-0.5 bg-gray-300 mx-auto mt-6" />
          </motion.div>

          {/* Categories Grid */}
          <motion.div
            variants={cardContainerVariants}
            initial="hidden"
            animate={categoriesInView ? "visible" : "hidden"}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {[
              { name: 'ANIME', image: 'https://images.unsplash.com/photo-1576565401589-9e3d5391a79e', count: '24 designs' },
              { name: 'CARTOON', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a', count: '18 designs' },
              { name: 'MOVIES', image: 'https://images.unsplash.com/photo-1598033129876-0ea3c3e3a8c3', count: '32 designs' },
              { name: 'MUSIC', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820', count: '21 designs' },
              { name: 'FUNNY', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a', count: '15 designs' },
              { name: 'QUOTES', image: 'https://images.unsplash.com/photo-1598033129876-0ea3c3e3a8c3', count: '19 designs' },
              { name: 'ABSTRACT', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820', count: '12 designs' },
              { name: 'NATURE', image: 'https://images.unsplash.com/photo-1576565401589-9e3d5391a79e', count: '16 designs' }
            ].map((category, index) => (
              <motion.div
                key={category.name}
                variants={categoryVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Link
                  to={`/products?design=${category.name}`}
                  className="group relative block overflow-hidden rounded-2xl aspect-square"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-lg font-light tracking-wide">{category.name}</h3>
                    <p className="text-xs opacity-80 mt-1">{category.count}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        ref={newsletterRef}
        variants={sectionVariants}
        initial="hidden"
        animate={newsletterInView ? "visible" : "hidden"}
        className="py-24 px-4 bg-gray-50"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: '🎨', title: 'Custom Designs', desc: 'Create your own unique design' },
              { icon: '✨', title: 'Premium Quality', desc: '100% cotton, print that lasts' },
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹999' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={cardItemVariants}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="text-4xl mb-4 inline-block"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Newsletter Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate={newsletterInView ? "visible" : "hidden"}
        className="py-24 px-4 bg-black text-white"
      >
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={newsletterInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl font-light mb-4"
          >
            Stay in the Loop
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={newsletterInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-400 mb-8 font-light"
          >
            Get early access to new drops and exclusive offers
          </motion.p>
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={newsletterInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white placeholder:text-gray-500 rounded-full focus:outline-none focus:border-white transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-8 py-4 bg-white text-black rounded-full font-light hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </motion.button>
          </motion.form>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;