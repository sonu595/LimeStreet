import React from 'react'
import { Minus, Plus, ShoppingBag, Trash2, Heart, Shield, Truck, CreditCard } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'

const formatPrice = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`

const Cart = () => {
  const {
    cartItems,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    storeLoading
  } = useStore()

  const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 0), 0)
  const deliveryCharge = cartSubtotal > 999 ? 0 : 40
  const platformFee = 10
  const totalAmount = cartSubtotal + deliveryCharge + platformFee

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Shopping Cart</h1>
          <p className="text-gray-400 text-sm mt-1">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        {storeLoading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-zinc-950 rounded-2xl border border-white/10 p-12 text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-600" />
            <h2 className="mt-4 text-2xl font-semibold text-white">Your cart is empty</h2>
            <p className="mt-2 text-gray-400">Looks like you haven't added anything to your cart yet</p>
            <Link
              to="/"
              className="inline-block mt-6 bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Cart Items Section - Left Column */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.productId}`}
                  className="bg-zinc-950 rounded-2xl border border-white/10 p-4 hover:border-white/20 transition"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 bg-black rounded-xl overflow-hidden">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                        <div>
                          <p className="text-xs text-gray-500 uppercase">{item.productCategory || 'Product'}</p>
                          <h3 className="text-base md:text-lg font-semibold text-white mt-0.5 line-clamp-2">
                            {item.productName}
                          </h3>
                          
                          {/* Sizes */}
                          {item.productSizes?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {item.productSizes.map((size) => (
                                <span key={size} className="text-xs border border-white/15 px-2 py-0.5 rounded text-gray-400">
                                  {size}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-gray-500 hover:text-red-500 transition text-sm flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>

                      {/* Price & Quantity */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 pt-2 border-t border-white/10">
                        <div>
                          <p className="text-lg font-bold text-white">{formatPrice(item.price)}</p>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <p className="text-xs text-gray-500 line-through">{formatPrice(item.originalPrice)}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 mt-3 sm:mt-0">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1 bg-black rounded-full border border-white/15">
                            <button
                              onClick={() => updateCartQuantity(item.productId, (item.quantity || 1) - 1)}
                              className="p-2 hover:bg-white/10 rounded-full transition disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm text-white">{item.quantity || 1}</span>
                            <button
                              onClick={() => updateCartQuantity(item.productId, (item.quantity || 1) + 1)}
                              className="p-2 hover:bg-white/10 rounded-full transition"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Item Total */}
                          <p className="text-base font-semibold text-white min-w-[80px] text-right">
                            {formatPrice((item.price || 0) * (item.quantity || 0))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping Link */}
              <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mt-2">
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary - Right Column (Sticky) */}
            <div className="lg:sticky lg:top-6 h-fit">
              <div className="bg-zinc-950 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal ({totalItems} items)</span>
                    <span className="text-white">{formatPrice(cartSubtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Delivery Charges</span>
                    <span className={deliveryCharge === 0 ? "text-green-500" : "text-white"}>
                      {deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Platform Fee</span>
                    <span className="text-white">{formatPrice(platformFee)}</span>
                  </div>
                  
                  {cartSubtotal < 1000 && cartSubtotal > 0 && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mt-2">
                      <p className="text-xs text-green-400">
                        🚚 Add {formatPrice(1000 - cartSubtotal)} more to get FREE delivery
                      </p>
                    </div>
                  )}
                  
                  <div className="border-t border-white/10 pt-4 mt-2">
                    <div className="flex justify-between text-base font-bold">
                      <span className="text-white">Total Amount</span>
                      <span className="text-white">{formatPrice(totalAmount)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">Inclusive of all taxes</p>
                  </div>
                </div>

                {/* Checkout Button */}
                <button className="w-full mt-6 bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
                  Proceed to Checkout
                </button>

                {/* Payment Info */}
                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Shield size={12} />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard size={12} />
                    <span>100% Payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck size={12} />
                    <span>Fast Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart