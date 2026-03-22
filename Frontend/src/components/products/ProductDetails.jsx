import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, loading } = useProducts();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductById(id);
      if (data) {
        setProduct(data);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  // ✅ Function to get full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageError) {
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='750' viewBox='0 0 600 750'%3E%3Crect width='600' height='750' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='20' fill='%23999' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
    }
    
    if (imageUrl.startsWith('/uploads/')) {
      return `http://localhost:8080${imageUrl}`;
    }
    
    return imageUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate('/products')}
            className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // ✅ Create images array with full URLs
  const images = [
    getImageUrl(product.imageUrl),
    product.imageUrl ? getImageUrl(product.imageUrl) + '?random=1' : null,
    product.imageUrl ? getImageUrl(product.imageUrl) + '?random=2' : null,
  ].filter(Boolean);

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate(-1)}
          className="group mb-8 flex items-center text-gray-600 hover:text-black transition-colors duration-300"
        >
          <span className="transform transition-transform duration-300 group-hover:-translate-x-2">←</span>
          <span className="ml-2">Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div 
              className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <img
                src={images[selectedImage]}
                alt={product.name}
                onError={() => setImageError(true)}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 ${
                    selectedImage === index ? 'ring-2 ring-black' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
              <h1 className="text-4xl font-light text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <span className="text-yellow-400 text-xl">★</span>
                  <span className="ml-1 text-lg text-gray-900">{product.rating}</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-600">{product.reviewCount} reviews</span>
              </div>
              
              <p className="text-3xl font-light text-gray-900 mb-6">
                ₹{product.price}
              </p>
              
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className={`py-4 border-t border-b border-gray-100 ${
              product.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {product.stock > 0 
                ? `✓ In Stock (${product.stock} available)` 
                : '✗ Out of Stock'}
            </div>

            {product.stock > 0 && (
              <>
                <div className="flex items-center space-x-4">
                  <label className="text-gray-700">Quantity:</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    {[...Array(Math.min(10, product.stock))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
                    Add to Cart
                  </button>
                  <button className="px-8 py-4 border-2 border-black text-black rounded-full hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105">
                    Wishlist
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;