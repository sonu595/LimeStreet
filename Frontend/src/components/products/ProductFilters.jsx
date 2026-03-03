import { useState } from 'react';

const ProductFilters = ({ onCategoryChange, onPriceFilter, onSort, categories }) => {
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCategory, setSelectedCategory] = useState('all');

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
    <div style={{
      width: '280px',
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      height: 'fit-content'
    }}>
      <h3 style={{ 
        margin: '0 0 20px 0', 
        fontSize: '18px',
        fontWeight: '600',
        color: '#333'
      }}>
        Filters
      </h3>
      
      {/* Categories */}
      <div style={{ marginBottom: '25px' }}>
        <h4 style={{ 
          margin: '0 0 15px 0', 
          fontSize: '15px',
          fontWeight: '600',
          color: '#555'
        }}>
          Categories
        </h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <button
              onClick={() => handleCategoryClick('all')}
              style={{
                background: selectedCategory === 'all' ? '#000' : 'none',
                border: 'none',
                color: selectedCategory === 'all' ? '#fff' : '#333',
                cursor: 'pointer',
                padding: '8px 12px',
                width: '100%',
                textAlign: 'left',
                borderRadius: '4px',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            >
              All Products
            </button>
          </li>
          {categories.map((category) => (
            <li key={category} style={{ marginBottom: '10px' }}>
              <button
                onClick={() => handleCategoryClick(category)}
                style={{
                  background: selectedCategory === category ? '#000' : 'none',
                  border: 'none',
                  color: selectedCategory === category ? '#fff' : '#333',
                  cursor: 'pointer',
                  padding: '8px 12px',
                  width: '100%',
                  textAlign: 'left',
                  borderRadius: '4px',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div style={{ marginBottom: '25px' }}>
        <h4 style={{ 
          margin: '0 0 15px 0', 
          fontSize: '15px',
          fontWeight: '600',
          color: '#555'
        }}>
          Price Range
        </h4>
        <div>
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <button
            onClick={handlePriceFilter}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#000',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000'}
          >
            Apply Price Filter
          </button>
        </div>
      </div>

      {/* Sort */}
      <div>
        <h4 style={{ 
          margin: '0 0 15px 0', 
          fontSize: '15px',
          fontWeight: '600',
          color: '#555'
        }}>
          Sort By
        </h4>
        <select
          onChange={handleSortChange}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            backgroundColor: 'white'
          }}
        >
          <option value="">Select</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Rating</option>
          <option value="newest">Newest First</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;