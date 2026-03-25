import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AlertTriangle } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import OrderDetailsModal from '../../Component/Order/OrderDetailsModal'
import useAuth from '../../context/useAuth'
import { useStore } from '../../context/StoreContext'
import { getVariantPrice } from '../../utils/productPricing'
import { buildApiUrl } from '../../utils/api'

const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`

const BuyNowPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const { buyNowOrder, placingOrder } = useStore()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size') || '')
  const [selectedColor, setSelectedColor] = useState(searchParams.get('color') || '')
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(buildApiUrl(`/products/${id}`))
      .then((response) => {
        const nextProduct = response.data
        setProduct(nextProduct)
        setSelectedSize((current) => current || nextProduct.sizes?.[0] || '')
        setSelectedColor((current) => current || nextProduct.colors?.[0] || '')
      })
  }, [id])

  if (!product) {
    return <div className="flex min-h-screen items-center justify-center bg-black"><div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white"></div></div>
  }

  const isProfileComplete = Boolean(
    user?.name &&
    user?.contactNumber &&
    user?.addressLine1 &&
    user?.city &&
    user?.state &&
    user?.postalCode
  )

  const unitPrice = getVariantPrice(product, selectedSize, selectedColor)
  const total = Number(unitPrice || 0) * quantity
  const deliveryCharge = total > 999 ? 0 : 40
  const platformFee = 10

  const handlePlaceOrder = async () => {
    setError('')
    setShowCheckoutModal(true)
  }

  const submitBuyNowOrder = async (deliveryDetails = null) => {
    try {
      const createdOrder = await buyNowOrder({
        productId: product.id,
        quantity,
        selectedSize,
        selectedColor,
        deliveryDetails
      })
      setShowCheckoutModal(false)
      navigate('/order-success', { state: { order: createdOrder } })
    } catch (submitError) {
      setError(submitError.message || 'Failed to place order')
    }
  }

  return (
    <div className="min-h-screen bg-black pb-24 md:pb-8">
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
        {!isProfileComplete && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/8 px-4 py-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-300" />
              <div>
                <p className="text-sm font-medium text-amber-100">Complete your profile before buying</p>
                <p className="text-xs text-amber-200/70">Aap popup me temporary delivery details bhi bhar sakte ho.</p>
              </div>
            </div>
          </div>
        )}

        {error && <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="rounded-[32px] border border-white/10 bg-zinc-950 p-5">
            <div className="flex gap-4">
              <img src={product.imageUrls?.[0] || product.imageUrl} alt={product.name} className="h-28 w-24 rounded-2xl object-cover" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{product.category}</p>
                <h1 className="mt-1 text-xl font-semibold text-white">{product.name}</h1>
                <p className="mt-3 text-sm text-zinc-300">{formatPrice(unitPrice)}</p>
              </div>
            </div>

            {!!product.sizes?.length && (
              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Size</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.sizes.map((size) => <button key={size} type="button" onClick={() => setSelectedSize(size)} className={`rounded-full border px-3 py-2 text-xs transition ${selectedSize === size ? 'border-white bg-white text-black' : 'border-white/10 text-zinc-400 hover:text-white'}`}>{size}</button>)}
                </div>
              </div>
            )}

            {!!product.colors?.length && (
              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Color</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.colors.map((color) => <button key={color} type="button" onClick={() => setSelectedColor(color)} className={`rounded-full border px-3 py-2 text-xs transition ${selectedColor === color ? 'border-white bg-white text-black' : 'border-white/10 text-zinc-400 hover:text-white'}`}>{color}</button>)}
                </div>
              </div>
            )}

            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Quantity</p>
              <div className="mt-3 inline-flex items-center rounded-full border border-white/12 bg-black px-1">
                <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} className="rounded-full p-2 hover:bg-white/10">-</button>
                <span className="w-8 text-center text-sm text-white">{quantity}</span>
                <button type="button" onClick={() => setQuantity((current) => current + 1)} className="rounded-full p-2 hover:bg-white/10">+</button>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-zinc-950 p-5">
            <h2 className="text-lg font-semibold text-white">Buy Now Summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-zinc-400">Product total</span><span className="text-white">{formatPrice(total)}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Delivery</span><span className="text-white">{deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Platform fee</span><span className="text-white">{formatPrice(platformFee)}</span></div>
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between text-base font-semibold"><span className="text-white">Total</span><span className="text-white">{formatPrice(total + deliveryCharge + platformFee)}</span></div>
              </div>
            </div>

            <button type="button" onClick={handlePlaceOrder} disabled={placingOrder} className="mt-6 w-full rounded-2xl bg-white py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:opacity-70">
              {placingOrder ? 'Placing order...' : 'Confirm order'}
            </button>
          </div>
        </div>

        <OrderDetailsModal
          open={showCheckoutModal}
          onClose={() => setShowCheckoutModal(false)}
          onSkip={() => submitBuyNowOrder()}
          onConfirm={submitBuyNowOrder}
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
          title="Confirm delivery details for this order"
        />
      </div>
    </div>
  )
}

export default BuyNowPage
