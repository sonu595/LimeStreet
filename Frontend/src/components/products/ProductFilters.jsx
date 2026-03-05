import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductFilters = ({ onCategoryChange, onPriceFilter, onSort, categories }) => {
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  const handlePriceFilter = () => {
    if (priceRange.min && priceRange.max) {
      onPriceFilter(Number(priceRange.min), Number(priceRange.max));
    }
  };

  const handleSortChange = (e) => {
    onSort(e.target.value);
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-black text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition-all duration-300"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </button>

      {/* Filters Sidebar */}
      <AnimatePresence>
        {(isFiltersOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`${
              window.innerWidth >= 1024 ? 'relative' : 'fixed inset-0 z-40'
            } lg:relative lg:w-80`}
          >
            <div className={`${
              window.innerWidth >= 1024 ? 'bg-gray-50' : 'bg-white'
            } p-6 rounded-2xl h-full overflow-y-auto`}>
              
              {/* Mobile Close Button */}
              {window.innerWidth < 1024 && (
                <button
                  onClick={() => setIsFiltersOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-black"
                >
                  ✕
                </button>
              )}

              <h3 className="text-xl font-light mb-6">Filters</h3>
              
              {/* Categories */}
              <div className="mb-8">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Categories</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryClick('all')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                      selectedCategory === 'all'
                        ? 'bg-black text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-black text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Price Range</h4>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <button
                    onClick={handlePriceFilter}
                    className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-4">Sort By</h4>
                <select
                  onChange={handleSortChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="">Select</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductFilters;