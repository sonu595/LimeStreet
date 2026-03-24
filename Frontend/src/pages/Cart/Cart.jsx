import React from 'react'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'

const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`

const Cart = () => {
  const {
    cartItems,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    storeLoading
  } = useStore()

  return (
    <div className="min-h-screen bg-black px-4 py-10 md:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Your bag</p>
            <h1 className="mt-3 text-4xl font-semibold text-white md:text-6xl">CART</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 md:text-base">
              Sirf current logged-in user ke cart items yahan show ho rahe hain.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-zinc-950 px-6 py-5">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Subtotal</p>
            <p className="mt-3 text-3xl font-semibold text-white">{formatPrice(cartSubtotal)}</p>
          </div>
        </div>

        {storeLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-zinc-950 px-6 py-16 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-white/70" />
            <h2 className="mt-5 text-2xl font-semibold text-white">Cart is empty</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400 md:text-base">
              Abhi tak aapne koi product cart me add nahi kiya.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <article
                  key={`${item.id}-${item.productId}`}
                  className="rounded-3xl border border-white/10 bg-zinc-950 p-4 md:p-5"
                >
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="h-48 w-full rounded-3xl object-cover sm:h-40 sm:w-32"
                    />

                    <div className="flex flex-1 flex-col gap-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.28em] text-gray-500">
                            {item.productCategory || 'Product'}
                          </p>
                          <h2 className="mt-2 text-2xl font-semibold text-white">{item.productName}</h2>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {(item.productSizes || []).map((size) => (
                              <span
                                key={`${item.productId}-${size}`}
                                className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-gray-300"
                              >
                                {size}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:bg-white hover:text-black"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>

                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-2xl font-semibold text-white">{formatPrice(item.price)}</p>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <p className="mt-1 text-sm text-gray-500 line-through">
                              {formatPrice(item.originalPrice)}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center rounded-full border border-white/15 bg-black px-2 py-1">
                            <button
                              onClick={() => updateCartQuantity(item.productId, (item.quantity || 1) - 1)}
                              className="rounded-full p-2 text-white transition hover:bg-white/10"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="min-w-10 text-center text-sm font-medium text-white">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.productId, (item.quantity || 1) + 1)}
                              className="rounded-full p-2 text-white transition hover:bg-white/10"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <p className="min-w-28 text-right text-lg font-semibold text-white">
                            {formatPrice((item.price || 0) * (item.quantity || 0))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-3xl border border-white/10 bg-zinc-950 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Summary</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Order Preview</h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Items</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Total Quantity</span>
                  <span>{cartItems.reduce((total, item) => total + (item.quantity || 0), 0)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-4 text-base font-semibold text-white">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartSubtotal)}</span>
                </div>
              </div>

              <button
                onClick={clearCart}
                className="mt-6 w-full rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
              >
                Clear Cart
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
