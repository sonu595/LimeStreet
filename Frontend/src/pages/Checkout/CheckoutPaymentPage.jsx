import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAuth from '../../context/useAuth'
import { useStore } from '../../context/StoreContext'
import CheckoutFrame from './CheckoutFrame'
import { buildApiUrl } from '../../utils/api'
import { getVariantPrice } from '../../utils/productPricing'
import { buildDraftKey, clearCheckoutDraft, createPaymentForm, readCheckoutDraft, writeCheckoutDraft } from './checkoutShared.jsx'

const CheckoutPaymentPage = ({ mode = 'cart' }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const { cartItems, cartSubtotal, placeOrder, buyNowOrder, placingOrder } = useStore()

  const draftKey = buildDraftKey(mode, id)
  const [product, setProduct] = useState(null)
  const [loadingProduct, setLoadingProduct] = useState(mode === 'buy-now')
  const [error, setError] = useState('')
  const [addressForm, setAddressForm] = useState(null)
  const [paymentForm, setPaymentForm] = useState(createPaymentForm())
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
      return
    }

    const draft = readCheckoutDraft(draftKey)
    if (!draft?.addressForm) {
      navigate(mode === 'buy-now' ? `/buy/${id}` : '/checkout', { replace: true })
      return
    }

    setAddressForm(draft.addressForm)
    setPaymentForm(draft.paymentForm || createPaymentForm())
    setQuantity(draft.quantity || 1)
    setSelectedSize(draft.selectedSize || '')
    setSelectedColor(draft.selectedColor || '')
  }, [draftKey, id, isAuthenticated, mode, navigate])

  useEffect(() => {
    if (mode !== 'buy-now' || !id) {
      setLoadingProduct(false)
      return
    }

    setLoadingProduct(true)
    axios.get(buildApiUrl(`/products/${id}`))
      .then((response) => {
        setProduct(response.data)
      })
      .catch((fetchError) => {
        setError(fetchError.response?.data?.message || 'Unable to load this product for payment.')
      })
      .finally(() => {
        setLoadingProduct(false)
      })
  }, [id, mode])

  const items = useMemo(() => {
    if (mode === 'buy-now' && product) {
      const unitPrice = getVariantPrice(product, selectedSize, selectedColor)
      return [{
        id: `buy-${product.id}`,
        productName: product.name,
        productImage: product.imageUrls?.[0] || product.imageUrl,
        selectedSize,
        selectedColor,
        quantity,
        totalPrice: unitPrice * quantity
      }]
    }

    return cartItems.map((item) => ({
      id: item.id,
      productName: item.productName,
      productImage: item.productImage,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
      quantity: item.quantity || 1,
      totalPrice: (item.price || 0) * (item.quantity || 0)
    }))
  }, [cartItems, mode, product, quantity, selectedColor, selectedSize])

  const subtotal = mode === 'buy-now'
    ? items.reduce((total, item) => total + item.totalPrice, 0)
    : cartSubtotal

  const deliveryCharge = subtotal > 999 ? 0 : 40
  const platformFee = 10
  const totalAmount = subtotal + deliveryCharge + platformFee

  const persistDraft = (nextPaymentForm) => {
    writeCheckoutDraft(draftKey, {
      addressForm,
      paymentForm: nextPaymentForm,
      quantity,
      selectedSize,
      selectedColor
    })
  }

  const handlePaymentChange = (event) => {
    const { name, value } = event.target
    const nextForm = { ...paymentForm, [name]: value }
    setPaymentForm(nextForm)
    persistDraft(nextForm)
  }

  const handlePaymentMethodChange = (paymentMethod) => {
    const nextForm = { ...paymentForm, paymentMethod }
    setPaymentForm(nextForm)
    persistDraft(nextForm)
  }

  const handlePlaceOrder = async () => {
    try {
      const payload = {
        ...addressForm,
        paymentMethod: paymentForm.paymentMethod,
        paymentDetails: paymentForm
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

      clearCheckoutDraft(draftKey)
      navigate('/order-success', { state: { order: createdOrder } })
    } catch (submitError) {
      setError(submitError.message || 'Unable to place your order right now.')
    }
  }

  if (loadingProduct || !addressForm) {
    return <div className="flex min-h-screen items-center justify-center bg-black"><div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white"></div></div>
  }

  return (
    <CheckoutFrame
      currentStep={3}
      loggedIn={isAuthenticated}
      title="Payment"
      description="This is a separate payment page, ready for your final account details later."
      backTo={mode === 'buy-now' ? `/buy/${id}` : '/checkout'}
      error={error}
      items={items}
      subtotal={subtotal}
      deliveryCharge={deliveryCharge}
      platformFee={platformFee}
      totalAmount={totalAmount}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { id: 'bank_transfer', label: 'Bank transfer' },
          { id: 'upi', label: 'UPI' },
          { id: 'cash_on_delivery', label: 'Cash on delivery' }
        ].map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => handlePaymentMethodChange(method.id)}
            className={`border px-3 py-3 text-xs transition sm:px-4 sm:py-4 sm:text-sm ${
              paymentForm.paymentMethod === method.id
                ? 'border-white bg-white text-black'
                : 'border-white/10 bg-zinc-950 text-zinc-300 hover:text-white'
            }`}
          >
            {method.label}
          </button>
        ))}
      </div>

      {paymentForm.paymentMethod === 'bank_transfer' && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <input name="accountHolder" value={paymentForm.accountHolder} onChange={handlePaymentChange} placeholder="Account holder name" className="border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-white/30 sm:px-4 sm:py-3" />
          <input name="accountNumber" value={paymentForm.accountNumber} onChange={handlePaymentChange} placeholder="Account number" className="border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-white/30 sm:px-4 sm:py-3" />
          <input name="ifscCode" value={paymentForm.ifscCode} onChange={handlePaymentChange} placeholder="IFSC code" className="border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-white/30 sm:col-span-2 sm:px-4 sm:py-3" />
        </div>
      )}

      {paymentForm.paymentMethod === 'upi' && (
        <div className="mt-6">
          <input name="upiId" value={paymentForm.upiId} onChange={handlePaymentChange} placeholder="UPI ID" className="w-full border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-white/30 sm:px-4 sm:py-3" />
        </div>
      )}

      <div className="mt-6 border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-300">
        This is a placeholder payment page. Replace the details later with your final payment setup.
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={handlePlaceOrder} disabled={placingOrder} className="rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-60 sm:px-6 sm:py-3 sm:text-sm">
          {placingOrder ? 'Placing order...' : 'Place order'}
        </button>
        <Link to={mode === 'buy-now' ? `/buy/${id}` : '/checkout'} className="rounded-full border border-white/10 px-4 py-2.5 text-xs text-zinc-300 transition hover:text-white sm:px-6 sm:py-3 sm:text-sm">
          Back to address
        </Link>
      </div>
    </CheckoutFrame>
  )
}

export default CheckoutPaymentPage
