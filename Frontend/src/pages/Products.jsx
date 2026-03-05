import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    filteredProducts, 
    loading, 
    error, 
    fetchAllProducts,
    fetchProductsByCategory,
    searchProducts,
    filterByPrice,
    sortProducts
  } = useProducts();

  const [searchInput, setSearchInput] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const categories = ['MEN', 'WOMEN', 'KIDS', 'ACCESSORIES', 'FOOTWEAR', 'BAGS', 'WATCHES', 'SPORTS'];

  // Get category from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      fetchProductsByCategory(category);
    } else {
      fetchAllProducts();
    }
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      searchProducts(searchInput);
      navigate('/products');
    } else {
      fetchAllProducts();
    }
  };

  const handleCategoryChange = (category) => {
    if (category === 'all') {
      navigate('/products');
      fetchAllProducts();
    } else {
      navigate(`/products?category=${category}`);
      fetchProductsByCategory(category);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-white"
    >
      <Navbar />
      
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBack}
              className="group flex items-center text-gray-600 hover:text-black transition-colors"
            >
              <svg 
                className="w-5 h-5 mr-2 transform transition-transform group-hover:-translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-light">Back</span>
            </button>

            <h1 className="text-3xl font-light text-gray-900">Our Collection</h1>
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden p-2 text-gray-600 hover:text-black transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>

            {/* Desktop spacer */}
            <div className="w-20 hidden lg:block" />
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`w-full px-6 py-4 border rounded-full transition-all duration-300 focus:outline-none ${
                  isSearchFocused 
                    ? 'border-black shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300"
              >
                Search
              </button>
            </form>
          </motion.div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block lg:w-80">
              <ProductFilters
                onCategoryChange={handleCategoryChange}
                onPriceFilter={filterByPrice}
                onSort={sortProducts}
                categories={categories}
              />
            </div>

            {/* Mobile Filters Drawer */}
            <AnimatePresence>
              {showFilters && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowFilters(false)}
                    className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                  />
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'tween', duration: 0.3 }}
                    className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-light">Filters</h3>
                        <button
                          onClick={() => setShowFilters(false)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <ProductFilters
                        onCategoryChange={handleCategoryChange}
                        onPriceFilter={filterByPrice}
                        onSort={sortProducts}
                        categories={categories}
                      />
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Products Grid */}
            <div className="flex-1">
              <ProductGrid products={filteredProducts} loading={loading} error={error} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Products;