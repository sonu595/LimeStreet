import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Check, ChevronRight, CreditCard, LockKeyhole, MapPin, ShieldCheck, UserRound } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import useAuth from '../../context/useAuth'
import { useStore } from '../../context/StoreContext'
import { PRODUCT_IMAGE_FALLBACK_SRC, handleProductImageError, resolveImageUrl } from '../../utils/image'
import { getVariantPrice } from '../../utils/productPricing'
import { buildApiUrl } from '../../utils/api'

const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`

const createAddressForm = (user) => ({
  customerName: user?.name || '',
  contactNumber: user?.contactNumber || '',
  addressLine1: user?.addressLine1 || '',
  addressLine2: user?.addressLine2 || '',
  city: user?.city || '',
  state: user?.state || '',
  postalCode: user?.postalCode || '',
  country: user?.country || 'India'
})

const steps = [
  { id: 1, label: 'Login', icon: UserRound },
  { id: 2, label: 'Address', icon: MapPin },
  { id: 3, label: 'Payment', icon: CreditCard }
]

const Stepper = ({ currentStep, loggedIn }) => (
  <div className="rounded-[28px] border border-white/10 bg-zinc-950 px-4 py-5 sm:px-6">
    <div className="flex items-start justify-between gap-3">
      {steps.map((step, index) => {
        const isCompleted = step.id === 1 ? loggedIn : currentStep > step.id
        const isCurrent = currentStep === step.id
        const Icon = step.icon

        return (
          <React.Fragment key={step.id}>
            <div className="flex min-w-0 flex-1 flex-col items-center text-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm transition ${
                isCompleted
                  ? 'border-emerald-400/30 bg-emerald-400/15 text-emerald-200'
                  : isCurrent
                    ? 'border-white/30 bg-white/10 text-white'
                    : 'border-white/10 bg-black/30 text-zinc-500'
              }`}>
                {isCompleted ? <Check size={16} /> : <Icon size={16} />}
              </div>
              <p className={`mt-3 text-sm font-medium ${
                isCompleted || isCurrent ? 'text-white' : 'text-zinc-500'
              }`}>
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`mt-5 h-px flex-1 ${
                currentStep > step.id || (step.id === 1 && loggedIn) ? 'bg-emerald-300/40' : 'bg-white/10'
              }`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  </div>
)

const CheckoutFlowPage = ({ mode = 'cart' }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const { cartItems, cartSubtotal, placeOrder, buyNowOrder, placingOrder } = useStore()

  const [product, setProduct] = useState(null)
  const [loadingProduct, setLoadingProduct] = useState(mode === 'buy-now')
  const [flowError, setFlowError] = useState('')
  const [currentStep, setCurrentStep] = useState(isAuthenticated ? 2 : 1)
  const [useSavedAddress, setUseSavedAddress] = useState(false)
  const [addressForm, setAddressForm] = useState(createAddressForm(user))
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer')
  const [paymentDetails, setPaymentDetails] = useState({
    accountHolder: '',
    accountNumber: '',
    ifscCode: '',
    upiId: ''
  })
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size') || '')
  const [selectedColor, setSelectedColor] = useState(searchParams.get('color') || '')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
      return
    }

    setCurrentStep(2)
  }, [isAuthenticated, navigate])

  useEffect(() => {
    setAddressForm(createAddressForm(user))
  }, [user])

  useEffect(() => {
    if (mode !== 'buy-now' || !id) {
      return
    }

    setLoadingProduct(true)
    axios.get(buildApiUrl(`/products/${id}`))
      .then((response) => {
        const nextProduct = response.data
        setProduct(nextProduct)
        setSelectedSize((current) => current || nextProduct.sizes?.[0] || '')
        setSelectedColor((current) => current || nextProduct.colors?.[0] || '')
      })
      .catch((error) => {
        setFlowError(error.response?.data?.message || 'Unable to load this product for checkout.')
      })
      .finally(() => {
        setLoadingProduct(false)
      })
  }, [id, mode])

  const savedProfileComplete = Boolean(
    user?.name &&
    user?.contactNumber &&
    user?.addressLine1 &&
    user?.city &&
    user?.state &&
    user?.postalCode
  )

  const isAddressFormComplete = Boolean(
    addressForm.customerName &&
    addressForm.contactNumber &&
    addressForm.addressLine1 &&
    addressForm.city &&
    addressForm.state &&
    addressForm.postalCode
  )

  const checkoutItems = useMemo(() => {
    if (mode === 'buy-now' && product) {
      const unitPrice = getVariantPrice(product, selectedSize, selectedColor)

      return [{
        id: `buy-${product.id}`,
        productName: product.name,
        productImage: product.imageUrls?.[0] || product.imageUrl,
        productCategory: product.category,
        selectedSize,
        selectedColor,
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity
      }]
    }

    return cartItems.map((item) => ({
      id: item.id,
      productName: item.productName,
      productImage: item.productImage,
      productCategory: item.productCategory,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
      quantity: item.quantity || 1,
      unitPrice: item.price || 0,
      totalPrice: (item.price || 0) * (item.quantity || 0)
    }))
  }, [cartItems, mode, product, quantity, selectedColor, selectedSize])

  const subtotal = useMemo(() => {
    if (mode === 'buy-now') {
      return checkoutItems.reduce((total, item) => total + item.totalPrice, 0)
    }

    return cartSubtotal
  }, [cartSubtotal, checkoutItems, mode])

  const deliveryCharge = subtotal > 999 ? 0 : 40
  const platformFee = 10
  const totalAmount = subtotal + deliveryCharge + platformFee

  const handleAddressChange = (event) => {
    const { name, value } = event.target
    setUseSavedAddress(false)
    setAddressForm((current) => ({ ...current, [name]: value }))
  }

  const handlePaymentDetailChange = (event) => {
    const { name, value } = event.target
    setPaymentDetails((current) => ({ ...current, [name]: value }))
  }

  const handleContinueFromAddress = () => {
    if (!isAddressFormComplete) {
      setFlowError('Please complete the address details before continuing.')
      return
    }

    setFlowError('')
    setCurrentStep(3)
  }

  const handleUseSavedAddress = () => {
    if (!savedProfileComplete) {
      setFlowError('Your saved profile is incomplete. Please fill in the address form to continue.')
      return
    }

    setAddressForm(createAddressForm(user))
    setUseSavedAddress(true)
    setFlowError('')
    setCurrentStep(3)
  }

  const handlePlaceOrder = async () => {
    if (!checkoutItems.length) {
      setFlowError('There are no items available for checkout.')
      return
    }

    setFlowError('')

    try {
      const payload = {
        ...addressForm,
        paymentMethod,
        paymentDetails
      }

      const createdOrder = mode === 'buy-now'
        ? await buyNowOrder({
            productId: product.id,
            quantity,
            selectedSize,
            selectedColor,
            deliveryDetails: payload
          })
        : await placeOrder(payload)

      navigate('/order-success', { state: { order: createdOrder } })
    } catch (error) {
      setFlowError(error.message || 'Unable to place your order right now.')
    }
  }

  if (loadingProduct) {
    return <div className="flex min-h-screen items-center justify-center bg-black"><div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white"></div></div>
  }

  if (!checkoutItems.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="w-full max-w-lg rounded-[32px] border border-white/10 bg-zinc-950 p-6 text-center">
          <p className="text-lg font-semibold text-white">Nothing to check out</p>
          <p className="mt-2 text-sm text-zinc-400">Add products to your cart before opening the checkout flow.</p>
          <Link to="/" className="mt-5 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200">
            Continue shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pb-24 md:pb-8">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Checkout</p>
            <h1 className="mt-2 text-2xl font-semibold text-white md:text-3xl">Complete your order</h1>
          </div>
          <Link to={mode === 'buy-now' && id ? `/product/${id}` : '/cart'} className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white">
            Back
            <ChevronRight size={14} />
          </Link>
        </div>

        <Stepper currentStep={currentStep} loggedIn={isAuthenticated} />

        {flowError && (
          <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {flowError}
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_360px]">
          <div className="space-y-6">
            <section className="rounded-[32px] border border-white/10 bg-zinc-950 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${isAuthenticated ? 'border-emerald-400/30 bg-emerald-400/15 text-emerald-200' : 'border-white/10 bg-black/30 text-zinc-500'}`}>
                  {isAuthenticated ? <Check size={16} /> : <UserRound size={16} />}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Login</h2>
                  <p className="text-sm text-zinc-400">{isAuthenticated ? `Signed in as ${user?.email}` : 'Please sign in to continue.'}</p>
                </div>
              </div>
            </section>

            <section className={`rounded-[32px] border p-5 sm:p-6 transition ${currentStep >= 2 ? 'border-white/10 bg-zinc-950' : 'border-white/5 bg-zinc-950/60 opacity-70'}`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${currentStep > 2 || useSavedAddress ? 'border-emerald-400/30 bg-emerald-400/15 text-emerald-200' : currentStep === 2 ? 'border-white/30 bg-white/10 text-white' : 'border-white/10 bg-black/30 text-zinc-500'}`}>
                  {currentStep > 2 || useSavedAddress ? <Check size={16} /> : <MapPin size={16} />}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Address</h2>
                  <p className="text-sm text-zinc-400">Choose your saved profile address or enter a one-time delivery address.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <label className="space-y-2 sm:col-span-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Full name</span>
                  <input name="customerName" value={addressForm.customerName} onChange={handleAddressChange} className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
                </label>
                <label className="space-y-2 sm:col-span-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Mobile number</span>
                  <input name="contactNumber" value={addressForm.contactNumber} onChange={handleAddressChange} className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
                </label>
                <label className="space-y-2 sm:col-span-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Address line 1</span>
                  <input name="addressLine1" value={addressForm.addressLine1} onChange={handleAddressChange} className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
                </label>
                <label className="space-y-2 sm:col-span-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Address line 2</span>
                  <input name="addressLine2" value={addressForm.addressLine2} onChange={handleAddressChange} className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
                </label>
                <label className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">City</span>
                  <input name="city" value={addressForm.city} onChange={handleAddressChange} className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
                </label>
                <label className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">State</span>
                  <input name="state" value={addressForm.state} onChange={handleAddressChange} className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
                </label>
                <label className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Postal code</span>
                  <input name="postalCode" value={addressForm.postalCode} onChange={handleAddressChange} className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
                </label>
                <label className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Country</span>
                  <input name="country" value={addressForm.country} onChange={handleAddressChange} className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
                </label>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={handleContinueFromAddress} className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200">
                  Continue to payment
                </button>
                <button
                  type="button"
                  onClick={handleUseSavedAddress}
                  disabled={!savedProfileComplete}
                  className="rounded-2xl border border-white/10 px-5 py-3 text-sm text-zinc-300 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Skip and use saved profile address
                </button>
              </div>
            </section>

            <section className={`rounded-[32px] border p-5 sm:p-6 transition ${currentStep >= 3 ? 'border-white/10 bg-zinc-950' : 'border-white/5 bg-zinc-950/60 opacity-70'}`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${currentStep === 3 ? 'border-white/30 bg-white/10 text-white' : 'border-white/10 bg-black/30 text-zinc-500'}`}>
                  <LockKeyhole size={16} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Payment</h2>
                  <p className="text-sm text-zinc-400">This is a placeholder payment step. You can update the final account details later.</p>
                </div>
              </div>

              {currentStep >= 3 && (
                <div className="mt-5 space-y-5">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { id: 'bank_transfer', label: 'Bank transfer' },
                      { id: 'upi', label: 'UPI' },
                      { id: 'cash_on_delivery', label: 'Cash on delivery' }
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`rounded-2xl border px-4 py-3 text-sm transition ${
                          paymentMethod === method.id
                            ? 'border-white bg-white text-black'
                            : 'border-white/10 bg-black text-zinc-300 hover:text-white'
                        }`}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'bank_transfer' && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input name="accountHolder" value={paymentDetails.accountHolder} onChange={handlePaymentDetailChange} placeholder="Account holder name" className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
                      <input name="accountNumber" value={paymentDetails.accountNumber} onChange={handlePaymentDetailChange} placeholder="Account number" className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
                      <input name="ifscCode" value={paymentDetails.ifscCode} onChange={handlePaymentDetailChange} placeholder="IFSC code" className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30 sm:col-span-2" />
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <input name="upiId" value={paymentDetails.upiId} onChange={handlePaymentDetailChange} placeholder="UPI ID" className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30" />
                  )}

                  <div className="rounded-2xl border border-white/8 bg-black/30 px-4 py-3 text-sm text-zinc-300">
                    This payment step is a temporary placeholder for now. Your order will still be created successfully when you continue.
                  </div>

                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                    className="w-full rounded-2xl bg-white py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {placingOrder ? 'Placing order...' : 'Place order'}
                  </button>
                </div>
              )}
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-[32px] border border-white/10 bg-zinc-950 p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-white" />
                <h2 className="text-lg font-semibold text-white">Order summary</h2>
              </div>

              <div className="mt-5 space-y-3">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-2xl border border-white/8 bg-black/30 p-3">
                    <img
                      src={resolveImageUrl(item.productImage) || PRODUCT_IMAGE_FALLBACK_SRC}
                      alt={item.productName}
                      className="h-18 w-14 rounded-xl object-cover"
                      onError={handleProductImageError}
                    />
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-medium text-white">{item.productName}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Qty {item.quantity} • {item.selectedSize || 'Default size'} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                      </p>
                      <p className="mt-2 text-sm text-zinc-300">{formatPrice(item.totalPrice)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {mode === 'buy-now' && product && (
                <div className="mt-4 rounded-2xl border border-white/8 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Quick adjustments</p>
                  {!!product.sizes?.length && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`rounded-full border px-3 py-1.5 text-xs transition ${
                            selectedSize === size ? 'border-white bg-white text-black' : 'border-white/10 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                  {!!product.colors?.length && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`rounded-full border px-3 py-1.5 text-xs transition ${
                            selectedColor === color ? 'border-white bg-white text-black' : 'border-white/10 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 inline-flex items-center rounded-full border border-white/12 bg-black px-1">
                    <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} className="rounded-full p-2 text-white hover:bg-white/10">-</button>
                    <span className="w-8 text-center text-sm text-white">{quantity}</span>
                    <button type="button" onClick={() => setQuantity((current) => current + 1)} className="rounded-full p-2 text-white hover:bg-white/10">+</button>
                  </div>
                </div>
              )}

              <div className="mt-5 space-y-3 border-t border-white/10 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Delivery</span>
                  <span className="text-white">{deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Platform fee</span>
                  <span className="text-white">{formatPrice(platformFee)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-white">{formatPrice(totalAmount)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default CheckoutFlowPage
