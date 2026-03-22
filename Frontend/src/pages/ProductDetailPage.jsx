import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import Navbar from '../components/layout/Navbar';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, loading } = useProducts();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      const data = await getProductById(id);
      if (data) {
        setProduct(data);
        console.log('Product loaded:', data);
      }
    };
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  // ✅ Get full image URL
  const getImageUrl = () => {
    if (!product?.imageUrl || imageError) {
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='750' viewBox='0 0 600 750'%3E%3Crect width='600' height='750' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='20' fill='%23999' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
    }
    
    if (product.imageUrl.startsWith('/uploads/')) {
      return `http://localhost:8080${product.imageUrl}`;
    }
    
    return product.imageUrl;
  };

  const handleAddToCart = () => {
    alert(`Added ${quantity} item(s) to cart!`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 text-center">
          <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 text-center">
          <p className="text-gray-500 mb-4">Product not found</p>
          <button
            onClick={() => navigate('/products')}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            Browse Products
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
          
          <button
            onClick={handleBack}
            className="mb-8 text-gray-600 hover:text-black transition"
          >
            ← Back to Products
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Product Image - ✅ Fixed URL */}
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={getImageUrl()}
                alt={product.name}
                onError={() => setImageError(true)}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Product Info */}
            <div>
              <p className="text-sm text-gray-500 mb-2">{product.category || 'Apparel'}</p>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-2xl text-gray-900 mb-4">₹{product.price}</p>
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              <div className="mb-6">
                {product.stock > 0 ? (
                  <p className="text-green-600">✓ In Stock ({product.stock} available)</p>
                ) : (
                  <p className="text-red-500">✗ Out of Stock</p>
                )}
              </div>
              
              {product.stock > 0 && (
                <>
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Quantity:</label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                    >
                      {[...Array(Math.min(10, product.stock))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    className="w-full px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition"
                  >
                    Add to Cart
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;