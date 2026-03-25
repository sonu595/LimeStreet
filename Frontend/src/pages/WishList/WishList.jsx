import React from 'react'
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'

const formatPrice = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`

const WishList = () => {
  const {
    wishlistItems,
    moveWishlistToCart,
    removeFromWishlist,
    storeLoading
  } = useStore()

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">My Wishlist</h1>
              <p className="text-gray-400 text-sm mt-1">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition"
            >
              Browse Products
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {storeLoading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="bg-zinc-950 rounded-2xl border border-white/10 p-12 text-center">
            <Heart className="mx-auto h-16 w-16 text-gray-600" />
            <h2 className="mt-4 text-2xl font-semibold text-white">Your wishlist is empty</h2>
            <p className="mt-2 text-gray-400">Save your favorite items here for later purchase</p>
            <Link
              to="/"
              className="inline-block mt-6 bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile View - Horizontal Scroll */}
            <div className="block md:hidden overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex gap-4">
                {wishlistItems.map((item) => (
                  <div
                    key={`${item.id}-${item.productId}`}
                    className="w-64 flex-shrink-0 bg-zinc-950 rounded-2xl border border-white/10 overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-black">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                      {item.discountPercentage && (
                        <span className="absolute top-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {item.discountPercentage}% OFF
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <p className="text-xs text-gray-500 uppercase">{item.productCategory || 'Product'}</p>
                      <h3 className="text-sm font-semibold text-white mt-1 line-clamp-2">
                        {item.productName}
                      </h3>
                      
                      <div className="mt-2">
                        <p className="text-lg font-bold text-white">{formatPrice(item.price)}</p>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <p className="text-xs text-gray-500 line-through">{formatPrice(item.originalPrice)}</p>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => moveWishlistToCart(item)}
                          className="flex-1 bg-white text-black py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.productId)}
                          className="border border-white/20 text-white p-2 rounded-lg hover:bg-white/10 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop View - Grid Layout */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={`${item.id}-${item.productId}`}
                  className="group bg-zinc-950 rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 hover:scale-[1.02] transition-all duration-300"
                >
                  {/* Image Container */}
                  <div className="relative h-64 bg-black overflow-hidden">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {item.discountPercentage && (
                      <span className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {item.discountPercentage}% OFF
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      {item.productCategory || 'Product'}
                    </p>
                    <h3 className="text-base font-semibold text-white mt-1 line-clamp-2 min-h-[48px]">
                      {item.productName}
                    </h3>
                    
                    {/* Price Section */}
                    <div className="mt-3">
                      <div className="flex items-baseline gap-2">
                        <p className="text-xl font-bold text-white">{formatPrice(item.price)}</p>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <p className="text-xs text-gray-500 line-through">{formatPrice(item.originalPrice)}</p>
                        )}
                      </div>
                    </div>

                    {/* Size Info */}
                    {item.productSizes?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.productSizes.slice(0, 3).map((size) => (
                          <span key={size} className="text-xs text-gray-400 border border-white/15 px-2 py-0.5 rounded">
                            {size}
                          </span>
                        ))}
                        {item.productSizes.length > 3 && (
                          <span className="text-xs text-gray-500">+{item.productSizes.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-5">
                      <button
                        onClick={() => moveWishlistToCart(item)}
                        className="flex-1 bg-white text-black py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={16} />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.productId)}
                        className="border border-white/20 text-white p-2.5 rounded-xl hover:bg-white/10 transition"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default WishList