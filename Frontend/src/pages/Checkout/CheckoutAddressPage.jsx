import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import useAuth from '../../context/useAuth'
import { useStore } from '../../context/StoreContext'
import CheckoutFrame from './CheckoutFrame'
import { buildApiUrl } from '../../utils/api'
import { getVariantPrice } from '../../utils/productPricing'
import { buildDraftKey, createAddressForm, createPaymentForm, readCheckoutDraft, writeCheckoutDraft } from './checkoutShared.jsx'

const CheckoutAddressPage = ({ mode = 'cart' }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const { cartItems, cartSubtotal } = useStore()

  const [product, setProduct] = useState(null)
  const [loadingProduct, setLoadingProduct] = useState(mode === 'buy-now')
  const [error, setError] = useState('')
  const [addressForm, setAddressForm] = useState(createAddressForm(user))
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size') || '')
  const [selectedColor, setSelectedColor] = useState(searchParams.get('color') || '')

  const draftKey = buildDraftKey(mode, id)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    const draft = readCheckoutDraft(draftKey)
    if (draft?.addressForm) {
      setAddressForm(draft.addressForm)
    }
    if (draft?.quantity) {
      setQuantity(draft.quantity)
    }
    if (draft?.selectedSize) {
      setSelectedSize(draft.selectedSize)
    }
    if (draft?.selectedColor) {
      setSelectedColor(draft.selectedColor)
    }
  }, [draftKey])

  useEffect(() => {
    if (mode !== 'buy-now' || !id) {
      setLoadingProduct(false)
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
      .catch((fetchError) => {
        setError(fetchError.response?.data?.message || 'Unable to load this product for checkout.')
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

  const persistDraft = (nextAddressForm = addressForm) => {
    writeCheckoutDraft(draftKey, {
      addressForm: nextAddressForm,
      paymentForm: createPaymentForm(),
      quantity,
      selectedSize,
      selectedColor
    })
  }

  const handleAddressChange = (event) => {
    const { name, value } = event.target
    const nextForm = { ...addressForm, [name]: value }
    setAddressForm(nextForm)
    persistDraft(nextForm)
  }

  const handleUseSavedAddress = () => {
    if (!savedProfileComplete) {
      setError('Your saved profile is incomplete. Please complete the address fields first.')
      return
    }

    const nextForm = createAddressForm(user)
    setAddressForm(nextForm)
    persistDraft(nextForm)
    setError('')
  }

  const continueToPayment = () => {
    if (!isAddressFormComplete) {
      setError('Please complete the address details before continuing.')
      return
    }

    persistDraft()
    navigate(mode === 'buy-now' ? `/buy/${id}/payment` : '/checkout/payment')
  }

  if (loadingProduct) {
    return <div className="flex min-h-screen items-center justify-center bg-black"><div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white"></div></div>
  }

  return (
    <CheckoutFrame
      currentStep={2}
      loggedIn={isAuthenticated}
      title="Delivery address"
      description="Complete your address here, then continue to the payment page."
      backTo={mode === 'buy-now' ? `/product/${id}` : '/cart'}
      error={error}
      items={items}
      subtotal={subtotal}
      deliveryCharge={deliveryCharge}
      platformFee={platformFee}
      totalAmount={totalAmount}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="customerName" value={addressForm.customerName} onChange={handleAddressChange} placeholder="Full name" className="border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-white/30 sm:col-span-2 sm:px-4 sm:py-3" />
        <input name="contactNumber" value={addressForm.contactNumber} onChange={handleAddressChange} placeholder="Mobile number" className="border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-white/30 sm:col-span-2 sm:px-4 sm:py-3" />
        <input name="addressLine1" value={addressForm.addressLine1} onChange={handleAddressChange} placeholder="Address line 1" className="border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-white/30 sm:col-span-2 sm:px-4 sm:py-3" />
        <input name="addressLine2" value={addressForm.addressLine2} onChange={handleAddressChange} placeholder="Address line 2" className="border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-white/30 sm:col-span-2 sm:px-4 sm:py-3" />
        <input name="city" value={addressForm.city} onChange={handleAddressChange} placeholder="City" className="border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-white/30 sm:px-4 sm:py-3" />
        <input name="state" value={addressForm.state} onChange={handleAddressChange} placeholder="State" className="border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-white/30 sm:px-4 sm:py-3" />
        <input name="postalCode" value={addressForm.postalCode} onChange={handleAddressChange} placeholder="Postal code" className="border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-white/30 sm:px-4 sm:py-3" />
        <input name="country" value={addressForm.country} onChange={handleAddressChange} placeholder="Country" className="border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-white/30 sm:px-4 sm:py-3" />
      </div>

      {mode === 'buy-now' && product && (
        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Product options</p>
          {!!product.sizes?.length && (
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button key={size} type="button" onClick={() => setSelectedSize(size)} className={`rounded-full border px-2.5 py-1 text-[11px] transition sm:px-3 sm:py-1.5 sm:text-xs ${selectedSize === size ? 'border-white bg-white text-black' : 'border-white/10 text-zinc-400 hover:text-white'}`}>{size}</button>
              ))}
            </div>
          )}
          {!!product.colors?.length && (
            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button key={color} type="button" onClick={() => setSelectedColor(color)} className={`rounded-full border px-2.5 py-1 text-[11px] transition sm:px-3 sm:py-1.5 sm:text-xs ${selectedColor === color ? 'border-white bg-white text-black' : 'border-white/10 text-zinc-400 hover:text-white'}`}>{color}</button>
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

      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={continueToPayment} className="rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-zinc-200 sm:px-6 sm:py-3 sm:text-sm">
          Open payment page
        </button>
        <button type="button" onClick={handleUseSavedAddress} disabled={!savedProfileComplete} className="rounded-full border border-white/10 px-4 py-2.5 text-xs text-zinc-300 transition hover:text-white disabled:opacity-50 sm:px-6 sm:py-3 sm:text-sm">
          Use saved profile address
        </button>
      </div>
    </CheckoutFrame>
  )
}

export default CheckoutAddressPage
