import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Heart, ShoppingBag } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'

const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`

const ProductDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, toggleWishlist, isInWishlist } = useStore()
  const [product, setProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState('')

  useEffect(() => {
    axios.get(`http://localhost:8080/api/products/${id}`)
      .then((response) => {
        const nextProduct = response.data
        setProduct(nextProduct)
        setSelectedSize(nextProduct.sizes?.[0] || '')
        setSelectedColor(nextProduct.colors?.[0] || '')
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-black"><div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white"></div></div>
  }

  if (!product) {
    return <div className="flex min-h-screen items-center justify-center bg-black text-zinc-400">Product not found.</div>
  }

  const liked = isInWishlist(product.id)

  const handleAddToCart = async () => {
    setBusy('cart')
    try {
      await addToCart(product, 1, { selectedSize, selectedColor })
    } finally {
      setBusy('')
    }
  }

  const handleBuyNow = () => {
    navigate(`/buy/${product.id}?size=${encodeURIComponent(selectedSize)}&color=${encodeURIComponent(selectedColor)}`)
  }

  return (
    <div className="min-h-screen bg-black pb-24 md:pb-8">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-zinc-950">
          <img src={product.imageUrls?.[0] || product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="rounded-[32px] border border-white/10 bg-zinc-950 p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{product.category}</p>
          <h1 className="mt-2 text-2xl font-semibold text-white md:text-3xl">{product.name}</h1>
          <div className="mt-4 flex items-end gap-3">
            <p className="text-2xl font-semibold text-white">{formatPrice(product.price)}</p>
            {product.originalPrice && <p className="text-sm text-zinc-500 line-through">{formatPrice(product.originalPrice)}</p>}
          </div>

          <p className="mt-5 text-sm leading-7 text-zinc-300">{product.description}</p>

          {!!product.sizes?.length && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Select size</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button key={size} type="button" onClick={() => setSelectedSize(size)} className={`rounded-full border px-3 py-2 text-xs transition ${selectedSize === size ? 'border-white bg-white text-black' : 'border-white/10 text-zinc-400 hover:text-white'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!!product.colors?.length && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Select color</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button key={color} type="button" onClick={() => setSelectedColor(color)} className={`rounded-full border px-3 py-2 text-xs transition ${selectedColor === color ? 'border-white bg-white text-black' : 'border-white/10 text-zinc-400 hover:text-white'}`}>
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={handleAddToCart} disabled={busy === 'cart'} className="inline-flex items-center gap-2 rounded-2xl border border-white/12 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/8">
              <ShoppingBag size={16} />
              {busy === 'cart' ? 'Adding...' : 'Add to cart'}
            </button>
            <button type="button" onClick={handleBuyNow} className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200">
              Buy now
            </button>
            <button type="button" onClick={() => toggleWishlist(product)} className="inline-flex items-center gap-2 rounded-2xl border border-white/12 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/8">
              <Heart size={16} fill={liked ? '#ef4444' : 'none'} color={liked ? '#ef4444' : 'white'} />
              {liked ? 'Wishlisted' : 'Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsPage
