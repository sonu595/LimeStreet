import React from 'react'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'

const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`

const WishList = () => {
  const {
    wishlistItems,
    moveWishlistToCart,
    removeFromWishlist,
    storeLoading
  } = useStore()

  return (
    <div className="min-h-screen bg-black px-4 py-10 md:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Saved items</p>
            <h1 className="mt-3 text-4xl font-semibold text-white md:text-6xl">WISHLIST</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 md:text-base">
              Ye list har logged-in user ke liye alag hai, aur yahan koi default ya fake product show nahi ho raha.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-zinc-950 px-6 py-5">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Saved Count</p>
            <p className="mt-3 text-3xl font-semibold text-white">{wishlistItems.length}</p>
          </div>
        </div>

        {storeLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-zinc-950 px-6 py-16 text-center">
            <Heart className="mx-auto h-12 w-12 text-white/70" />
            <h2 className="mt-5 text-2xl font-semibold text-white">Wishlist is empty</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400 md:text-base">
              Jo products aap save karoge, wahi yahan dikhengi.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {wishlistItems.map((item) => (
              <article
                key={`${item.id}-${item.productId}`}
                className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950"
              >
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="h-80 w-full object-cover"
                />

                <div className="space-y-5 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-gray-500">
                      {item.productCategory || 'Product'}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">{item.productName}</h2>
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-2xl font-semibold text-white">{formatPrice(item.price)}</p>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <p className="mt-1 text-sm text-gray-500 line-through">
                          {formatPrice(item.originalPrice)}
                        </p>
                      )}
                    </div>
                    {item.discountPercentage ? (
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                        {item.discountPercentage}% OFF
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => moveWishlistToCart(item)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
                    >
                      <ShoppingBag size={16} />
                      Move to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.productId)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
                    >
                      <Trash2 size={16} />
                      Remove
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

export default WishList
