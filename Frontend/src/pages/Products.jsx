import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';
import Navbar from '../components/layout/Navbar';

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    filteredProducts,  // Products after filtering
    loading,           // Loading state
    error,             // Error state
    fetchAllProducts,  // Function to get all products
    fetchProductsByCategory, // Function to get products by category
    searchProducts     // Function to search products
  } = useProducts();

  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get category from URL when page loads
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    
    if (category) {
      setSelectedCategory(category);
      fetchProductsByCategory(category);
    } else {
      setSelectedCategory('all');
      fetchAllProducts();
    }
  }, [location.search]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      searchProducts(searchInput);
      navigate('/products');
    } else {
      fetchAllProducts();
    }
  };

  // Handle category filter click
  const handleCategoryClick = (category) => {
    if (category === 'all') {
      navigate('/products');
      fetchAllProducts();
    } else {
      navigate(`/products?category=${category}`);
      fetchProductsByCategory(category);
    }
    setSelectedCategory(category);
  };

  // Go back to previous page
  const handleBack = () => {
    navigate(-1);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 text-center">
          <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 text-center">
          <p className="text-red-500">Error: {error}</p>
          <button 
            onClick={() => fetchAllProducts()}
            className="mt-4 px-4 py-2 bg-black text-white rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-8 text-gray-600 hover:text-black transition"
          >
            ← Back
          </button>

          {/* Page Title */}
          <h1 className="text-3xl text-center mb-8">Our Products</h1>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
              >
                Search
              </button>
            </form>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => handleCategoryClick('all')}
              className={`px-4 py-2 rounded-full transition ${
                selectedCategory === 'all' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleCategoryClick('tshirts')}
              className={`px-4 py-2 rounded-full transition ${
                selectedCategory === 'tshirts' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              T-Shirts
            </button>
            <button
              onClick={() => handleCategoryClick('hoodies')}
              className={`px-4 py-2 rounded-full transition ${
                selectedCategory === 'hoodies' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hoodies
            </button>
            <button
              onClick={() => handleCategoryClick('jackets')}
              className={`px-4 py-2 rounded-full transition ${
                selectedCategory === 'jackets' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Jackets
            </button>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;