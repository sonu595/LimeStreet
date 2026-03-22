import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useShop } from '../../context/ShopContext';

const ProductCard = ({ product, index = 0 }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const getImageUrl = () => {
    if (imageError || !product.imageUrl) {
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='750' viewBox='0 0 600 750'%3E%3Crect width='600' height='750' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='20' fill='%23999' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
    }

    if (product.imageUrl.startsWith('/uploads/')) {
      return `http://localhost:8080${product.imageUrl}`;
    }

    return product.imageUrl;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.08 }}
      whileHover={{ y: -10, scale: 1.01 }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        {!imageLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}

        <img
          src={getImageUrl()}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-4 right-4 h-10 w-10 rounded-full flex items-center justify-center backdrop-blur-md border transition ${
            isInWishlist(product.id)
              ? 'bg-rose-500 text-white border-rose-500'
              : 'bg-white/80 text-gray-700 border-white'
          }`}
          aria-label="Toggle wishlist"
        >
          ♥
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.25 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="w-full py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Add to Cart
          </button>
        </motion.div>
      </div>

      <div className="p-5">
        <h3 className="text-base font-medium text-gray-900 line-clamp-1 mb-2">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-light text-gray-900">₹{product.price}</span>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm text-gray-600">{product.rating || 0} ({product.reviewCount || 0})</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
