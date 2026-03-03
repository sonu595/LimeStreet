import { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';

const Products = () => {
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
  const categories = ['MEN', 'WOMEN', 'KIDS', 'ACCESSORIES', 'FOOTWEAR', 'BAGS', 'WATCHES', 'SPORTS'];

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      searchProducts(searchInput);
    } else {
      fetchAllProducts();
    }
  };

  const handleCategoryChange = (category) => {
    if (category === 'all') {
      fetchAllProducts();
    } else {
      fetchProductsByCategory(category);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px', color: '#333' }}>
        Our Products
      </h1>
      
      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px', maxWidth: '500px' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 15px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px 30px',
              backgroundColor: '#000',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Search
          </button>
        </div>
      </form>

      {/* Main Content */}
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        {/* Filters Sidebar */}
        <ProductFilters
          onCategoryChange={handleCategoryChange}
          onPriceFilter={filterByPrice}
          onSort={sortProducts}
          categories={categories}
        />

        {/* Products Grid */}
        <div style={{ flex: 1 }}>
          <ProductGrid products={filteredProducts} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default Products;