import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useShop } from '../../context/ShopContext';
import { formatCurrency, getImageUrl } from '../../utils/shop';

const ProductCard = ({ product, index = 0 }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
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
      className="group relative bg-white rounded-[28px] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        {!imageLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}

        <img
          src={imageError ? getImageUrl('') : getImageUrl(product.imageUrl)}
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
          className={`absolute top-4 right-4 h-10 w-10 rounded-full flex items-center justify-center backdrop-blur-md border text-xs font-semibold transition ${
            isInWishlist(product.id)
              ? 'bg-rose-500 text-white border-rose-500'
              : 'bg-white/80 text-gray-700 border-white'
          }`}
          aria-label="Toggle wishlist"
        >
          SAVE
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="w-full py-3 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-700 transition-colors shadow-lg md:opacity-0 md:group-hover:opacity-100"
          >
            Add to Cart
          </button>
        </motion.div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
            {product.category || product.brand || 'Signature'}
          </span>
          <span className="text-xs text-slate-500">{product.stock > 0 ? 'In stock' : 'Sold out'}</span>
        </div>
        <h3 className="text-base font-medium text-gray-900 line-clamp-1 mb-2">{product.name}</h3>
        <div className="flex items-center justify-between gap-3">
          <span className="text-lg font-light text-gray-900">{formatCurrency(product.price)}</span>
          <span className="text-sm text-gray-600">{product.rating || 0} ({product.reviewCount || 0})</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
