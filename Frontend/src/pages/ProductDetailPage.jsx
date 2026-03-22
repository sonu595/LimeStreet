import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import Navbar from '../components/layout/Navbar';

const ProductDetailPage = () => {
  const { id } = useParams();  // Get product ID from URL
  const navigate = useNavigate();
  const { getProductById, loading } = useProducts();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Load product when page opens
  useEffect(() => {
    const loadProduct = async () => {
      const data = await getProductById(id);
      if (data) {
        setProduct(data);
      }
    };
    loadProduct();
    window.scrollTo(0, 0);  // Scroll to top
  }, [id]);

  // Handle add to cart
  const handleAddToCart = () => {
    alert(`Added ${quantity} item(s) to cart!`);
    // You can add actual cart logic here
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
          <p className="mt-4 text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  // Show if product not found
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
          
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-8 text-gray-600 hover:text-black transition"
          >
            ← Back to Products
          </button>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Product Image */}
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Product Info */}
            <div>
              {/* Category/Brand */}
              <p className="text-sm text-gray-500 mb-2">{product.category || 'Apparel'}</p>
              
              {/* Product Name */}
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              
              {/* Price */}
              <p className="text-2xl text-gray-900 mb-4">₹{product.price}</p>
              
              {/* Description */}
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <p className="text-green-600">✓ In Stock ({product.stock} available)</p>
                ) : (
                  <p className="text-red-500">✗ Out of Stock</p>
                )}
              </div>
              
              {/* Quantity Selector */}
              {product.stock > 0 && (
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
              )}
              
              {/* Add to Cart Button */}
              {product.stock > 0 && (
                <button
                  onClick={handleAddToCart}
                  className="w-full px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;