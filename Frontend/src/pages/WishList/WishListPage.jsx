import React from 'react'
import { ArrowRight, Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import { PRODUCT_IMAGE_FALLBACK_SRC, handleProductImageError, resolveImageUrl } from '../../utils/image'

const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`

const WishListPage = () => {
  const {
    wishlistItems,
    moveWishlistToCart,
    removeFromWishlist,
    storeLoading
  } = useStore()

  return (
    <div className="min-h-screen bg-black pb-24 md:pb-8">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-white md:text-3xl">Wishlist</h1>
            <p className="mt-1 text-sm text-zinc-400">
              {wishlistItems.length} saved {wishlistItems.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white">
            Browse products
            <ArrowRight size={14} />
          </Link>
        </div>

        {storeLoading ? (
          <div className="flex h-72 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-zinc-950 px-6 py-14 text-center">
            <Heart className="mx-auto h-12 w-12 text-zinc-600" />
            <h2 className="mt-4 text-xl font-semibold text-white">Wishlist is empty</h2>
            <p className="mt-2 text-sm text-zinc-400">Save products here for later.</p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
            >
              Explore products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((item) => (
              <article
                key={`${item.id}-${item.productId}`}
                className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950"
              >
                <div className="relative h-44 overflow-hidden bg-black sm:h-52">
                  <img
                    src={resolveImageUrl(item.productImage) || PRODUCT_IMAGE_FALLBACK_SRC}
                    alt={item.productName}
                    className="h-full w-full object-cover"
                    onError={handleProductImageError}
                  />
                  {item.discountPercentage && (
                    <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2 py-1 text-[10px] text-white">
                      {item.discountPercentage}% OFF
                    </span>
                  )}
                </div>

                <div className="space-y-3 p-3.5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{item.productCategory || 'Product'}</p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-medium text-white">{item.productName}</h3>
                  </div>

                  <div>
                    <p className="text-base font-semibold text-white">{formatPrice(item.price)}</p>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <p className="text-[11px] text-zinc-500 line-through">{formatPrice(item.originalPrice)}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => moveWishlistToCart(item, {
                        selectedSize: item.productSizes?.[0] || '',
                        selectedColor: item.productColors?.[0] || ''
                      })}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-white px-3 py-2 text-[11px] font-medium text-black transition hover:bg-zinc-200"
                    >
                      <ShoppingBag size={13} />
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(item.productId)}
                      className="rounded-2xl border border-white/12 px-3 py-2 text-zinc-400 transition hover:bg-white/8 hover:text-white"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default WishListPage
