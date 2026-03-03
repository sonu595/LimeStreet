import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';
import { useEffect } from 'react';

const Home = () => {
  const { newArrivals, bestSellers, fetchNewArrivals, fetchBestSellers } = useProducts();

  useEffect(() => {
    fetchNewArrivals();
    fetchBestSellers();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Welcome to LimeStreet</h1>
        <p style={{ fontSize: '18px', marginBottom: '30px', opacity: 0.9 }}>
          Discover the latest fashion trends at best prices
        </p>
        <Link to="/products">
          <button style={{
            padding: '15px 40px',
            backgroundColor: 'white',
            color: '#333',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Shop Now
          </button>
        </Link>
      </div>

      {/* New Arrivals */}
      <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '30px', textAlign: 'center' }}>
          New Arrivals
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Best Sellers */}
      <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '30px', textAlign: 'center' }}>
          Best Sellers
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '30px', textAlign: 'center' }}>
          Shop by Category
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          {['MEN', 'WOMEN', 'KIDS', 'ACCESSORIES'].map((category) => (
            <Link key={category} to={`/products?category=${category}`} style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '40px 20px',
                textAlign: 'center',
                borderRadius: '8px',
                transition: 'transform 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <h3 style={{ color: '#333', margin: 0 }}>{category}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;