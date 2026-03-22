import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';
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
  } = useProducts();

  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
  }, [location.search, fetchAllProducts, fetchProductsByCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      searchProducts(searchInput);
      navigate('/products');
    } else {
      fetchAllProducts();
    }
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 text-center">
          <p className="text-red-500">Error: {error}</p>
          <button onClick={() => fetchAllProducts()} className="mt-4 px-4 py-2 bg-black text-white rounded">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_32%)]">
      <Navbar />

      <div className="pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
          <button onClick={() => navigate(-1)} className="mb-6 text-sm text-slate-600 hover:text-slate-950 transition">
            ? Back
          </button>

          <div className="rounded-[32px] border border-slate-200 bg-white/90 backdrop-blur p-5 md:p-8 shadow-sm mb-8">
            <h1 className="text-3xl md:text-4xl text-center font-semibold tracking-tight text-slate-950">Our Products</h1>
            <p className="text-center text-slate-500 mt-3 max-w-2xl mx-auto">
              Cleaner filters, better contrast, and a mobile-friendly browsing flow so shopping feels smooth on every screen.
            </p>

            <div className="max-w-3xl mx-auto mt-6 mb-6">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search products, colors, brands..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="flex-1 px-5 py-3 border border-slate-200 rounded-full focus:outline-none focus:border-slate-900"
                />
                <button type="submit" className="px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-slate-700 transition">
                  Search
                </button>
              </form>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {['all', 'tshirts', 'hoodies', 'jackets'].map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-4 py-2 rounded-full transition ${
                    selectedCategory === category
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {category === 'all' ? 'All' : category === 'tshirts' ? 'T-Shirts' : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 rounded-[28px] bg-white border border-slate-200 shadow-sm">
              <p className="text-slate-500">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
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
