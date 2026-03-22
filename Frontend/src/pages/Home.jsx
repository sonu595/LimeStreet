import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';
import { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';

const Home = () => {
  const { newArrivals, bestSellers, fetchNewArrivals, fetchBestSellers } = useProducts();

  // Load products when page opens
  useEffect(() => {
    fetchNewArrivals();  // Get new products
    fetchBestSellers();  // Get popular products
  }, []);

  return (
    <div className="bg-white">
      <Navbar />

      {/* Hero Section - Main Banner */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b"
            alt="hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl mb-4">Wear Your Story</h1>
          <p className="mb-8">Custom printed t-shirts for you</p>
          <Link to="/products">
            <button className="px-8 py-3 bg-white text-black rounded-full">
              Shop Now
            </button>
          </Link>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl text-center mb-10">New Arrivals</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl text-center mb-10">Best Sellers</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl text-center mb-10">Shop by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/products?category=tshirts">
              <div className="bg-gray-200 h-32 flex items-center justify-center rounded-lg hover:bg-gray-300 transition">
                T-Shirts
              </div>
            </Link>
            <Link to="/products?category=hoodies">
              <div className="bg-gray-200 h-32 flex items-center justify-center rounded-lg hover:bg-gray-300 transition">
                Hoodies
              </div>
            </Link>
            <Link to="/products?category=jackets">
              <div className="bg-gray-200 h-32 flex items-center justify-center rounded-lg hover:bg-gray-300 transition">
                Jackets
              </div>
            </Link>
            <Link to="/products?category=accessories">
              <div className="bg-gray-200 h-32 flex items-center justify-center rounded-lg hover:bg-gray-300 transition">
                Accessories
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-black text-white">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl mb-4">Subscribe to Our Newsletter</h2>
          <p className="mb-6">Get updates about new products and offers</p>
          
          <div className="flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 text-black rounded"
            />
            <button className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;