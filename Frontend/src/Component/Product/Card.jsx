import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Card = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  
  if (!product) return null

  const formattedPrice = Number(product.price || 0).toLocaleString('en-IN')
  const formattedOriginalPrice = product.originalPrice
    ? Number(product.originalPrice).toLocaleString('en-IN')
    : null
  const sizes = product.size
    ? product.size.split(',').map((item) => item.trim()).filter(Boolean)
    : ['S', 'M', 'L', 'XL']

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className='relative w-[280px] sm:w-[300px] md:w-[320px] lg:w-[350px] 
                 bg-gradient-to-br from-zinc-900 to-black 
                 rounded-2xl overflow-hidden 
                 border border-white/10 
                 shadow-2xl
                 group
                 cursor-pointer'
    >
      {/* Image Container */}
      <div className='relative h-[320px] sm:h-[340px] md:h-[360px] lg:h-[380px] overflow-hidden'>
        <motion.img 
          src={product.imageUrl} 
          alt={product.name}
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.5 }}
          className='w-full h-full object-cover'
        />
        
        {/* Overlay Gradient */}
        <div className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
        
        {/* Quick View Button */}
        <AnimatePresence>
          {isHovered && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className='absolute bottom-4 left-1/2 -translate-x-1/2 
                         px-6 py-2 bg-white text-black 
                         text-xs font-semibold tracking-wider
                         rounded-full
                         hover:bg-gray-200 transition
                         shadow-lg'
            >
              QUICK VIEW
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Product Info */}
      <div className='p-4 space-y-2'>
        <div className='flex justify-between items-start'>
          <div className='flex-1'>
            <motion.h3 
              className='text-white font-medium text-sm sm:text-base tracking-wide'
              animate={{ x: isHovered ? 5 : 0 }}
            >
              {product.name}
            </motion.h3>
            <p className='text-gray-400 text-xs mt-1 font-light'>
              {product.category || 'Premium Streetwear'}
            </p>
          </div>
          
          {/* Wishlist Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsLiked(!isLiked)}
            className='p-2 rounded-full hover:bg-white/10 transition'
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill={isLiked ? "#ef4444" : "none"}
              stroke={isLiked ? "#ef4444" : "white"}
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="transition-all duration-300"
            >
              <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
            </svg>
          </motion.button>
        </div>

        {/* Price Section */}
        <div className='flex justify-between items-center pt-2'>
          <div>
            <span className='text-white font-semibold text-lg'>
              ₹{formattedPrice}
            </span>
            {formattedOriginalPrice && (
              <span className='text-gray-500 text-xs line-through ml-2'>
                ₹{formattedOriginalPrice}
              </span>
            )}
          </div>
          
          {/* Add to Cart Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className='px-3 py-1.5 bg-white/10 hover:bg-white/20 
                       rounded-full text-white text-xs font-medium
                       transition-all duration-300
                       border border-white/20 hover:border-white/40'
          >
            ADD
          </motion.button>
        </div>

        {/* Size Indicator */}
        <div className='flex gap-1 pt-1'>
          {sizes.map(size => (
            <span key={size} className='text-[10px] text-gray-500 hover:text-white transition cursor-pointer'>
              {size}
            </span>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className='absolute top-3 left-3 z-10'>
        {product.newArrival && (
          <span className='bg-white/20 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full'>
            NEW
          </span>
        )}
      </div>
      <div className='absolute top-3 right-3 z-10'>
        {product.sale && (
          <span className='bg-red-500/80 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full'>
            {product.discountPercentage ? `${product.discountPercentage}% OFF` : 'SALE'}
          </span>
        )}
      </div>
    </motion.div>
  )
}

export default Card
