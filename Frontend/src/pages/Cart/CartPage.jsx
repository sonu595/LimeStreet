import React, { useState } from 'react'
import { AlertTriangle, CreditCard, Minus, Plus, Shield, ShoppingBag, Trash2, Truck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import OrderDetailsModal from '../../Component/Order/OrderDetailsModal'
import useAuth from '../../context/useAuth'
import { useStore } from '../../context/StoreContext'
import { PRODUCT_IMAGE_FALLBACK_SRC, handleProductImageError, resolveImageUrl } from '../../utils/image'

const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`

const CartPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    cartItems,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
    placingOrder,
    storeLoading
  } = useStore()
  const [error, setError] = useState('')
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)

  const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 0), 0)
  const deliveryCharge = cartSubtotal > 999 ? 0 : 40
  const platformFee = 10
  const totalAmount = cartSubtotal + deliveryCharge + platformFee
  const isProfileComplete = Boolean(
    user?.name &&
    user?.contactNumber &&
    user?.addressLine1 &&
    user?.city &&
    user?.state &&
    user?.postalCode
  )

  const handleCheckout = async () => {
    setError('')
    setShowCheckoutModal(true)
  }

  const handlePlaceOrderWithDetails = async (deliveryDetails = null) => {
    try {
      const createdOrder = await placeOrder(deliveryDetails)
      setShowCheckoutModal(false)
      navigate('/order-success', { state: { order: createdOrder } })
    } catch (checkoutError) {
      setError(checkoutError.message)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-white md:text-3xl">Your Cart</h1>
            <p className="mt-1 text-sm text-zinc-400">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} ready for checkout
            </p>
          </div>
          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-sm text-zinc-500 transition hover:text-white"
            >
              Clear cart
            </button>
          )}
        </div>

        {!isProfileComplete && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/8 px-4 py-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-300" />
              <div>
                <p className="text-sm font-medium text-amber-100">Complete your profile before ordering</p>
                <p className="text-xs text-amber-200/70">Ya phir checkout popup me temporary delivery details bhar do.</p>
              </div>
            </div>
            <Link to="/profile" className="rounded-full bg-white px-4 py-2 text-xs font-medium text-black transition hover:bg-zinc-200">
              Update profile
            </Link>
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {storeLoading ? (
          <div className="flex h-72 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-zinc-950 px-6 py-14 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-zinc-600" />
            <h2 className="mt-4 text-xl font-semibold text-white">Your cart is empty</h2>
            <p className="mt-2 text-sm text-zinc-400">Add a few products and they will appear here.</p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.95fr)]">
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.productId}`}
                  className="rounded-[24px] border border-white/10 bg-zinc-950 p-3.5 transition hover:border-white/20 sm:p-4"
                >
                  <div className="flex gap-3 sm:gap-4">
                    <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-black sm:w-24">
                      <img
                        src={resolveImageUrl(item.productImage) || PRODUCT_IMAGE_FALLBACK_SRC}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                        onError={handleProductImageError}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{item.productCategory || 'Product'}</p>
                          <h3 className="mt-1 line-clamp-2 text-sm font-medium text-white sm:text-base">{item.productName}</h3>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {item.selectedSize && (
                              <span className="rounded-full border border-white/12 px-2 py-1 text-[10px] text-zinc-300">
                                Size {item.selectedSize}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="rounded-full border border-white/12 px-2 py-1 text-[10px] text-zinc-300">
                                {item.selectedColor}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="flex items-center gap-1 text-xs text-zinc-500 transition hover:text-red-400"
                        >
                          <Trash2 size={14} />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-3">
                        <div>
                          <p className="text-base font-semibold text-white">{formatPrice(item.price)}</p>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <p className="text-[11px] text-zinc-500 line-through">{formatPrice(item.originalPrice)}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center rounded-full border border-white/12 bg-black px-1">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, (item.quantity || 1) - 1)}
                              className="rounded-full p-2 transition hover:bg-white/10"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-8 text-center text-sm text-white">{item.quantity || 1}</span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, (item.quantity || 1) + 1)}
                              className="rounded-full p-2 transition hover:bg-white/10"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <p className="min-w-[84px] text-right text-sm font-medium text-white sm:text-base">
                            {formatPrice((item.price || 0) * (item.quantity || 0))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Link to="/" className="inline-flex items-center gap-2 pt-1 text-sm text-zinc-400 transition hover:text-white">
                Continue shopping
              </Link>
            </div>

            <div className="lg:sticky lg:top-24 lg:h-fit">
              <div className="rounded-[28px] border border-white/10 bg-zinc-950 p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-white">Order Summary</h3>

                <div className="mt-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Subtotal</span>
                    <span className="text-white">{formatPrice(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Delivery</span>
                    <span className={deliveryCharge === 0 ? 'text-emerald-400' : 'text-white'}>
                      {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Platform fee</span>
                    <span className="text-white">{formatPrice(platformFee)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between text-base font-semibold">
                      <span className="text-white">Total</span>
                      <span className="text-white">{formatPrice(totalAmount)}</span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">Taxes included where applicable.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={placingOrder}
                  className="mt-6 w-full rounded-2xl bg-white py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {placingOrder ? 'Placing order...' : 'Place order'}
                </button>

                <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-zinc-500">
                  <div className="flex items-center justify-center gap-1 rounded-2xl border border-white/8 px-2 py-2">
                    <Shield size={12} />
                    Secure
                  </div>
                  <div className="flex items-center justify-center gap-1 rounded-2xl border border-white/8 px-2 py-2">
                    <CreditCard size={12} />
                    Checkout
                  </div>
                  <div className="flex items-center justify-center gap-1 rounded-2xl border border-white/8 px-2 py-2">
                    <Truck size={12} />
                    Delivery
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <OrderDetailsModal
        open={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onSkip={() => handlePlaceOrderWithDetails()}
        onConfirm={handlePlaceOrderWithDetails}
        initialDetails={{
          contactNumber: user?.contactNumber || '',
          addressLine1: user?.addressLine1 || '',
          addressLine2: user?.addressLine2 || '',
          city: user?.city || '',
          state: user?.state || '',
          postalCode: user?.postalCode || ''
        }}
        savedDetailsComplete={isProfileComplete}
        submitting={placingOrder}
        title="Confirm delivery details for this cart order"
      />
    </div>
  )
}

export default CartPage
